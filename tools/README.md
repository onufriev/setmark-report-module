# Инструменты Product Compiler

Инструменты рассчитаны на Python 3.10+ и не зависят от конкретной оболочки или операционной системы.

- Windows: используйте `py` или `python`.
- macOS и Linux: используйте `python3` или `python`.
- Во всех примерах ниже указан `python`; замените только имя интерпретатора, аргументы остаются теми же.
- Все пути передаются как аргументы Python. Скрипты не требуют Bash, PowerShell-командлетов или POSIX-утилит.
- Ввод и вывод принудительно переводятся в UTF-8, включая перенаправление вывода в Windows PowerShell и cmd.

## Установка инструментальных зависимостей

PDF-отчёты требуют ReportLab:

```text
python -m pip install -r requirements-tooling.txt
```

Для систем без подходящего кириллического шрифта задайте переменные окружения `PC_FONT_REGULAR` и `PC_FONT_BOLD` с абсолютными путями к TTF-файлам. Сам архив шрифты не содержит.

## Диагностика и самопроверка

```text
python tools/diagnose.py
python tools/self_test.py --suite core
python tools/self_test.py --suite report-generation
python tools/self_test.py --suite review-lifecycle
python tools/self_test.py --suite prototype
```

`diagnose.py` показывает ОС, версию Python, кодировки, наличие ReportLab, состояние JSON и workspace.

`self_test.py` работает в изолированной временной копии. Наборы разделены, чтобы каждый укладывался в ограничения обычного терминала и CI. Вместо четырёх команд можно запустить `python tools/self_test.py --suite all`. Проверяются:

- миграцию JSON из версий 4.0–4.2;
- старый и новый форматы требований;
- все CLI этапных отчётов с обязательным `--phase`;
- UTF-8 при эмуляции старой кодовой страницы Windows;
- локальную материализацию визуального прототипа;
- автоматическую синхронизацию индекса, полноты и состояния.

## Единая синхронизация

После любого изменения реестров или требований используйте:

```text
python tools/sync_workspace.py
```

Скрипт атомарно выполняет:

1. миграцию и нормализацию JSON;
2. построение `product/requirements-index.json`;
3. привязку legacy evidence к областям;
4. расчёт `product/completeness-report.json`;
5. расчёт корневого `project-state.json`.

Полезные варианты:

```text
python tools/sync_workspace.py --verbose
python tools/sync_workspace.py --strict-json
python tools/validate_json_documents.py
python tools/validate_workspace.py
```

`project-state.json`, индекс и отчёт полноты не редактируются вручную.

## Повторный запуск после изменений

Product Manager не запускает эту команду вручную. Её вызывает агент, когда получает короткое сообщение о внесённых изменениях и просьбу перезапустить процесс.

```text
python tools/restart_process.py --change-type REQUIREMENTS --reason "Я внёс изменения в требования, перезапусти процесс"
```

Инструмент определяет первый затронутый этап по типу изменения, переводит зависимые утверждённые ревью в `STALE_REVIEW`, делает baseline требований устаревшим при изменении требований, пересчитывает workspace и создаёт impact-отчёт в `reports/`.

## Источники

### Выбрать режим источников

```text
python tools/set_source_mode.py --mode CONVERSATION_ONLY
python tools/set_source_mode.py --mode FILES
python tools/set_source_mode.py --mode LINKS
python tools/set_source_mode.py --mode MIXED
```

### Зарегистрировать снимок

```text
python tools/register_source_snapshot.py --source-id SRC-001 --name "Основная спецификация" --type CONFLUENCE --origin "https://example" --snapshot sources/snapshots/source-001.md
```

### Зарегистрировать проверенную выдержку

`--domain-id` можно повторять, если выдержка подтверждает несколько областей.

```text
python tools/register_source_evidence.py --source-id SRC-001 --domain-id productContext --domain-id goalsScope --snapshot sources/snapshots/source-001.md --location "Раздел Цели" --excerpt "Точный фрагмент из снимка"
```

