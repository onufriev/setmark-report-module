#!/usr/bin/env python3
from __future__ import annotations

from common import ROOT, SCHEMA_VERSION, evidence_applies_to, load, now, project_path, save, sha256, source_snapshot_record

VALID_CLOSED = {
    'Подтверждено источником',
    'Подтверждено Product Manager',
    'Временно принято Product Manager',
    'Не применимо - подтверждено Product Manager',
}
EVIDENCE_TYPES = {
    'Подтверждено источником': {'SOURCE_EXCERPT'},
    'Подтверждено Product Manager': {'PRODUCT_MANAGER_DECISION'},
    'Временно принято Product Manager': {'PRODUCT_MANAGER_DECISION'},
    'Не применимо - подтверждено Product Manager': {'PRODUCT_MANAGER_DECISION'},
}

catalog = load('internal/domain-catalog.json')
index = load('product/requirements-index.json')
evidence_doc = load('product/evidence-register.json')
manifest = load('sources/source-manifest.json')
evidence_by_id = {item.get('id'): item for item in evidence_doc.get('evidence', []) if item.get('id')}
source_by_id = {item.get('id'): item for item in manifest.get('entries', []) if item.get('id')}


def valid_source_evidence(item: dict) -> tuple[bool, str]:
    source = source_by_id.get(item.get('sourceId'))
    if not source:
        return False, 'исходный источник не зарегистрирован'
    try:
        snapshot = project_path(item.get('snapshotPath', ''), must_exist=True, allowed_root='sources/snapshots')
    except SystemExit as exc:
        return False, str(exc)
    snapshot_record = source_snapshot_record(source, item.get('snapshotPath', ''))
    if not snapshot_record:
        return False, 'снимок не зарегистрирован у источника'
    digest = sha256(snapshot)
    if digest != snapshot_record.get('snapshotSha256') or digest != item.get('snapshotSha256'):
        return False, 'снимок источника изменён'
    text = snapshot.read_text(encoding='utf-8', errors='replace')
    if str(item.get('excerpt') or '') not in text:
        return False, 'выдержка больше не найдена в снимке'
    if item.get('verified') is not True:
        return False, 'выдержка не помечена проверенной'
    return True, ''


def valid_requirement(requirement: dict) -> tuple[bool, str]:
    status = requirement.get('status')
    domains = requirement.get('domainIds') or [requirement.get('domainId')]
    refs = requirement.get('evidenceRefs') or []
    if status not in VALID_CLOSED:
        return False, f'статус {status or "не указан"}'
    if not domains or not all(domains):
        return False, 'не указана область'
    if not refs:
        return False, 'нет внутренней связи с источником или решением Product Manager'
    for ref in refs:
        evidence = evidence_by_id.get(ref)
        if not evidence:
            return False, f'основание {ref} не зарегистрировано'
        if evidence.get('type') not in EVIDENCE_TYPES[status]:
            return False, f'основание {ref} имеет тип {evidence.get("type")}'
        if not any(evidence_applies_to(evidence, domain) for domain in domains):
            return False, f'основание {ref} не связано ни с одной областью материала'
        if evidence.get('type') == 'SOURCE_EXCERPT':
            ok, reason = valid_source_evidence(evidence)
            if not ok:
                return False, f'{ref}: {reason}'
    return True, ''


def registry_decision_valid(ref: str, domain_id: str) -> bool:
    evidence = evidence_by_id.get(ref)
    return bool(evidence and evidence.get('type') == 'PRODUCT_MANAGER_DECISION' and evidence_applies_to(evidence, domain_id))


domains = []
for domain in catalog.get('domains', []):
    requirements = [item for item in index.get('requirements', []) if domain['id'] in (item.get('domainIds') or [item.get('domainId')])]
    gaps = [item for item in index.get('needsInput', []) if domain['id'] in (item.get('domainIds') or [item.get('domainId')])]
    closed: list[str] = []
    notes: list[str] = []
    for requirement in requirements:
        ok, reason = valid_requirement(requirement)
        if ok:
            closed.append(requirement['id'])
        else:
            notes.append(f"{requirement.get('id')}: {reason}")
    blocking_gaps = [item for item in gaps if item.get('blocking')]
    if closed:
        status = 'CONFIRMED'
    elif blocking_gaps and domain.get('policy') == 'REQUIRED':
        status = 'BLOCKED'
    elif domain.get('policy') == 'REQUIRED':
        status = 'BLOCKED'
        notes.append('Нет подтверждённого материала или блокирующего открытого вопроса')
    elif domain.get('policy') == 'DEFERRED':
        status = 'DEFERRED'
    elif domain.get('policy') in {'INTERNAL', 'PROTOTYPE_ONLY', 'PROCESS_DECISION'}:
        status = 'NOT_REQUIRED_FOR_PRODUCT_DEFINITION'
    else:
        status = 'OPEN_NON_BLOCKING' if gaps else 'NOT_COVERED'
    domains.append({
        'id': domain['id'], 'title': domain['title'], 'owner': domain['owner'], 'policy': domain['policy'],
        'recommendedPath': domain['recommendedPath'], 'requiredBeforePhase': domain.get('requiredBeforePhase'),
        'status': status, 'requirementRefs': closed, 'openQuestions': gaps, 'validationNotes': notes,
    })

product_blockers = []
seen_blocking_questions: set[str] = set()
for domain in domains:
    if domain['policy'] == 'REQUIRED' and domain['status'] != 'CONFIRMED':
        matching = [item for item in domain.get('openQuestions', []) if item.get('blocking')]
        if matching:
            for gap in matching:
                question_id = gap.get('questionId')
                if question_id in seen_blocking_questions:
                    continue
                seen_blocking_questions.add(question_id)
                product_blockers.append({
                    'questionId': question_id, 'domainId': domain['id'], 'title': gap.get('title'),
                    'file': gap.get('file'), 'owner': gap.get('owner'),
                })
        else:
            product_blockers.append({
                'questionId': f"AUTO-{domain['id']}-MISSING", 'domainId': domain['id'],
                'title': 'Не описана обязательная часть продуктового видения', 'file': domain['recommendedPath'],
                'owner': domain['owner'],
            })

