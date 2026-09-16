#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json

from common import load, now, project_path, run_tool, save


def bullet_lines(values: list[str], empty_text: str) -> str:
    return '\n'.join(f'- `{value}`' for value in values) if values else f'- {empty_text}'


def command_block(common: str, windows: str | None, unix: str | None) -> str:
    lines = [f'Общая команда:\n\n```text\n{common}\n```']
    if windows:
        lines.append(f'Windows PowerShell/cmd:\n\n```text\n{windows}\n```')
    if unix:
        lines.append(f'macOS/Linux:\n\n```text\n{unix}\n```')
    return '\n\n'.join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(
        description='Создать манифест и полную инструкцию запуска уже реализованного рабочего прототипа'
    )
    parser.add_argument('--phase', required=True, choices=['WORKING_PROTOTYPE'])
    parser.add_argument('--application-name', required=True)
    parser.add_argument('--entrypoint', required=True, help='Файл внутри prototype/')
    parser.add_argument('--start-command', required=True)
    parser.add_argument('--stop-command', required=True)
    parser.add_argument('--health-check', required=True)
    parser.add_argument('--verification-command', required=True)
    parser.add_argument('--windows-start-command')
    parser.add_argument('--windows-stop-command')
    parser.add_argument('--unix-start-command')
    parser.add_argument('--unix-stop-command')
    parser.add_argument('--prerequisite', action='append', default=[])
    parser.add_argument('--environment', action='append', default=[], help='NAME=example; без секретов')
    parser.add_argument('--configuration', action='append', default=[])
    parser.add_argument('--port', action='append', default=[])
    parser.add_argument('--test-account', action='append', default=[])
    parser.add_argument('--troubleshooting', action='append', default=[])
    args = parser.parse_args()

    entrypoint = project_path(args.entrypoint, must_exist=True, allowed_root='prototype')
    if not entrypoint.is_file():
        raise SystemExit('--entrypoint должен указывать на существующий файл реализации')
    if any(not value.strip() for value in (args.application_name, args.start_command, args.stop_command, args.health_check, args.verification_command)):
        raise SystemExit('Команды и название приложения не могут быть пустыми')

    data_source = load('product/prototype-data-source.json')
    stack = load('product/technology-stack.json')
    if data_source.get('status') not in {'Подтверждено Product Manager', 'Временно принято Product Manager'}:
        raise SystemExit('Сначала подтвердите источник данных через record_prototype_data_source.py')
    if stack.get('status') not in {'Подтверждено Product Manager', 'Временно принято Product Manager'}:
        raise SystemExit('Сначала подтвердите технологический стек через record_stack_decision.py')

    platform_commands = {
        'windows': {
            'start': args.windows_start_command or args.start_command,
            'stop': args.windows_stop_command or args.stop_command,
        },
        'macosLinux': {
            'start': args.unix_start_command or args.start_command,
            'stop': args.unix_stop_command or args.stop_command,
        },
    }
    manifest = load('prototype/prototype-manifest.json')
    manifest.update({
        'status': 'READY',
        'applicationName': args.application_name,
        'entryPoint': args.entrypoint.replace('\\', '/'),
        'startCommand': args.start_command,
        'stopCommand': args.stop_command,
        'healthCheck': args.health_check,
        'runbookPath': 'prototype/PROTOTYPE-RUNBOOK.md',
        'dataSourceRef': 'product/prototype-data-source.json',
        'seedCommand': data_source.get('seedCommand'),
        'resetCommand': data_source.get('resetCommand'),
        'requiredEnvironmentVariables': args.environment,
        'configurationFiles': args.configuration,
        'ports': args.port,
        'testAccounts': args.test_account,
        'verificationCommand': args.verification_command,
        'platformCommands': platform_commands,
        'preparedAt': now(),
        'notes': 'Инструкция создана штатным инструментом prepare_working_prototype.py.',
    })
    # Keep a normalized project-relative entry point even when Windows separators
    # were supplied by the caller.
    manifest['entryPoint'] = entrypoint.relative_to(project_path('prototype')).as_posix()
    manifest['entryPoint'] = 'prototype/' + manifest['entryPoint']
    save('prototype/prototype-manifest.json', manifest)

    selected_stack = json.dumps(stack.get('selectedStack'), ensure_ascii=False, indent=2)
    seed = data_source.get('seedCommand') or 'Не требуется; выполните описанный способ подготовки данных.'
    reset = data_source.get('resetCommand') or 'Не требуется либо выполняется вручную согласно способу подготовки.'
    prerequisites = args.prerequisite or ['Установить инструменты и версии из подтверждённого технологического стека.']
    troubleshooting = args.troubleshooting or [
        'Проверить вывод команды запуска и доступность портов.',
        'Проверить конфигурацию и наличие подготовленных данных.',
        'Повторить health-check и verification command.',
    ]
    runbook = f'''# Инструкция по запуску рабочего прототипа

## 1. Назначение и состав

Приложение: **{args.application_name}**. Точка входа: `{manifest['entryPoint']}`.

Подтверждённый технологический стек:

```json
{selected_stack}
```

## 2. Предварительные требования

{bullet_lines(prerequisites, 'Дополнительные требования отсутствуют.')}

Команды запуска не зависят от оболочки. Если для Windows и macOS/Linux нужны разные команды, они приведены отдельно ниже.

## 3. Конфигурация

Конфигурационные файлы:

{bullet_lines(args.configuration, 'Дополнительные конфигурационные файлы не требуются.')}

Переменные окружения с демонстрационными значениями, без секретов:

{bullet_lines(args.environment, 'Переменные окружения не требуются.')}

Порты:

{bullet_lines(args.port, 'Дополнительные сетевые порты не используются.')}

## 4. Запуск приложения

{command_block(args.start_command, args.windows_start_command, args.unix_start_command)}

Ожидаемый результат: приложение запускается без необработанных ошибок и отвечает на health-check.

## 5. Источник и подготовка данных

- Тип: `{data_source.get('sourceType')}`.
- Расположение: `{data_source.get('location')}`.
- Классификация: `{data_source.get('dataClassification')}`.
- Способ подготовки: {data_source.get('setupMethod')}.

Команда наполнения:

```text
{seed}
```

## 6. Проверка запуска

Health-check:

```text
{args.health_check}
```

Полная проверка основного сценария:

```text
{args.verification_command}
```

Критерий проверки данных: {data_source.get('verificationMethod')}.

## 7. Тестовые учётные записи

{bullet_lines(args.test_account, 'Авторизация не используется или тестовые учётные записи не требуются.')}

Секреты и реальные пароли в репозитории не сохраняются.

## 8. Остановка и очистка

{command_block(args.stop_command, args.windows_stop_command, args.unix_stop_command)}

## 9. Повторное наполнение данными

Команда сброса:

```text
{reset}
```

После сброса повторите команду наполнения из раздела 5 и verification command из раздела 6.

## 10. Устранение проблем

{bullet_lines(troubleshooting, 'Сначала проверьте команду запуска, конфигурацию, данные и health-check.')}
'''
    runbook_path = project_path('prototype/PROTOTYPE-RUNBOOK.md', allowed_root='prototype')
    runbook_path.write_text(runbook, encoding='utf-8', newline='\n')

    validation = run_tool('validate_working_prototype.py', ['--phase', args.phase], allowed_returncodes={0, 1})
    if validation.returncode:
        print(validation.stdout, end='')
        print(validation.stderr, end='')
        return validation.returncode
    run_tool('sync_workspace.py')
    print(f'OK: подготовлены манифест и инструкция; entryPoint={manifest["entryPoint"]}')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
