#!/usr/bin/env python3
import argparse
import json
import subprocess
import sys

from common import ROOT, load, next_id, now, save, run_tool

parser = argparse.ArgumentParser(description='Зарегистрировать отдельное решение Product Manager по технологическому стеку')
parser.add_argument('--selection', required=True, choices=['standard', 'custom'])
parser.add_argument('--message', required=True, help='Точный текст ответа Product Manager')
parser.add_argument('--selected-stack-json', help='JSON-объект выбранного стека; обязателен для custom')
parser.add_argument('--temporary', action='store_true')
args = parser.parse_args()

if len(args.message.strip()) < 2:
    raise SystemExit('Нужен точный текст ответа Product Manager')
state = load('project-state.json')
if state.get('currentPhase') != 'WORKING_PROTOTYPE':
    raise SystemExit('Решение можно фиксировать только на этапе WORKING_PROTOTYPE')
stack = load('product/technology-stack.json')
if stack.get('status') in {'Подтверждено Product Manager', 'Временно принято Product Manager'}:
    raise SystemExit('Технологический стек уже подтверждён')
if args.selection == 'standard':
    if args.selected_stack_json:
        raise SystemExit('--selected-stack-json нельзя использовать вместе с selection=standard')
    selected = stack.get('standardRecommendation')
else:
    if not args.selected_stack_json:
        raise SystemExit('Для selection=custom требуется --selected-stack-json')
    try:
        selected = json.loads(args.selected_stack_json)
    except json.JSONDecodeError as exc:
        raise SystemExit(f'Некорректный JSON выбранного стека: {exc}')
    if not isinstance(selected, dict) or not selected:
        raise SystemExit('Выбранный стек должен быть непустым JSON-объектом')

evidence = load('product/evidence-register.json')
evidence_id = next_id('PM-DEC', evidence.get('evidence', []))
evidence.setdefault('evidence', []).append({
    'id': evidence_id,
    'type': 'PRODUCT_MANAGER_DECISION',
    'questionId': 'Q-STACK-001',
    'domainId': 'technologyStack',
    'decision': 'Использовать стандартный стек CSI' if args.selection == 'standard' else 'Использовать явно указанный пользовательский стек',
    'exactUserMessage': args.message,
    'createdAt': now(),
    'recordedBy': 'record_stack_decision.py',
})
save('product/evidence-register.json', evidence)
stack['status'] = 'Временно принято Product Manager' if args.temporary else 'Подтверждено Product Manager'
stack['selectedStack'] = selected
stack['evidenceRefs'] = [evidence_id]
stack['selectedAt'] = now()
save('product/technology-stack.json', stack)
run_tool('sync_workspace.py')
print(evidence_id)
