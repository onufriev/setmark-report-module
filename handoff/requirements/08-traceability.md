# 08. Трассировка и углубление в требования

Этот handoff является читабельной компиляцией. При спорной детали архитектор или лид
переходит к каноническому требованию, а не делает вывод по сокращённому тексту.

| Документ handoff | Канонические разделы |
|---|---|
| 01-product-scope | `requirements/01-base/` |
| 02-system-context-and-boundaries | `requirements/03-architecture/`, `requirements/05-integrations/`, `requirements/06-system-scenarios/system-scenarios.md` |
| 03-domain-model-and-rules | `requirements/02-system/entities-and-data.md`, `roles-and-permissions.md`, `states-and-errors.md`, `business-rules.md` |
| 04-user-flows-and-ui | `requirements/02-system/system-requirements.md`, `requirements/07-scenarios/`, `requirements/03-architecture/component-source.md` |
| 05-data-and-integrations | `requirements/05-integrations/` |
| 06-capabilities-and-acceptance | `requirements/08-acceptance/` |
| 07-nonfunctional-and-operations | `requirements/03-architecture/`, `requirements/04-quality/`, `requirements/06-system-scenarios/` |

## Правило разрешения расхождений

Если сжатая формулировка handoff расходится с каноническим `REQ-*`, источником
истины остаётся каноническое требование и baseline. Если два требования задают
несовместимое пользовательское поведение, это продуктовый вопрос; если остаётся
выбор реализации при неизменном поведении, это архитектурное решение команды.

## Зафиксированные границы для технического решения

- production-стек и способ развёртывания не заданы продуктом;
- production-источник данных и технический способ работы с УКЭП не заданы продуктом;
- нет требования перенести Журнал нарушений как техническую миграцию: необходимы
  отдельно оценить совместимость URL, закладки, сохранённые фильтры, права и ссылки;
- новая интеграция True API должна быть создана в Set Mark, не в SetCentrum;
- целевой автоматический режим не входит в MVP, но ручной ingestion не должен
  исключать его последующее добавление.

**Базовая версия требований:** `REQ-BASELINE-014`.
