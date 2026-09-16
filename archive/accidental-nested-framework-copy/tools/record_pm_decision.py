#!/usr/bin/env python3
from __future__ import annotations

import argparse

from common import load, next_id, now, run_tool, save

parser = argparse.ArgumentParser(description='Зарегистрировать ответ Product Manager без автоматического создания требования')
parser.add_argument('--question-id', required=True)
parser.add_argument('--domain-id', required=True)
parser.add_argument('--decision', required=True, help='Полный смысл принятого решения, а не только «да»')
parser.add_argument('--message', required=True, help='Точный текст ответа Product Manager')
parser.add_argument('--requirement-text', help='Устаревший аргумент; текст больше не вставляется в requirements/')
args = parser.parse_args()

run_tool('sync_workspace.py')
questions_doc = load('product/open-questions.json')
question = next((item for item in questions_doc.get('questions', []) if item.get('id') == args.question_id), None)
if not question:
    raise SystemExit('Вопрос не зарегистрирован')
if args.domain_id not in (question.get('domainIds') or [question.get('domainId')]):
    raise SystemExit('Область вопроса не совпадает')
if question.get('answerEvidenceRef'):
    raise SystemExit('Ответ на вопрос уже зарегистрирован и ещё не встроен в продуктовый материал')
if len(args.message.strip()) < 2 or len(args.decision.strip()) < 3:
    raise SystemExit('Нужны точный ответ и полный смысл принятого решения')

evidence = load('product/evidence-register.json')
evidence_id = next_id('PM-DEC', evidence.get('evidence', []))
domains = question.get('domainIds') or [args.domain_id]
entry = {
    'id': evidence_id,
    'type': 'PRODUCT_MANAGER_DECISION',
    'questionId': args.question_id,
    'domainId': args.domain_id,
    'domainIds': domains,
    'decision': args.decision.strip(),
    'exactUserMessage': args.message,
    'createdAt': now(),
    'recordedBy': 'record_pm_decision.py',
}
evidence.setdefault('evidence', []).append(entry)
save('product/evidence-register.json', evidence)

for item in questions_doc.get('questions', []):
    if item.get('id') == args.question_id:
        item['status'] = 'ANSWERED_NOT_APPLIED'
        item['answerEvidenceRef'] = evidence_id
        item['answeredAt'] = now()
save('product/open-questions.json', questions_doc)
run_tool('sync_workspace.py')
print(evidence_id)
print('Ответ сохранён. Теперь встроите его смысл в соответствующий сценарий или правило и удалите блок открытого вопроса.')
