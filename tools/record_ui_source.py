#!/usr/bin/env python3
import argparse
from common import load, next_id, now, save, run_tool

parser = argparse.ArgumentParser(description='Зафиксировать выбранный Product Manager источник UI')
parser.add_argument('--strategy', required=True, choices=['FIGMA', 'COMPONENT_LIBRARY', 'STORYBOOK'])
parser.add_argument('--application-mode', required=True, choices=['EXISTING_CLICKABLE_APP', 'GENERATED_PROTOTYPE'])
parser.add_argument('--location')
parser.add_argument('--candidate-id')
parser.add_argument('--message', required=True)
parser.add_argument('--inspected-component', action='append', default=[])
parser.add_argument('--temporary', action='store_true')
parser.add_argument('--notes', default='')
args = parser.parse_args()

if len(args.message.strip()) < 2:
    raise SystemExit('Нужен точный текст ответа Product Manager')
state = load('project-state.json')
if state.get('currentPhase') not in {'SOURCE_SETUP', 'INTAKE', 'PRODUCT_DEFINITION'}:
    raise SystemExit('Источник UI выбирается до создания визуального прототипа')
if bool(args.location) == bool(args.candidate_id):
    raise SystemExit('Укажите ровно одно: --location или --candidate-id')

doc = load('product/ui-source.json')
location = args.location
if args.candidate_id:
    candidate = next((item for item in doc.get('candidates', []) if item.get('id') == args.candidate_id), None)
    if not candidate:
        raise SystemExit('UI-кандидат не найден')
    if candidate.get('type') != args.strategy:
        raise SystemExit('Тип выбранного кандидата не совпадает со стратегией')
    location = candidate.get('location')

questions = load('product/open-questions.json')
if not any(item.get('id') == 'Q-009' for item in questions.get('questions', [])):
    raise SystemExit('Сначала сформируйте индекс требований: вопрос Q-009 не зарегистрирован')

evidence = load('product/evidence-register.json')
evidence_id = next_id('PM-DEC', evidence.get('evidence', []))
evidence.setdefault('evidence', []).append({
    'id': evidence_id,
    'type': 'PRODUCT_MANAGER_DECISION',
    'questionId': 'Q-009',
    'domainId': 'uiSource',
    'decision': f'Выбран источник UI {args.strategy}; приложение {args.application_mode}',
    'exactUserMessage': args.message,
    'createdAt': now(),
    'recordedBy': 'record_ui_source.py',
})
save('product/evidence-register.json', evidence)

doc.update({
    'strategy': args.strategy,
    'sourceMode': args.strategy,
    'applicationMode': args.application_mode,
    'usageMode': 'ADOPTED_PROTOTYPE' if args.application_mode == 'EXISTING_CLICKABLE_APP' else 'GENERATED_PROTOTYPE',
    'status': 'INSPECTED' if args.inspected_component else 'SELECTED',
    'location': location,
    'evidenceRefs': [evidence_id],
    'inspectedComponents': args.inspected_component,
    'temporary': bool(args.temporary),
    'selectedCandidateId': args.candidate_id,
    'notes': args.notes or None,
    'selectedAt': now(),
})
save('product/ui-source.json', doc)

inventory = load('product/ui-component-inventory.json')
inventory.update({
    'sourceStrategy': args.strategy,
    'components': [{'name': name, 'status': 'INSPECTED'} for name in args.inspected_component],
    'inspectedAt': now() if args.inspected_component else None,
})
save('product/ui-component-inventory.json', inventory)
run_tool('sync_workspace.py')
print(evidence_id)
