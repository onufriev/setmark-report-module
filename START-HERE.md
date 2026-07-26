# Начало работы с Product Compiler 4.3

## 1. Запуск

Один раз установите зависимости:

```text
python -m pip install -r requirements-tooling.txt
```

В Windows допустим `py`, в macOS/Linux — `python3`. Скрипты используют `pathlib`, UTF-8 и не требуют конкретной оболочки.

Напишите агенту:

```text
Начни работу над продуктом.
```

Сначала выбирается источник: ссылки, файлы, несколько источников или описание идеи только в диалоге.

## 2. Этапы

`SOURCE_SETUP -> INTAKE -> PRODUCT_DEFINITION -> VISUAL_PROTOTYPE -> VISUAL_VALIDATION -> WORKING_PROTOTYPE -> WORKING_VALIDATION -> HANDOFF_READY`

Этап меняется только после зарегистрированного, показанного и отдельно утверждённого отчёта.

## 3. Требования до визуального прототипа

Каждая область из `internal/domain-catalog.json` должна содержать одно из трёх:

- подтверждённые требования с `SRC-EV-*` или `PM-DEC-*`;
- явное решение `Не применимо - подтверждено Product Manager`;
- `NEEDS_INPUT` с конкретным вопросом, который блокирует переход.

Пустой файл, правдоподобный текст без основания или отсутствие раздела не считаются результатом.

После прохождения gate `VISUAL_PROTOTYPE` требования фиксируются:

```text
python tools/commit_requirements.py
```

## 4. Отчёты

Markdown создаётся внутри `reports/`. PDF и регистрация выполняются одной командой:

```text
python tools/finalize_phase_review.py --phase PRODUCT_DEFINITION --markdown reports/product-definition.md
```

Прямое редактирование `product/phase-reviews.json` и прямой вызов `register_phase_review.py` запрещены.

## 5. Прототипы

В `visual-prototype/` и `prototype/` должны быть:

- реальная локальная реализация;
- `prototype-manifest.json`;
- заполненный `PROTOTYPE-RUNBOOK.md`;
- проверяемая точка входа;
- описание данных и способа запуска.

Для рабочего прототипа до создания кода отдельно подтверждаются стек и источник данных. Внешний визуальный материал переносится локально через `tools/materialize_visual_prototype.py`, а инструкция рабочего приложения формируется через `tools/prepare_working_prototype.py`.
