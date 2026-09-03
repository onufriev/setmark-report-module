#!/usr/bin/env python3
from __future__ import annotations

import shutil
from pathlib import Path

from common import (
    PHASE_SEQUENCE,
    PRODUCT_VERSION,
    artifact_sha256,
    ROOT,
    SCHEMA_VERSION,
    evidence_applies_to,
    load,
    phase_at_least,
    project_path,
    run_tool,
    sha256,
    source_snapshot_record,
)
from requirements_baseline import verify_baseline

errors: list[str] = []


def require_file(rel: str) -> None:
    if not (ROOT / rel).exists():
        errors.append(f'Отсутствует обязательный файл: {rel}')


required_files = [
    'VERSION', 'PRODUCT-COMPILER.md', 'AGENTS.md', 'README.md', 'project-state.json',
    'requirements-tooling.txt', 'tools/README.md',
    'sources/source-manifest.json', 'product/evidence-register.json',
    'product/open-questions.json', 'product/phase-reviews.json',
    'product/requirements-index.json', 'product/requirements-baseline.json',
    'product/completeness-report.json', 'product/prototype-data-source.json',
    'product/ui-source.json', 'product/ui-component-inventory.json',
    'product/technology-stack.json', 'product/conflict-register.json',
    'product/artifact-evidence.json', 'internal/domain-catalog.json',
    'requirements/README.md', 'reports/README.md',
    'visual-prototype/prototype-manifest.json', 'visual-prototype/PROTOTYPE-RUNBOOK.md',
    'prototype/prototype-manifest.json', 'prototype/PROTOTYPE-RUNBOOK.md',
    'schemas/evidence-register.schema.json', 'schemas/ui-source.schema.json',
    'schemas/prototype-data-source.schema.json', 'schemas/visual-prototype-manifest.schema.json',
    'schemas/working-prototype-manifest.schema.json', 'schemas/requirements-index.schema.json',
    'schemas/phase-reviews.schema.json', 'schemas/open-questions.schema.json',
    'schemas/completeness-report.schema.json', 'schemas/project-state.schema.json',
    'schemas/technology-stack.schema.json', 'schemas/ui-component-inventory.schema.json',
    'schemas/domain-catalog.schema.json', 'schemas/work-queue.schema.json', 'schemas/README.md',
    'tools/common.py', 'tools/json_contracts.py', 'tools/normalize_workspace_json.py',
    'tools/sync_workspace.py', 'tools/build_requirements_index.py',
    'tools/evaluate_completeness.py', 'tools/commit_requirements.py',
    'tools/finalize_phase_review.py', 'tools/generate_stage_report.py',
    'tools/materialize_visual_prototype.py', 'tools/prepare_working_prototype.py', 'tools/sync_project_state.py',
    'tools/validate_json_documents.py', 'tools/validate_visual_prototype.py',
    'tools/validate_working_prototype.py', 'tools/diagnose.py', 'tools/self_test.py',
]
for rel in required_files:
    require_file(rel)
if errors:
    for error in errors:
        print('ERROR:', error)
    raise SystemExit(1)

sync = run_tool('sync_workspace.py', [], allowed_returncodes={0, 1})
if sync.returncode:
    errors.append('Не удалось синхронизировать workspace:\n' + sync.stdout + sync.stderr)
json_validation = run_tool('validate_json_documents.py', [], allowed_returncodes={0, 1})
if json_validation.returncode:
    errors.append('Ошибка JSON-контрактов:\n' + json_validation.stdout + json_validation.stderr)

state = load('project-state.json')
phase = state.get('currentPhase')
if state.get('schemaVersion') != SCHEMA_VERSION:
    errors.append('project-state.json имеет неверную schemaVersion')
if state.get('productName') != 'Product Compiler' or state.get('productVersion') != PRODUCT_VERSION:
    errors.append('Неверное название или версия продукта')
if phase not in PHASE_SEQUENCE:
    errors.append('Некорректный currentPhase')
if (ROOT / 'VERSION').read_text(encoding='utf-8-sig').strip() != PRODUCT_VERSION:
    errors.append(f'Файл VERSION должен содержать {PRODUCT_VERSION}')

