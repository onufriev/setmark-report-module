#!/usr/bin/env python3
from __future__ import annotations

from common import SCHEMA_VERSION, load, next_id, now, run_tool, save
from requirements_baseline import current_snapshot

sync = run_tool('sync_workspace.py', [], allowed_returncodes={0, 1})
if sync.returncode:
    raise SystemExit('Нельзя зафиксировать требования: синхронизация завершилась ошибкой\n' + sync.stdout + sync.stderr)

index = load('product/requirements-index.json')
completeness = load('product/completeness-report.json')
if completeness.get('gates', {}).get('VISUAL_PROTOTYPE', {}).get('status') != 'PASSED':
    raise SystemExit('Нельзя зафиксировать требования: не закрыты области, обязательные до визуального прототипа')
if index.get('errors'):
    raise SystemExit('Нельзя зафиксировать требования: индекс содержит ошибки')
if index.get('needsInput'):
    raise SystemExit('Нельзя зафиксировать требования: до визуального прототипа не должно оставаться NEEDS_INPUT')

doc = load('product/requirements-baseline.json')
baseline_id = next_id('REQ-BASELINE', [{'id': item.get('baselineId')} for item in doc.get('baselines', [])])
snapshot = current_snapshot()
entry = {
    'baselineId': baseline_id,
    'committedAt': now(),
    'gate': 'VISUAL_PROTOTYPE',
    'gateStatus': 'PASSED',
    'requirementCount': len(index.get('requirements', [])),
    'needsInputCount': len(index.get('needsInput', [])),
    'openFutureQuestions': [],
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