Поддерживаются старые структуры `evidenceEntries`, `evidenceId` и `snapshotFile`; при первой записи они мигрируют в канонические `evidence`, `id` и `snapshotPath`.

## Решения Product Manager

### Зафиксировать ответ на вопрос

```text
python tools/record_pm_decision.py --question-id Q-001 --domain-id productContext --decision CONFIRMED --message "Точный текст ответа Product Manager"
```

После регистрации решения требование необходимо обновить, сославшись на напечатанный `PM-DEC-*`, затем снова запустить синхронизацию.

### Источник UI

Найденный UI сначала регистрируется только как кандидат:

```text
python tools/register_ui_candidate.py --type FIGMA --location "https://figma.example/design" --notes "Найден в исходных материалах"
```

Выбор выполняется отдельным решением:

```text
python tools/record_ui_source.py --strategy FIGMA --application-mode GENERATED_PROTOTYPE --location "https://figma.example/design" --message "Используем этот макет как источник UI" --inspected-component Button --inspected-component Table
```

### Технологический стек

```text
python tools/record_stack_decision.py --selection standard --message "Используем стандартный стек"
```

Для собственного стека передайте JSON через `--selected-stack-json`.

### Источник данных рабочего прототипа

```text
python tools/record_prototype_data_source.py --type CSV --location prototype/data/demo.csv --classification SYNTHETIC --setup-method "Запустить seed-скрипт" --verification-method "Открыть тестовый сценарий и проверить 10 записей" --seed-command "python prototype/scripts/seed.py" --reset-command "python prototype/scripts/reset.py" --message "Для прототипа используем синтетический CSV"
```

Допустимые типы: `REAL_OBJECT`, `MANUAL_INPUT`, `DATABASE_SCRIPT`, `CSV`, `EMULATOR`, `POSTMAN_COLLECTION`, `API`, `OTHER`.

## Требования

```text
python tools/build_requirements_index.py --verbose
python tools/evaluate_completeness.py
python tools/commit_requirements.py
python tools/verify_requirements_baseline.py
```

Парсер понимает:

- `## REQ-FR-001. Название`;
- старый `## FR-001 — Название`;
- заголовок-описание с полем `**ID требования:** REQ-FR-001`;
- `NEEDS_INPUT`, `NEED_INPUTS` и `NEED_INPUT`.

Каждая область каталога должна содержать подтверждённое требование, подтверждённую неприменимость либо явный `NEEDS_INPUT`. Пустой файл автоматически становится блокирующим `NEEDS_INPUT`, а не считается заполненным.

## Локальный визуальный прототип

Внешней ссылки недостаточно. Материализуйте локальную копию в `visual-prototype/`.

### Каталог с HTML-прототипом

```text
python tools/materialize_visual_prototype.py --phase VISUAL_PROTOTYPE --mode DIRECTORY --source path/to/export --entrypoint index.html --source-reference "Confluence page 6487408709"
```

### Один HTML-файл

```text
python tools/materialize_visual_prototype.py --phase VISUAL_PROTOTYPE --mode HTML_FILE --source path/to/prototype.html --source-reference "Figma export"
```

### Скриншоты

```text
python tools/materialize_visual_prototype.py --phase VISUAL_PROTOTYPE --mode DIRECTORY --application-mode GENERATED_PROTOTYPE --source path/to/clickable-app --entrypoint index.html
```

Инструмент копирует файлы, создаёт локальную точку входа, заполняет `prototype-manifest.json`, формирует `PROTOTYPE-RUNBOOK.md` с кроссплатформенной командой запуска и автоматически регистрирует актуальное `ART-EV-*`. Для диагностического запуска без регистрации существует флаг `--skip-evidence`.

При повторной материализации создаётся новое доказательство. Завершить этап можно только по доказательству, SHA-256 которого совпадает с текущим содержимым `visual-prototype/`.