for forbidden in ['CHANGELOG.md', 'RELEASE-NOTES.md', 'RELEASE_NOTES.md', 'UPGRADE.md']:
    if (ROOT / forbidden).exists():
        errors.append(f'В версии {PRODUCT_VERSION} не должен создаваться файл релиз-нотов: {forbidden}')
for cache_dir in list(ROOT.rglob('__pycache__')):
    if cache_dir.is_dir():
        shutil.rmtree(cache_dir, ignore_errors=True)
for bytecode in list(ROOT.rglob('*.pyc')):
    bytecode.unlink(missing_ok=True)
if (ROOT / 'ai-artifacts').exists():
    misplaced = [
        path for path in (ROOT / 'ai-artifacts').rglob('*')
        if path.is_file() and path.suffix.lower() in {'.md', '.pdf'}
    ]
    if misplaced:
        errors.append('Контрольные отчёты должны находиться только в reports/, а не в ai-artifacts/')

catalog = load('internal/domain-catalog.json')
domain_ids = {item['id'] for item in catalog.get('domains', [])}
allowed_evidence_domains = domain_ids | {'technologyStack'}
index = load('product/requirements-index.json')
evidence_doc = load('product/evidence-register.json')
evidence_by_id = {item.get('id'): item for item in evidence_doc.get('evidence', []) if item.get('id')}
manifest = load('sources/source-manifest.json')
source_by_id = {item.get('id'): item for item in manifest.get('entries', []) if item.get('id')}

seen_evidence_ids: set[str] = set()
for position, evidence in enumerate(evidence_doc.get('evidence', []), start=1):
    evidence_id = evidence.get('id') or f'evidence[{position}]'
    if evidence_id in seen_evidence_ids:
        errors.append(f'Повтор ID доказательства {evidence_id}')
    seen_evidence_ids.add(evidence_id)
    for field in ('id', 'type', 'createdAt', 'recordedBy'):
        if not evidence.get(field):
            errors.append(f'{evidence_id}: отсутствует обязательное поле {field}')
    evidence_domains = set(evidence.get('domainIds') or [])
    if evidence.get('domainId'):
        evidence_domains.add(evidence['domainId'])
    if not evidence_domains:
        errors.append(f'{evidence_id}: не указана область доказательства')
    for domain in evidence_domains:
        if domain not in allowed_evidence_domains and domain != '*':
            errors.append(f'{evidence_id}: неизвестная область {domain}')
    evidence_type = evidence.get('type')
    if evidence_type == 'SOURCE_EXCERPT':
        source = source_by_id.get(evidence.get('sourceId'))
        if not source:
            errors.append(f'{evidence_id}: исходный источник не зарегистрирован')
            continue
        try:
            snapshot = project_path(evidence.get('snapshotPath', ''), must_exist=True, allowed_root='sources/snapshots')
        except SystemExit as exc:
            errors.append(f'{evidence_id}: {exc}')
            continue
        snapshot_record = source_snapshot_record(source, evidence.get('snapshotPath', ''))
        if not snapshot_record:
            errors.append(f'{evidence_id}: снимок не зарегистрирован у источника')
            continue
        digest = sha256(snapshot)
        if digest != snapshot_record.get('snapshotSha256') or digest != evidence.get('snapshotSha256'):
            errors.append(f'{evidence_id}: снимок источника изменён')
        text = snapshot.read_text(encoding='utf-8', errors='replace')
        if str(evidence.get('excerpt') or '') not in text:
            errors.append(f'{evidence_id}: выдержка больше не найдена в снимке')
        if evidence.get('verified') is not True:
            errors.append(f'{evidence_id}: выдержка не помечена проверенной')
    elif evidence_type == 'PRODUCT_MANAGER_DECISION':
        if not evidence.get('questionId') or not str(evidence.get('exactUserMessage') or '').strip():
            errors.append(f'{evidence_id}: неполная запись решения Product Manager')
    elif evidence_type != 'AI_PROPOSAL':
        errors.append(f'{evidence_id}: неизвестный тип доказательства {evidence_type}')

