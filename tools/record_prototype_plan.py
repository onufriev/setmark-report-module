#!/usr/bin/env python3
from __future__ import annotations

import argparse

from common import load, next_id, now, run_tool, save

parser = argparse.ArgumentParser(description='Выбрать необязательную ветку прототипирования')
parser.add_argument('--plan', required=True, choices=['NONE', 'VISUAL_ONLY', 'VISUAL_AND_WORKING'])
parser.add_argument('--message', required=True, help='Точный текст решения Product Manager')
parser.add_argument('--notes', default='')
args = parser.parse_args()

if len(args.message.strip()) < 2:
    raise SystemExit('Нужен точный текст решения Product Manager')
state = load('project-state.json')
if state.get('currentPhase') not in {'SOURCE_SETUP', 'INTAKE', 'PRODUCT_DEFINITION'}:
    raise SystemExit('Ветка прототипирования выбирается до утверждения PRODUCT_DEFINITION')

evidence = load('product/evidence-register.json')
evidence_id = next_id('PM-DEC', evidence.get('evidence', []))
evidence.setdefault('evidence', []).append({
    'id': evidence_id,
    'type': 'PRODUCT_MANAGER_DECISION',
    'questionId': 'PROTOTYPE-PLAN',
    'domainId': 'prototypePlan',
    'domainIds': ['prototypePlan'],
    'decision': args.plan,
    'exactUserMessage': args.message,
    'createdAt': now(),
    'recordedBy': 'record_prototype_plan.py',
})
save('product/evidence-register.json', evidence)
save('product/prototype-exemption.json', {
    'schemaVersion': evidence.get('schemaVersion'),
    'plan': args.plan,
    'decision': args.plan,
    'evidenceRef': evidence_id,
    'approvedAt': now(),
    'notes': args.notes or None,
})
run_tool('sync_workspace.py')
print(evidence_id)

