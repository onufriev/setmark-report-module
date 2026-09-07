# 7. Трассировка и углубление в требования

## Покрытие handoff-разделов

| Раздел handoff | Канонические файлы | Требования |
|---|---|---|
| Продукт и бизнес | `01-base/goals-and-scope.md`, `market-assessment.md`, `product-context.md`, `sales-objects.md` | `REQ-GS-*`, `REQ-MKT-*`, `REQ-PC-*`, `REQ-SO-*`, `REQ-DEC-003`, `REQ-DEC-004`, `REQ-DEC-034`, `REQ-DEC-052`, `REQ-DEC-089` |
| Сценарии и интерфейс | `02-system/system-requirements.md`, `06-system-scenarios/*.md`, `07-scenarios/*.md`, `08-acceptance/*.md` | `REQ-FR-*`, `REQ-AC-001`, `REQ-DEC-020`, `REQ-DEC-021`, `REQ-DEC-023`, `REQ-DEC-024`, `REQ-DEC-025`, `REQ-DEC-026`, `REQ-DEC-030`, `REQ-DEC-033`, `REQ-DEC-037`, `REQ-DEC-040`–`REQ-DEC-044` |
| Система и техника | `02-system/business-rules.md`, `entities-and-data.md`, `roles-and-permissions.md`, `states-and-errors.md`, `03-architecture/*.md` | `REQ-BR-*`, `REQ-BO-*`, `REQ-DEC-001`, `REQ-DEC-002`, `REQ-DEC-006`–`REQ-DEC-014`, `REQ-DEC-031`, `REQ-DEC-035`, `REQ-DEC-036`, `REQ-DEC-046`–`REQ-DEC-067`, `REQ-DEC-073`, `REQ-DEC-074`, `REQ-DEC-076`, `REQ-DEC-078`, `REQ-DEC-079`–`REQ-DEC-087`, `REQ-DEC-090`, `REQ-DEC-091`–`REQ-DEC-095` |
| Нефункциональные и эксплуатация | `04-quality/*.md`, `06-system-scenarios/operational-scenarios.md`, `exception-scenarios.md` | `REQ-NFR-*`, `REQ-DEC-015`–`REQ-DEC-018`, `REQ-DEC-020`, `REQ-DEC-022`, `REQ-DEC-038`, `REQ-DEC-071`, `REQ-DEC-072`, `REQ-DEC-083` |
| MVP, контекст и ответственность | `01-base/goals-and-scope.md`, `product-context.md`, `03-architecture/*.md`, `05-integrations/integrations.md` | `REQ-GS-001`–`REQ-GS-004`, `REQ-PC-001`, `REQ-PC-002`, `REQ-DEC-003`, `REQ-DEC-004`, `REQ-DEC-011`–`REQ-DEC-014`, `REQ-DEC-019`, `REQ-DEC-032`, `REQ-DEC-075`, `REQ-DEC-081`, `REQ-DEC-087` |
| Данные и интеграции | `05-integrations/data-requirements.md`, `integrations.md`, `02-system/entities-and-data.md` | `REQ-DATA-*`, `REQ-INT-*`, `REQ-BO-*`, `REQ-DEC-018`, `REQ-DEC-032`, `REQ-DEC-035`, `REQ-DEC-038`, `REQ-DEC-039`, `REQ-DEC-068`–`REQ-DEC-070`, `REQ-DEC-075`, `REQ-DEC-088`, `REQ-DEC-097`–`REQ-DEC-099` |
| Трассировка и глубина | `09-traceability/traceability.md`, все файлы требований и `product/requirements-index.json` | `REQ-DEC-027`, `REQ-DEC-045`, а также полный индекс из 132 требований |

## Карта углубления

- Формулы штрафа, типы нарушений, критичность, необходимые действия и Контуры устранения: `requirements/02-system/business-rules.md`.
- Сущности, атрибуты, состояния и права: `requirements/02-system/entities-and-data.md`, `roles-and-permissions.md`, `states-and-errors.md`.
- Полный UI-поток, переходы, фильтры, агрегаты, CSV, PDF и уведомления: `requirements/02-system/system-requirements.md`, `07-scenarios/`, `08-acceptance/`.
- Интеграционные границы, свежесть, полнота, дедупликация и объёмы: `requirements/05-integrations/`.
- Производительность, восстановление, локализация, доступность и оборудование: `requirements/03-architecture/`, `requirements/04-quality/`, `requirements/06-system-scenarios/`.
- Полная обратная связь между разделами и критериями: `requirements/09-traceability/traceability.md`.

## Конфликты и незакрытые вопросы

В `product/conflict-register.json` конфликтов нет. В `product/open-questions.json` незакрытых вопросов нет. Production-стек и источник данных рабочего прототипа не являются незакрытым требованием для этого handoff: рабочий прототип пропущен утверждённым решением, а производственные решения переданы команде разработки.

Трассировка: `REQ-DEC-027`, `REQ-DEC-028`, `REQ-DEC-045`; полный обратный индекс — `product/requirements-index.json`.
