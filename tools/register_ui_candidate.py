#!/usr/bin/env python3
import argparse
from common import load, next_id, now, save, run_tool

parser = argparse.ArgumentParser(description='Зарегистрировать источник UI как кандидата, не выбирая его автоматически')
parser.add_argument('--type', required=True, choices=['FIGMA', 'COMPONENT_LIBRARY', 'STORYBOOK'])
parser.add_argument('--location', required=True)
parser.add_argument('--notes', default='')
args = parser.parse_args()
state = load('project-state.json')
if state.get('currentPhase') not in {'SOURCE_SETUP', 'INTAKE', 'PRODUCT_DEFINITION'}:
    raise SystemExit('UI-кандидаты регистрируются до создания визуального прототипа')

doc = load('product/ui-source.json')
candidates = doc.setdefault('candidates', [])
candidate_id = next_id('UI-CAND', candidates)
candidates.append({
    'id': candidate_id,
    'type': args.type,
    'sourceMode': args.type,
    'location': args.location,
    'status': 'DISCOVERED_REFERENCE',
    'notes': args.notes,
    'discoveredAt': now(),
})
save('product/ui-source.json', doc)
run_tool('sync_workspace.py')
print(candidate_id)