closed_statuses = {
    'Подтверждено источником': 'SOURCE_EXCERPT',
    'Подтверждено Product Manager': 'PRODUCT_MANAGER_DECISION',
    'Временно принято Product Manager': 'PRODUCT_MANAGER_DECISION',
    'Не применимо - подтверждено Product Manager': 'PRODUCT_MANAGER_DECISION',
}
for position, requirement in enumerate(index.get('requirements', []), start=1):
    requirement_id = requirement.get('id') or f"{requirement.get('file', 'unknown')}:{requirement.get('line', position)}"
    if not requirement.get('id'):
        errors.append(f'{requirement_id}: отсутствует ID требования')
    status = requirement.get('status')
    domain_id = requirement.get('domainId')
    if not domain_id:
        errors.append(f'{requirement_id}: отсутствует область')
    if status in closed_statuses:
        refs = requirement.get('evidenceRefs') or []
        if not refs:
            errors.append(f'{requirement_id}: подтверждённый статус без основания')
        for ref in refs:
            evidence = evidence_by_id.get(ref)
            if not evidence:
                errors.append(f'{requirement_id}: основание {ref} не зарегистрировано')
            elif evidence.get('type') != closed_statuses[status]:
                errors.append(f'{requirement_id}: основание {ref} недопустимого типа {evidence.get("type")}')
            elif domain_id and not evidence_applies_to(evidence, domain_id):
                errors.append(f'{requirement_id}: основание {ref} не относится к области {domain_id}')
    elif status not in {'Требуется решение', 'Предложено Product Compiler'}:
        errors.append(f'{requirement_id}: неизвестный статус {status or "не указан"}')

# Every indexed NEEDS_INPUT must have a stable question identifier.
for gap in index.get('needsInput', []):
    location = f"{gap.get('file', '?')}:{gap.get('line', '?')}"
    if not gap.get('questionId'):
        errors.append(f'{location}: NEEDS_INPUT без questionId')
    if not gap.get('domainId'):
        errors.append(f'{location}: NEEDS_INPUT без domainId')

source_state = state.get('sourceSetup', {})
if manifest.get('setupStatus') != source_state.get('status') or manifest.get('inputMode') != source_state.get('inputMode'):
    errors.append('Статус источников расходится с производным project-state')
if manifest.get('setupStatus') == 'COMPLETED' and manifest.get('inputMode') != 'CONVERSATION_ONLY' and not manifest.get('entries'):
    errors.append('Настройка источников завершена без зарегистрированных источников')

# PM-DEC must close the matching NEEDS_INPUT and create a structured REQ.
evidence_items = load('product/evidence-register.json').get('evidence', [])
pm_by_question = {item.get('questionId'): item.get('id') for item in evidence_items if item.get('type') == 'PRODUCT_MANAGER_DECISION'}
for gap in index.get('needsInput', []):
    qid = gap.get('questionId')
    if qid in pm_by_question:
        errors.append(f'{gap.get("file")}:{gap.get("line")}: вопрос {qid} уже имеет {pm_by_question[qid]}, но NEEDS_INPUT не закрыт')

ui = load('product/ui-source.json')
for candidate in ui.get('candidates', []):
    if candidate.get('status') != 'DISCOVERED_REFERENCE':
        errors.append(f"{candidate.get('id', '<без ID>')}: кандидат UI должен иметь статус DISCOVERED_REFERENCE")
if ui.get('status') in {'SELECTED', 'INSPECTED'}:
    if not ui.get('location'):
        errors.append('Выбранный UI-источник не имеет location')
    for ref in ui.get('evidenceRefs') or []:
        evidence = evidence_by_id.get(ref)
        if not evidence or evidence.get('type') != 'PRODUCT_MANAGER_DECISION' or not evidence_applies_to(evidence, 'uiSource'):
            errors.append(f'Источник UI: основание {ref} не является решением по uiSource')

prototype_data = load('product/prototype-data-source.json')
if prototype_data.get('status') in {'Подтверждено Product Manager', 'Временно принято Product Manager'}:
    for field in ('sourceType', 'location', 'setupMethod', 'verificationMethod'):
        if not prototype_data.get(field) or prototype_data.get(field) == 'UNKNOWN':
            errors.append(f'Источник данных прототипа: не заполнено поле {field}')
    for ref in prototype_data.get('evidenceRefs') or []:
        evidence = evidence_by_id.get(ref)
        if not evidence or evidence.get('type') != 'PRODUCT_MANAGER_DECISION' or not evidence_applies_to(evidence, 'prototypeDataSource'):
            errors.append(f'Источник данных прототипа: основание {ref} недопустимо')

