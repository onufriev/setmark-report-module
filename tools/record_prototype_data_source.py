#!/usr/bin/env python3
import argparse
import subprocess
import sys

from common import ROOT, load, next_id, now, save, run_tool

parser = argparse.ArgumentParser(description='Зафиксировать источник данных рабочего прототипа')
parser.add_argument('--type', required=True, dest='source_type', choices=['REAL_OBJECT', 'MANUAL_INPUT', 'DATABASE_SCRIPT', 'CSV', 'EMULATOR', 'POSTMAN_COLLECTION', 'API', 'OTHER'])
parser.add_argument('--location', required=True)
parser.add_argument('--classification', required=True, choices=['REAL', 'ANONYMIZED', 'SYNTHETIC', 'DEMO', 'MIXED'])
parser.add_argument('--setup-method', required=True)
parser.add_argument('--verification-method', required=True)
parser.add_argument('--message', required=True)
parser.add_argument('--seed-command')
parser.add_argument('--reset-command')
parser.add_argument('--temporary', action='store_true')
parser.add_argument('--notes', default='')
args = parser.parse_args()

if len(args.message.strip()) < 2:
    raise SystemExit('Нужен точный текст ответа Product Manager')
state = load('project-state.json')
if state.get('currentPhase') != 'WORKING_PROTOTYPE':
    raise SystemExit('Решение можно фиксировать только на этапе WORKING_PROTOTYPE')
questions = load('product/open-questions.json')
if not any(item.get('id') == 'Q-PROTO-DATA-001' for item in questions.get('questions', [])):
    raise SystemExit('Сначала сформируйте индекс требований: вопрос Q-PROTO-DATA-001 не зарегистрирован')

evidence = load('product/evidence-register.json')
evidence_id = next_id('PM-DEC', evidence.get('evidence', []))
evidence.setdefault('evidence', []).append({
    'id': evidence_id,
    'type': 'PRODUCT_MANAGER_DECISION',
    'questionId': 'Q-PROTO-DATA-001',
    'domainId': 'prototypeDataSource',
    'decision': f'Использовать источник данных типа {args.source_type}: {args.location}',
    'exactUserMessage': args.message,
    'createdAt': now(),
    'recordedBy': 'record_prototype_data_source.py',
})
save('product/evidence-register.json', evidence)

doc = load('product/prototype-data-source.json')
doc.update({
    'status': 'Временно принято Product Manager' if args.temporary else 'Подтверждено Product Manager',
    'sourceType': args.source_type,
    'location': args.location,
    'dataClassification': args.classification,
    'setupMethod': args.setup_method,
    'seedCommand': args.seed_command,
    'resetCommand': args.reset_command,
    'verificationMethod': args.verification_method,
    'evidenceRefs': [evidence_id],
    'notes': args.notes or None,
    'selectedAt': now(),
})
save('product/prototype-data-source.json', doc)
run_tool('sync_workspace.py')
print(evidence_id)