prototype = load('product/prototype-exemption.json')
prototype_plan = prototype.get('plan') or ('VISUAL_ONLY' if prototype.get('status') == 'SKIPPED_BY_PM' else 'NOT_SET')
wants_visual = prototype_plan in {'VISUAL_ONLY', 'VISUAL_AND_WORKING'}
wants_working = prototype_plan == 'VISUAL_AND_WORKING'

ui_source = load('product/ui-source.json')
ui_blockers = []
if wants_visual:
    if ui_source.get('strategy') not in {'FIGMA', 'STORYBOOK', 'COMPONENT_LIBRARY'}:
        ui_blockers.append('Не выбран допустимый источник интерфейса')
    if ui_source.get('applicationMode') not in {'EXISTING_CLICKABLE_APP', 'GENERATED_PROTOTYPE'}:
        ui_blockers.append('Не выбран способ использования источника интерфейса')
    if ui_source.get('status') not in {'SELECTED', 'INSPECTED'} or not ui_source.get('location'):
        ui_blockers.append('Источник интерфейса не выбран или не проверен')
    if not ui_source.get('evidenceRefs') or not all(registry_decision_valid(ref, 'uiSource') for ref in ui_source.get('evidenceRefs', [])):
        ui_blockers.append('Выбор источника интерфейса не подтверждён Product Manager')

prototype_data = load('product/prototype-data-source.json')
data_blockers = []
if wants_working:
    if prototype_data.get('status') not in {'Подтверждено Product Manager', 'Временно принято Product Manager'}:
        data_blockers.append('Источник данных рабочего прототипа не подтверждён Product Manager')
    for field, message in (
        ('sourceType', 'Не выбран тип источника данных'), ('location', 'Не указано расположение данных'),
        ('setupMethod', 'Не описана подготовка данных'), ('verificationMethod', 'Не описана проверка загрузки данных'),
    ):
        if not prototype_data.get(field) or prototype_data.get(field) == 'UNKNOWN':
            data_blockers.append(message)

stack = load('product/technology-stack.json')
stack_blockers = []
if wants_working:
    if stack.get('status') not in {'Подтверждено Product Manager', 'Временно принято Product Manager'}:
        stack_blockers.append('Технологический стек рабочего прототипа не подтверждён Product Manager')
    if not stack.get('selectedStack'):
        stack_blockers.append('Не зафиксирован выбранный стек рабочего прототипа')

gates = {
    'PRODUCT_DEFINITION': {'status': 'PASSED' if not product_blockers else 'BLOCKED', 'blockingQuestions': product_blockers},
    'VISUAL_PROTOTYPE': {
        'status': 'SKIPPED' if not wants_visual and prototype_plan != 'NOT_SET' else ('PASSED' if not product_blockers and not ui_blockers else 'BLOCKED'),
        'blockingQuestions': [*product_blockers, *[
            {'questionId': 'AUTO-UI-SOURCE', 'domainId': 'uiSource', 'title': text, 'file': 'product/ui-source.json', 'owner': 'PRODUCT_MANAGER'}
            for text in ui_blockers
        ]],
    },
    'WORKING_PROTOTYPE': {
        'status': 'SKIPPED' if not wants_working and prototype_plan != 'NOT_SET' else ('PASSED' if not product_blockers and not ui_blockers and not data_blockers and not stack_blockers else 'BLOCKED'),
        'blockingQuestions': [*product_blockers, *[
            {'questionId': 'AUTO-UI-SOURCE', 'domainId': 'uiSource', 'title': text, 'file': 'product/ui-source.json', 'owner': 'PRODUCT_MANAGER'} for text in ui_blockers
        ], *[
            {'questionId': 'Q-PROTO-DATA-001', 'domainId': 'prototypeDataSource', 'title': text, 'file': 'product/prototype-data-source.json', 'owner': 'PRODUCT_MANAGER'} for text in data_blockers
        ], *[
            {'questionId': 'Q-STACK-001', 'domainId': 'technologyStack', 'title': text, 'file': 'product/technology-stack.json', 'owner': 'PRODUCT_MANAGER'} for text in stack_blockers
        ]],
    },
}

out = {
    'schemaVersion': SCHEMA_VERSION, 'evaluatedAt': now(), 'domains': domains, 'gates': gates,
    'gateStatus': gates['PRODUCT_DEFINITION']['status'], 'blockingQuestions': product_blockers,
    'nonBlockingQuestions': [item for item in index.get('needsInput', []) if not item.get('blocking')],
    'prototypePlan': prototype_plan,
    'uiSource': {**ui_source, 'validationBlockers': ui_blockers},
    'prototypeDataSource': {**prototype_data, 'validationBlockers': data_blockers},
    'technologyStack': {**stack, 'validationBlockers': stack_blockers},
}
save('product/completeness-report.json', out)
print(
    f"PRODUCT_DEFINITION={gates['PRODUCT_DEFINITION']['status']}; "
    f"VISUAL_PROTOTYPE={gates['VISUAL_PROTOTYPE']['status']}; "
    f"WORKING_PROTOTYPE={gates['WORKING_PROTOTYPE']['status']}; "
    f"блокировок={len(product_blockers)}"
)
raise SystemExit(0 if gates['PRODUCT_DEFINITION']['status'] == 'PASSED' else 2)