artifact_doc = load('product/artifact-evidence.json')
artifact_items = artifact_doc.get('evidence', [])
latest_artifact_position: dict[tuple[str | None, str | None], int] = {}
for position, artifact in enumerate(artifact_items, start=1):
    latest_artifact_position[(artifact.get('phase'), artifact.get('artifactPath'))] = position
seen_artifact_ids: set[str] = set()
for position, artifact in enumerate(artifact_items, start=1):
    artifact_id = artifact.get('id') or f'artifact-evidence[{position}]'
    if artifact_id in seen_artifact_ids:
        errors.append(f'Повтор ID доказательства артефакта {artifact_id}')
    seen_artifact_ids.add(artifact_id)
    for field in ('id', 'phase', 'artifactPath', 'artifactType', 'verifiedAt', 'checks', 'result', 'sha256', 'recordedBy'):
        if artifact.get(field) in (None, '', []):
            errors.append(f'{artifact_id}: отсутствует обязательное поле {field}')
    if artifact.get('recordedBy') != 'register_artifact_evidence.py':
        errors.append(f'{artifact_id}: доказательство зарегистрировано не через register_artifact_evidence.py')
    if artifact.get('phase') not in PHASE_SEQUENCE:
        errors.append(f'{artifact_id}: неизвестный этап {artifact.get("phase")}')
    is_latest_for_artifact = latest_artifact_position.get(
        (artifact.get('phase'), artifact.get('artifactPath'))
    ) == position
    if is_latest_for_artifact:
        try:
            artifact_path = project_path(artifact.get('artifactPath', ''), must_exist=True)
            current_digest = artifact_sha256(artifact_path)
            if artifact.get('sha256') != current_digest:
                errors.append(f'{artifact_id}: артефакт изменён после проверки; зарегистрируйте новое доказательство')
        except SystemExit as exc:
            errors.append(f'{artifact_id}: {exc}')
            artifact_path = None
    if artifact.get('result') == 'PASSED':
        if artifact.get('phase') == 'VISUAL_PROTOTYPE':
            if artifact.get('artifactPath') != 'visual-prototype':
                errors.append(f'{artifact_id}: VISUAL_PROTOTYPE должен ссылаться на visual-prototype')
            if artifact.get('runbookPath') != 'visual-prototype/PROTOTYPE-RUNBOOK.md':
                errors.append(f'{artifact_id}: не указан обязательный runbook визуального прототипа')
        if artifact.get('phase') == 'WORKING_PROTOTYPE':
            if artifact.get('artifactPath') != 'prototype':
                errors.append(f'{artifact_id}: WORKING_PROTOTYPE должен ссылаться на prototype')
            if artifact.get('runbookPath') != 'prototype/PROTOTYPE-RUNBOOK.md':
                errors.append(f'{artifact_id}: не указан обязательный runbook рабочего прототипа')
            if artifact.get('dataSourceRef') != 'product/prototype-data-source.json':
                errors.append(f'{artifact_id}: не указан источник данных рабочего прототипа')


for conflict in load('product/conflict-register.json').get('conflicts', []):
    conflict_id = conflict.get('id', '<без ID>')
    if conflict.get('status') not in {'OPEN', 'RESOLVED', 'ACCEPTED'}:
        errors.append(f'{conflict_id}: неизвестный статус конфликта')
    if conflict.get('severity') not in {'BLOCKER', 'MAJOR', 'MINOR'}:
        errors.append(f'{conflict_id}: неизвестный уровень конфликта')
    if len(conflict.get('statements') or []) < 2:
        errors.append(f'{conflict_id}: нужно минимум два противоречащих утверждения')
    if conflict.get('status') in {'RESOLVED', 'ACCEPTED'} and not conflict.get('resolutionRefs'):
        errors.append(f'{conflict_id}: закрытый конфликт без основания')
    if conflict.get('status') == 'OPEN' and conflict.get('severity') == 'BLOCKER':
        errors.append(f'{conflict_id}: открыт блокирующий внутренний конфликт')

