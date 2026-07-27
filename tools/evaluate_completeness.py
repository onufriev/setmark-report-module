#!/usr/bin/env python3
from __future__ import annotations

from common import (
    PHASE_SEQUENCE,
    ROOT,
    SCHEMA_VERSION,
    evidence_applies_to,
    load,
    now,
    project_path,
    save,
    sha256,
    source_snapshot_record,
)

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
GATE_PHASES = ['VISUAL_PROTOTYPE', 'WORKING_PROTOTYPE']

catalog = load('internal/domain-catalog.json')
index = load('product/requirements-index.json')
evidence_doc = load('product/evidence-register.json')
manifest = load('sources/source-manifest.json')
evidence_by_id = {item.get('id'): item for item in evidence_doc.get('evidence', []) if item.get('id')}
source_by_id = {item.get('id'): item for item in manifest.get('entries', []) if item.get('id')}

snapshot_files = list((ROOT / 'sources/snapshots').rglob('*')) if (ROOT / 'sources/snapshots').exists() else []
all_text = '\n'.join(
    path.read_text(encoding='utf-8', errors='ignore')
    for path in snapshot_files
    if path.is_file()
).lower()
profiles = []
for name, profile in catalog.get('profiles', {}).items():
    if name == 'BASE' or any(keyword.lower() in all_text for keyword in profile.get('keywords', [])):
        profiles.append(name)


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
    requirement_id = requirement.get('id') or f"{requirement.get('file', '?')}:{requirement.get('line', '?')}"
    domain_id = requirement.get('domainId')
    status = requirement.get('status')
    refs = requirement.get('evidenceRefs') or []
    if status not in VALID_CLOSED:
        return False, f'статус {status or "не указан"}'
    if not domain_id:
        return False, 'не указана область'
    if not refs:
        return False, 'нет основания'
    for ref in refs:
        evidence = evidence_by_id.get(ref)
        if not evidence:
            return False, f'основание {ref} не зарегистрировано'
        if evidence.get('type') not in EVIDENCE_TYPES[status]:
            return False, f'основание {ref} имеет тип {evidence.get("type")}'
        if not evidence_applies_to(evidence, domain_id):
            return False, f'основание {ref} не относится к области {domain_id}'
        if evidence.get('type') == 'SOURCE_EXCERPT':
            ok, reason = valid_source_evidence(evidence)
            if not ok:
                return False, f'{ref}: {reason}'
    return True, ''


def registry_decision_valid(ref: str, domain_id: str) -> bool:
    evidence = evidence_by_id.get(ref)
    return bool(
        evidence
        and evidence.get('type') == 'PRODUCT_MANAGER_DECISION'
        and evidence_applies_to(evidence, domain_id)
    )


domains = []
for domain in catalog.get('domains', []):
    requirements = [item for item in index.get('requirements', []) if item.get('domainId') == domain['id']]
    gaps = [item for item in index.get('needsInput', []) if item.get('domainId') == domain['id']]
    closed = []
    notes = []
    for requirement in requirements:
        ok, reason = valid_requirement(requirement)
        requirement_id = requirement.get('id') or f"{requirement.get('file', '?')}:{requirement.get('line', '?')}"
        if ok:
            closed.append(requirement_id)
        else:
            notes.append(f'{requirement_id}: {reason}')
    if gaps:
        status = 'BLOCKED'
    elif not closed:
        status = 'BLOCKED'
        notes.append('Нет подтверждённого требования, решения о неприменимости или NEEDS_INPUT')
    elif all(
        requirement.get('status') == 'Не применимо - подтверждено Product Manager'
        for requirement in requirements
        if requirement.get('id') in closed
    ):
        status = 'NOT_APPLICABLE'
    elif len(closed) == len(requirements):
        status = 'CONFIRMED'
    else:
        status = 'BLOCKED'
    domains.append({
        'id': domain['id'],
        'title': domain['title'],
        'file': domain['file'],
        'requiredBeforePhase': domain.get('requiredBeforePhase', 'VISUAL_PROTOTYPE'),
        'profileHintMatched': bool(set(domain.get('profileHint', [])) & set(profiles)),
        'status': status,
        'requirementRefs': closed,
        'needsInput': gaps,
        'validationNotes': notes,
    })

ui_source = load('product/ui-source.json')
ui_blockers = []
allowed_ui_strategies = {'FIGMA', 'STORYBOOK', 'COMPONENT_LIBRARY'}
allowed_application_modes = {'EXISTING_CLICKABLE_APP', 'GENERATED_PROTOTYPE'}
if ui_source.get('strategy') not in allowed_ui_strategies:
    ui_blockers.append('Не выбран допустимый источник UI')
if ui_source.get('applicationMode') not in allowed_application_modes:
    ui_blockers.append('Найденный материал не выбран как источник, принятый или создаваемый прототип')
if ui_source.get('status') not in {'SELECTED', 'INSPECTED'}:
    ui_blockers.append('Источник UI не выбран или не проверен')
if not ui_source.get('location'):
    ui_blockers.append('Не указано расположение источника UI')
