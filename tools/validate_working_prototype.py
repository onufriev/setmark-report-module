#!/usr/bin/env python3
from __future__ import annotations

import argparse

from common import ROOT, load, project_path

parser = argparse.ArgumentParser(description='Проверить рабочий прототип')
parser.add_argument('--phase', required=True, choices=['WORKING_PROTOTYPE'])
args = parser.parse_args()

errors = []
stack = load('product/technology-stack.json')
data_source = load('product/prototype-data-source.json')
manifest = load('prototype/prototype-manifest.json')

if stack.get('status') not in {'Подтверждено Product Manager', 'Временно принято Product Manager'} or not stack.get('selectedStack'):
    errors.append('Технологический стек не подтверждён')
if data_source.get('status') not in {'Подтверждено Product Manager', 'Временно принято Product Manager'}:
    errors.append('Источник данных рабочего прототипа не подтверждён')
for field in ('sourceType', 'location', 'setupMethod', 'verificationMethod'):
    if not data_source.get(field) or data_source.get(field) == 'UNKNOWN':
        errors.append(f'Не заполнено поле источника данных: {field}')
if manifest.get('status') != 'READY':
    errors.append('prototype-manifest.json должен иметь status=READY')
for field in ('applicationName', 'entryPoint', 'startCommand', 'stopCommand', 'healthCheck', 'runbookPath', 'dataSourceRef', 'verificationCommand', 'platformCommands'):
    if not manifest.get(field):
        errors.append(f'В prototype-manifest.json не заполнено поле {field}')
if manifest.get('dataSourceRef') != 'product/prototype-data-source.json':
    errors.append('dataSourceRef должен указывать на product/prototype-data-source.json')
if manifest.get('seedCommand') != data_source.get('seedCommand'):
    errors.append('seedCommand в манифесте и источнике данных расходятся')
if manifest.get('resetCommand') != data_source.get('resetCommand'):
    errors.append('resetCommand в манифесте и источнике данных расходятся')

runbook_path = manifest.get('runbookPath')
if runbook_path:
    try:
        runbook = project_path(runbook_path, must_exist=True, allowed_root='prototype')
        text = runbook.read_text(encoding='utf-8')
        required_headings = [f'## {index}.' for index in range(1, 11)]
        for heading in required_headings:
            if heading not in text:
                errors.append(f'В инструкции отсутствует раздел {heading}')
        if 'NEEDS_INPUT' in text or 'NEED_INPUTS' in text:
            errors.append('Инструкция рабочего прототипа содержит незаполненные NEEDS_INPUT')
        source_markers = [str(data_source.get('sourceType')), str(data_source.get('location'))]
        if not all(marker and marker in text for marker in source_markers):
            errors.append('Инструкция не содержит выбранный тип и расположение источника данных')
    except SystemExit as exc:
        errors.append(str(exc))

entry = manifest.get('entryPoint')
if entry:
    try:
        entry_path = project_path(entry, must_exist=True, allowed_root='prototype')
        if not entry_path.is_file():
            errors.append('entryPoint рабочего прототипа должна быть файлом')
    except SystemExit as exc:
        errors.append(str(exc))
implementation_files = [
    path for path in (ROOT / 'prototype').rglob('*')
    if path.is_file() and path.name not in {'README.md', 'PROTOTYPE-RUNBOOK.md', 'prototype-manifest.json', '.env.example'}
]
if not implementation_files:
    errors.append('В prototype/ нет реализации; одной инструкции и манифеста недостаточно')
if (ROOT / 'prototype/.env').exists():
    errors.append('В prototype/ запрещено хранить .env с секретами; используйте .env.example')

if errors:
    for error in errors:
        print('ERROR:', error)
    raise SystemExit(1)
print('OK: рабочий прототип имеет реализацию, источник данных и полную инструкцию запуска')