reviews = load('product/phase-reviews.json').get('reviews', [])
approved_phases = set()
seen_review_ids = set()
for review in reviews:
    review_id = review.get('reviewId', '<без ID>')
    if review_id in seen_review_ids:
        errors.append(f'Повтор reviewId {review_id}')
    seen_review_ids.add(review_id)
    if review.get('registeredBy') != 'finalize_phase_review.py':
        errors.append(f'{review_id}: отчёт зарегистрирован не через finalize_phase_review.py')
    review_phase = review.get('phase')
    if review_phase not in PHASE_SEQUENCE:
        errors.append(f'{review_id}: неизвестный этап')
        continue
    try:
        markdown = project_path(review.get('markdownReport', ''), must_exist=True, allowed_root='reports')
        pdf = project_path(review.get('pdfReport', ''), must_exist=True, allowed_root='reports')
        if sha256(markdown) != review.get('markdownSha256') or sha256(pdf) != review.get('pdfSha256'):
            errors.append(f'{review_id}: отчёт изменён после регистрации')
    except SystemExit as exc:
        errors.append(f'{review_id}: {exc}')
    next_index = PHASE_SEQUENCE.index(review_phase) + 1
    expected_next = PHASE_SEQUENCE[next_index] if next_index < len(PHASE_SEQUENCE) else None
    if review.get('nextPhase') != expected_next:
        errors.append(f'{review_id}: некорректный nextPhase')
    if review.get('status') == 'APPROVED':
        if review.get('approvedBy') != 'PRODUCT_MANAGER' or not review.get('shownToProductManagerAt'):
            errors.append(f'{review_id}: утверждение не подтверждено показом и Product Manager')
        approved_phases.add(review_phase)

for phase_name in PHASE_SEQUENCE:
    if phase_name in approved_phases:
        prior = PHASE_SEQUENCE[:PHASE_SEQUENCE.index(phase_name)]
        if load('product/prototype-exemption.json').get('status') == 'SKIPPED_BY_PM':
            prior = [item for item in prior if item != 'WORKING_VALIDATION']
        missing = [item for item in prior if item not in approved_phases]
        if missing:
            errors.append(f'{phase_name}: утверждён с пропущенными этапами {missing}')

if phase in PHASE_SEQUENCE and phase_at_least(phase, 'VISUAL_PROTOTYPE'):
    baseline_ok, baseline_errors = verify_baseline()
    if not baseline_ok:
        errors.extend('Базовая линия: ' + item for item in baseline_errors)
if phase in PHASE_SEQUENCE and phase_at_least(phase, 'VISUAL_VALIDATION'):
    result = run_tool('validate_visual_prototype.py', ['--phase', 'VISUAL_PROTOTYPE'], allowed_returncodes={0, 1})
    if result.returncode:
        errors.append('Визуальный прототип невалиден:\n' + result.stdout + result.stderr)
if phase in PHASE_SEQUENCE and phase_at_least(phase, 'WORKING_VALIDATION') and load('product/prototype-exemption.json').get('status') != 'SKIPPED_BY_PM':
    result = run_tool('validate_working_prototype.py', ['--phase', 'WORKING_PROTOTYPE'], allowed_returncodes={0, 1})
    if result.returncode:
        errors.append('Рабочий прототип невалиден:\n' + result.stdout + result.stderr)

stack = load('product/technology-stack.json')
if stack.get('status') in {'Подтверждено Product Manager', 'Временно принято Product Manager'}:
    if not stack.get('selectedStack'):
        errors.append('Подтверждён технологический стек без selectedStack')
    for ref in stack.get('evidenceRefs') or []:
        evidence = evidence_by_id.get(ref)
        if not evidence or evidence.get('type') != 'PRODUCT_MANAGER_DECISION' or not evidence_applies_to(evidence, 'technologyStack'):
            errors.append(f'Технологический стек: основание {ref} недопустимо')

if errors:
    print('Проверка не пройдена:')
    for error in errors:
        print('ERROR:', error)
    raise SystemExit(1)
print(f'OK: Product Compiler {PRODUCT_VERSION}, этап {phase}')