if not ui_source.get('evidenceRefs') or not all(
    registry_decision_valid(ref, 'uiSource') for ref in ui_source.get('evidenceRefs', [])
):
    ui_blockers.append('Источник UI не подтверждён решением Product Manager')
if ui_source.get('strategy') == 'STORYBOOK' and not load('product/ui-component-inventory.json').get('components'):
    ui_blockers.append('Storybook выбран, но реальные stories/components не зафиксированы')
prototype_data = load('product/prototype-data-source.json')
data_blockers = []
allowed_data_sources = {'REAL_OBJECT', 'MANUAL_INPUT', 'DATABASE_SCRIPT', 'CSV', 'EMULATOR', 'POSTMAN_COLLECTION', 'API', 'OTHER'}
if prototype_data.get('status') not in {'Подтверждено Product Manager', 'Временно принято Product Manager'}:
    data_blockers.append('Источник данных рабочего прототипа не подтверждён Product Manager')
if prototype_data.get('sourceType') not in allowed_data_sources:
    data_blockers.append('Не выбран допустимый тип источника данных рабочего прототипа')
for field, message in (
    ('location', 'Не указано расположение или подключение к данным'),
    ('setupMethod', 'Не описан способ подготовки и наполнения данными'),
    ('verificationMethod', 'Не описана проверка корректной загрузки данных'),
):
    if not prototype_data.get(field):
        data_blockers.append(message)
if not prototype_data.get('evidenceRefs') or not all(
    registry_decision_valid(ref, 'prototypeDataSource') for ref in prototype_data.get('evidenceRefs', [])
):
    data_blockers.append('Источник данных не подтверждён решением по области prototypeDataSource')

stack = load('product/technology-stack.json')
stack_blockers = []
if stack.get('status') not in {'Подтверждено Product Manager', 'Временно принято Product Manager'}:
    stack_blockers.append('Технологический стек рабочего прототипа не подтверждён Product Manager')
if not stack.get('selectedStack'):
    stack_blockers.append('Не зафиксирован выбранный стек')
if stack.get('status') in {'Подтверждено Product Manager', 'Временно принято Product Manager'}:
    if not stack.get('evidenceRefs') or not all(
        registry_decision_valid(ref, 'technologyStack') for ref in stack.get('evidenceRefs', [])
    ):
        stack_blockers.append('Стек не подтверждён решением по области technologyStack')

gates = {}
for gate_phase in GATE_PHASES:
    blockers = []
    for domain in domains:
        if PHASE_SEQUENCE.index(domain['requiredBeforePhase']) <= PHASE_SEQUENCE.index(gate_phase):
            for gap in domain.get('needsInput', []):
                blockers.append({
                    'questionId': gap.get('questionId') or f"AUTO-{domain['id']}-INPUT",
                    'domainId': domain['id'],
                    'title': gap.get('title'),
                    'file': gap.get('file'),
                })
            if domain['status'] == 'BLOCKED' and not domain.get('needsInput'):
                blockers.append({
                    'questionId': f"AUTO-{domain['id']}-MISSING",
                    'domainId': domain['id'],
                    'title': 'Область не зафиксирована явно',
                    'file': domain['file'],
                })
    if gate_phase in {'VISUAL_PROTOTYPE', 'WORKING_PROTOTYPE'}:
        blockers.extend({
            'questionId': 'AUTO-UI-SOURCE', 'domainId': 'uiSource', 'title': text,
            'file': 'product/ui-source.json',
        } for text in ui_blockers)
    if gate_phase == 'WORKING_PROTOTYPE':
        blockers.extend({
            'questionId': 'Q-PROTO-DATA-001', 'domainId': 'prototypeDataSource', 'title': text,
            'file': 'product/prototype-data-source.json',
        } for text in data_blockers)
        blockers.extend({
            'questionId': 'AUTO-TECH-STACK', 'domainId': 'technologyStack', 'title': text,
            'file': 'product/technology-stack.json',
        } for text in stack_blockers)
    gates[gate_phase] = {'status': 'PASSED' if not blockers else 'BLOCKED', 'blockingQuestions': blockers}

out = {
    'schemaVersion': SCHEMA_VERSION,
    'evaluatedAt': now(),
    'detectedProfiles': profiles,
    'domains': domains,
    'gates': gates,
    'gateStatus': gates['VISUAL_PROTOTYPE']['status'],
    'blockingQuestions': gates['VISUAL_PROTOTYPE']['blockingQuestions'],
    'uiSource': {**ui_source, 'validationBlockers': ui_blockers},
    'prototypeDataSource': {**prototype_data, 'validationBlockers': data_blockers},
    'technologyStack': {**stack, 'validationBlockers': stack_blockers},
}
save('product/completeness-report.json', out)
print(
    'VISUAL_PROTOTYPE=' + gates['VISUAL_PROTOTYPE']['status'] +
    '; WORKING_PROTOTYPE=' + gates['WORKING_PROTOTYPE']['status'] +
    f"; блокировок={len(gates['VISUAL_PROTOTYPE']['blockingQuestions'])}"
)
raise SystemExit(0 if gates['VISUAL_PROTOTYPE']['status'] == 'PASSED' else 2)
