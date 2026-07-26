# Источник UI

Найденный продукт, Figma, Storybook, библиотека или старый прототип сначала регистрируется как кандидат `DISCOVERED_REFERENCE` через `tools/register_ui_candidate.py`.

Кандидат не разблокирует этап. Product Manager должен явно выбрать один из режимов:

- `SELECTED_UI_SOURCE` — использовать визуальные правила и компоненты как источник;
- `ADOPTED_PROTOTYPE` — принять существующий прототип как основу;
- `GENERATED_PROTOTYPE` — создать новый прототип на выбранном источнике.

Выбор регистрируется через `tools/record_ui_source.py`. Для Storybook обязателен список реально просмотренных stories/components. Нейтральный UI допустим только после отдельного решения Product Manager.

Даже при `ADOPTED_PROTOTYPE` этап VISUAL_PROTOTYPE завершается только после появления локальной проверяемой реализации в `visual-prototype/`.
