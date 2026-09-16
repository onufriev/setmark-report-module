#!/usr/bin/env python3
from __future__ import annotations

from common import SCHEMA_VERSION, load, next_id, now, run_tool, save
from requirements_baseline import current_snapshot

sync = run_tool('sync_workspace.py', [], allowed_returncodes={0, 1})
if sync.returncode:
    raise SystemExit('Нельзя зафиксировать требования: синхронизация завершилась ошибкой\n' + sync.stdout + sync.stderr)

index = load('product/requirements-index.json')
completeness = load('product/completeness-report.json')
if completeness.get('gates', {}).get('PRODUCT_DEFINITION', {}).get('status') != 'PASSED':
    raise SystemExit('Нельзя зафиксировать требования: не описаны обязательные части продуктового видения')
if index.get('errors'):
    raise SystemExit('Нельзя зафиксировать требования: индекс содержит ошибки')
blocking = [item for item in index.get('needsInput', []) if item.get('blocking')]
if blocking:
    raise SystemExit('Нельзя зафиксировать требования: остались блокирующие продуктовые вопросы')

doc = load('product/requirements-baseline.json')
baseline_id = next_id('REQ-BASELINE', [{'id': item.get('baselineId')} for item in doc.get('baselines', [])])
snapshot = current_snapshot()
entry = {
    'baselineId': baseline_id,
    'committedAt': now(),
    'gate': 'PRODUCT_DEFINITION',
    'gateStatus': 'PASSED',
    'requirementCount': len(index.get('requirements', [])),
    'needsInputCount': len(index.get('needsInput', [])),
    'openFutureQuestions': [item.get('questionId') for item in index.get('needsInput', []) if not item.get('blocking')],
    'requirementRefs': [item.get('id') for item in index.get('requirements', [])],
    **snapshot,
}
doc['schemaVersion'] = SCHEMA_VERSION
doc['status'] = 'COMMITTED'
doc['currentBaselineId'] = baseline_id
doc.setdefault('baselines', []).append(entry)
save('product/requirements-baseline.json', doc)
run_tool('sync_workspace.py')
print(baseline_id)