Проверка:

```text
python tools/validate_visual_prototype.py --phase VISUAL_PROTOTYPE
```

### Опциональный Storybook-прототип

После успешного `VISUAL_PROTOTYPE` Product Manager может указать исходники, из которых собирается Storybook. Это не обязательный этап: если исходников нет, его можно пропустить.

```text
python tools/prepare_visual_prototype_storybook.py --source <каталог-исходников> --source-reference "<описание источника>"
```

Инструмент проверяет `.storybook`, `package.json`, `src` и наличие stories, создаёт `visual-prototype-storybook/`, исключает `node_modules`, сборки, документацию и тестовые каталоги, а также обновляет `csi_ui-prototype-kit/source-manifest.json`. Экранные stories продукта добавляются в `visual-prototype-storybook/src/product/`.


## Рабочий прототип

До готовности рабочего прототипа должны быть заполнены:

- `prototype/prototype-manifest.json`;
- `prototype/PROTOTYPE-RUNBOOK.md`;
- источник данных;
- технологический стек;
- команды запуска, остановки, health-check, наполнения и сброса данных;
- основной проверочный сценарий.

После реализации точки входа создайте манифест и заполненную инструкцию одной командой. Общие команды должны работать на всех ОС; при необходимости передайте отдельные `--windows-*` и `--unix-*` варианты:

```text
python tools/prepare_working_prototype.py --phase WORKING_PROTOTYPE --application-name "Demo App" --entrypoint prototype/app.py --start-command "python prototype/app.py" --stop-command "Остановить процесс приложения" --health-check "http://localhost:8080/health" --verification-command "python prototype/verify.py" --prerequisite "Python 3.10+" --port "8080"
```

Затем проверьте:

```text
python tools/validate_working_prototype.py --phase WORKING_PROTOTYPE
```

Регистрация доказательства выполняется только после успешной проверки:

```text
python tools/register_artifact_evidence.py --phase WORKING_PROTOTYPE --path prototype --type working-prototype --runbook prototype/PROTOTYPE-RUNBOOK.md --data-source-ref product/prototype-data-source.json --check "Основной сценарий выполнен" --result PASSED --command "Команда, которой реально проверен прототип"
```

## Контрольные отчёты

Все Markdown и PDF находятся только в `reports/`.

### 1. Создать PDF и зарегистрировать отчёт

```text
python tools/finalize_phase_review.py --phase PRODUCT_DEFINITION --markdown reports/product-definition.md
```

`generate_stage_report.py` и `register_phase_review.py` имеют единый CLI с `--phase`, `--markdown`, `--pdf`, но `register_phase_review.py` является внутренним и напрямую не вызывается.

### 2. Подготовить ссылки для показа

```text
python tools/present_phase_review.py --phase PRODUCT_DEFINITION
```

При необходимости можно добавить `--review-id PRODUCT_DEFINITION-R1`.

### 3. Отметить фактический показ

```text
python tools/mark_phase_review_shown.py --phase PRODUCT_DEFINITION
```

### 4. После отдельного ответа Product Manager утвердить

```text
python tools/approve_phase_review.py --phase PRODUCT_DEFINITION --decision APPROVED --message "Продолжаем к визуальному прототипу"
```

Каждый из этих скриптов синхронизирует состояние автоматически. Переход нельзя выполнить позиционным ID или ручной правкой JSON.

## Прочие инструменты

- `register_conflict.py` — зарегистрировать противоречие источников или решений.
- `register_artifact_evidence.py` — зарегистрировать проверенный локальный артефакт.
- `normalize_workspace_json.py` — миграция legacy JSON; обычно вызывается через `sync_workspace.py`.
- `sync_project_state.py` — низкоуровневый расчёт состояния; обычно вызывается через `sync_workspace.py`.
- `json_contracts.py`, `state_model.py`, `requirements_baseline.py`, `common.py` — внутренние модули, не самостоятельные команды рабочего процесса.
