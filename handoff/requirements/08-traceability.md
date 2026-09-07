# Трассировка

Этот документ собран из канонического каталога `requirements/`. Он предназначен для чтения командой реализации и не заменяет канонические требования.

## MVP

### REQ-DEC-188. Обезличивание требований и итоговых материалов

Канонические требования и итоговый `handoff/` должны содержать требования, а не названия конкретных клиентов или исходные формулировки клиентской обратной связи. Исторические `PM-DEC-*` и служебные идентификаторы в реестре доказательств сохраняются для аудита и трассировки. Перед передачей в разработку итоговые материалы проверяются на отсутствие названий конкретных клиентов и клиентских комментариев, не преобразованных в требования.


**Как проверить**
Реализация соответствует решению PM-DEC-203.

### REQ-DEC-185. Назначение вспомогательной документации

Каталог `docs/` содержит вспомогательные человекочитаемые материалы: руководства, аналитические модели, подробные пояснения, диаграммы и презентации. Материалы `docs/product-definition/` не являются базовыми или каноническими требованиями и не заменяют `requirements/`. Product Manager, аналитики, архитекторы и разработчики могут использовать `docs/` для получения контекста. Любое обязательное правило из `docs/` должно быть представлено подтверждённым требованием в `requirements/`. При противоречии приоритет имеет `requirements/`, а расхождение регистрируется и выносится на решение Product Manager. Реализация и приёмка проверяются по `requirements/` и их производному итоговому `handoff/`, а не непосредственно по `docs/`. Устаревшие или дублирующие документы должны быть явно помечены как исторические либо перенесены в `reference-materials/`.


**Как проверить**
Реализация соответствует решению PM-DEC-200.

### REQ-DEC-184. Назначение справочных материалов

Каталог `reference-materials/` хранит внешние документы, исходные материалы, исторические снимки и переносимые между проектами материалы. Он не является каноническим источником требований. Product Compiler использует материалы каталога как источники и доказательства; Product Manager, аналитики и разработчики могут обращаться к ним за контекстом. Обязательные для реализации требования находятся в `requirements/`, а итоговый `handoff/` представляет их в удобном для команды разработки виде. Ни одно действующее требование или открытый продуктовый вопрос не должно существовать только в `reference-materials/`. При расхождении действует подтверждённое каноническое требование из `requirements/`, а исходный материал сохраняется для истории и аудита.


**Как проверить**
Реализация соответствует решению PM-DEC-199.

### REQ-DEC-142. Решение Product Manager

Трассировка MVP включает неизменённые функции существующего Журнала нарушений, Обзор, список Инциденты, карточку собранных и сопоставленных данных и настройки подключения True API, критичности и ручной синхронизации. Автоматический анализ, рекомендации, отдельные Необходимые действия и Аналитика, CSV, PDF и уведомления трассируются как функции следующего этапа.


**Как проверить**
Реализация соответствует решению PM-DEC-157.

## Следующий этап

### REQ-DEC-178. Решение Product Manager

Функция ежедневного дайджеста следующего этапа трассируется через функциональное требование отправки, настройку получателей, правило критичности, данные предыдущего календарного дня, SMTP-интеграцию, состояния доставки, пользовательский переход в отфильтрованные Инциденты и критерии приёмки. Усечённый режим связан с явным запретом отправки.


**Как проверить**
Реализация соответствует решению PM-DEC-193.

### REQ-DEC-045. Решение Product Manager

Трассировка дополнена следующими связями:

1. Границы новых функций — `REQ-DEC-034`.
2. Один тип нарушения, единый признак критичности, потенциальный штраф и данные необходимого действия — `REQ-DEC-035`.
3. Правила приоритизации действий и совместного применения фильтров — `REQ-DEC-036`.
4. Общий период, показатели Дашборда, необходимые действия, диаграмма по типам, множественный фильтр типов, адаптивная аналитика и PDF — `REQ-DEC-037`.
5. Два сигнала состояния данных — `REQ-DEC-038`.
6. Полный код маркировки, поиск и состав PDF — `REQ-DEC-039`.
7. Согласованность кликабельных агрегатов и открываемых выборок — `REQ-DEC-040`.
8. Бизнес-сценарии необходимых действий и PDF — `REQ-DEC-041`.
9. Основной пользовательский путь через Дашборд, список, карточку и аналитику — `REQ-DEC-042`.
10. Проверяемые критерии приёмки — `REQ-DEC-043`.
11. Критерий успешной проверки прототипа — `REQ-DEC-044`.
12. Главная цель раннего выявления и снижения последствий нарушений — `REQ-GS-002`; она связана с приоритизацией критических инцидентов, анализом причин и компенсирующими действиями, предотвращающими повторение. Снижение вероятности проверок и штрафов учитывается как ожидаемый эффект действий клиента.
13. Расчёт потенциального штрафа, включая накопительные составы без двойного учёта, — `REQ-DEC-053`.

Пункт 13 и связанные уточнения трассировки подтверждены Product Manager 31.08.2026.

Для каждого кликабельного агрегата критерий приёмки проверяет совпадение исходного значения и открываемой выборки.


**Как проверить**
Реализация соответствует решению PM-DEC-046; главное продуктовое обещание и основные пользовательские сценарии трассируются к `REQ-GS-002`, а агрегированный потенциальный штраф — к `REQ-DEC-053`.

### REQ-DEC-027. Решение Product Manager

Для MVP утверждается следующая трассировка требований:

1. **Обзор сети** — главная бизнес-цель снижения риска получения штрафов (`REQ-GS-002`), цели и границы, иерархия объектов, роли, централизованный мониторинг, бизнес-сценарии и основной пользовательский путь; проверяется возможностью определить критические инциденты и объекты с наибольшим риском, корректным агрегированным потенциальным штрафом по `REQ-DEC-053` и выбором произвольного диапазона дат по `REQ-DEC-033`.
2. **Список инцидентов и фильтры** — модель сущностей, мониторинг, бизнес-сценарии и пользовательский путь; проверяется переходом от сети, магазина, кассы, товарной группы или вида нарушения к нужным инцидентам, а также выбором произвольного диапазона дат по `REQ-DEC-033`.
3. **Карточка инцидента** — бизнес-правила, корреляция данных, системный сценарий, данные и интеграции; проверяется наличием исходного снимка, понятного результата проверки без технического кода `RA-*`, объяснения, критичности, потенциального штрафа, Контура устранения, рекомендации, полного кода маркировки и PDF.
4. **Аналитика и CSV** — мониторинг, выгрузка, бизнес-сценарии и пользовательский путь; проверяется сохранением контекста, согласованностью фильтров и корректной выгрузкой. CSV не содержит отдельного признака «Риск автоштрафа» и потенциальной суммы штрафа.
5. **Ежедневные уведомления** — функциональное требование уведомлений и бизнес-сценарий; проверяется переходом к соответствующему инциденту или выборке.
6. **Настройки функции** — роли и права, бизнес-сценарий администратора; проверяется управлением подключением, получателями и сроком хранения.
7. **Исключительные и эксплуатационные сценарии** применяются ко всем соответствующим экранам и путям: свежесть и полнота данных, ошибки, повторная обработка, защита от дубликатов и отсутствие влияния на продажи.
8. Для каждого сценария, экрана и критерия проверки указываются канонические `REQ-*`; каждое требование MVP должно иметь хотя бы одну связь, а неподтверждённые вопросы не считаются требованиями.

Уточнения расчёта потенциального штрафа и CSV подтверждены Product Manager 31.08.2026.


**Как проверить**
Реализация соответствует решению PM-DEC-027 и позволяет проследить реализацию главной бизнес-цели `REQ-GS-002` через обзор, приоритизацию критических инцидентов, анализ причин, потенциальный штраф и необходимые действия.

## Индекс канонических требований

| Требование | Канонический файл | Раздел handoff |
|---|---|---|
| `REQ-AC-001` | `requirements/08-acceptance/acceptance-criteria.md` | [Возможности и приёмка](06-capabilities-and-acceptance.md) |
| `REQ-BO-001` | `requirements/02-system/entities-and-data.md` | [Предметная модель, состояния и бизнес-правила](03-domain-model-and-rules.md) |
| `REQ-BO-002` | `requirements/02-system/entities-and-data.md` | [Предметная модель, состояния и бизнес-правила](03-domain-model-and-rules.md) |
| `REQ-BO-003` | `requirements/02-system/entities-and-data.md` | [Предметная модель, состояния и бизнес-правила](03-domain-model-and-rules.md) |
| `REQ-BR-001` | `requirements/02-system/business-rules.md` | [Предметная модель, состояния и бизнес-правила](03-domain-model-and-rules.md) |
| `REQ-BR-002` | `requirements/02-system/business-rules.md` | [Предметная модель, состояния и бизнес-правила](03-domain-model-and-rules.md) |
| `REQ-BR-003` | `requirements/02-system/business-rules.md` | [Предметная модель, состояния и бизнес-правила](03-domain-model-and-rules.md) |
| `REQ-DATA-001` | `requirements/05-integrations/data-requirements.md` | [Данные, интеграции и системная обработка](05-data-and-integrations.md) |
| `REQ-DATA-002` | `requirements/05-integrations/data-requirements.md` | [Данные, интеграции и системная обработка](05-data-and-integrations.md) |
| `REQ-DATA-003` | `requirements/05-integrations/data-requirements.md` | [Данные, интеграции и системная обработка](05-data-and-integrations.md) |
| `REQ-DATA-004` | `requirements/05-integrations/data-requirements.md` | [Данные, интеграции и системная обработка](05-data-and-integrations.md) |
| `REQ-DEC-001` | `requirements/02-system/business-rules.md` | [Предметная модель, состояния и бизнес-правила](03-domain-model-and-rules.md) |
| `REQ-DEC-002` | `requirements/02-system/entities-and-data.md` | [Предметная модель, состояния и бизнес-правила](03-domain-model-and-rules.md) |
| `REQ-DEC-003` | `requirements/01-base/goals-and-scope.md` | [Продукт, цели и границы](01-product-scope.md) |
| `REQ-DEC-004` | `requirements/01-base/product-context.md` | [Продукт, цели и границы](01-product-scope.md) |
| `REQ-DEC-006` | `requirements/02-system/entities-and-data.md` | [Предметная модель, состояния и бизнес-правила](03-domain-model-and-rules.md) |
| `REQ-DEC-007` | `requirements/02-system/business-rules.md` | [Предметная модель, состояния и бизнес-правила](03-domain-model-and-rules.md) |
| `REQ-DEC-008` | `requirements/02-system/roles-and-permissions.md` | [Пользователи, сценарии и интерфейс](04-user-flows-and-ui.md) |
| `REQ-DEC-009` | `requirements/02-system/states-and-errors.md` | [Предметная модель, состояния и бизнес-правила](03-domain-model-and-rules.md) |
| `REQ-DEC-010` | `requirements/02-system/system-requirements.md` | [Возможности и приёмка](06-capabilities-and-acceptance.md) |
| `REQ-DEC-011` | `requirements/03-architecture/component-source.md` | [Пользователи, сценарии и интерфейс](04-user-flows-and-ui.md) |
| `REQ-DEC-012` | `requirements/03-architecture/hardware-requirements.md` | [Системный контекст и границы реализации](02-system-context-and-boundaries.md) |
| `REQ-DEC-013` | `requirements/03-architecture/technical-constraints.md` | [Системный контекст и границы реализации](02-system-context-and-boundaries.md) |
| `REQ-DEC-014` | `requirements/03-architecture/technical-constraints.md` | [Системный контекст и границы реализации](02-system-context-and-boundaries.md) |
| `REQ-DEC-015` | `requirements/04-quality/accessibility-requirements.md` | [Нефункциональные и эксплуатационные требования](07-nonfunctional-and-operations.md) |
| `REQ-DEC-016` | `requirements/04-quality/localization-requirements.md` | [Нефункциональные и эксплуатационные требования](07-nonfunctional-and-operations.md) |
| `REQ-DEC-017` | `requirements/04-quality/quality-requirements.md` | [Нефункциональные и эксплуатационные требования](07-nonfunctional-and-operations.md) |
| `REQ-DEC-018` | `requirements/05-integrations/data-requirements.md` | [Данные, интеграции и системная обработка](05-data-and-integrations.md) |
| `REQ-DEC-019` | `requirements/05-integrations/integrations.md` | [Данные, интеграции и системная обработка](05-data-and-integrations.md) |
| `REQ-DEC-020` | `requirements/06-system-scenarios/exception-scenarios.md` | [Нефункциональные и эксплуатационные требования](07-nonfunctional-and-operations.md) |
| `REQ-DEC-021` | `requirements/06-system-scenarios/system-scenarios.md` | [Данные, интеграции и системная обработка](05-data-and-integrations.md) |
| `REQ-DEC-022` | `requirements/06-system-scenarios/operational-scenarios.md` | [Нефункциональные и эксплуатационные требования](07-nonfunctional-and-operations.md) |
| `REQ-DEC-023` | `requirements/07-scenarios/business-scenarios.md` | [Пользователи, сценарии и интерфейс](04-user-flows-and-ui.md) |
| `REQ-DEC-024` | `requirements/07-scenarios/user-journeys.md` | [Пользователи, сценарии и интерфейс](04-user-flows-and-ui.md) |
| `REQ-DEC-025` | `requirements/08-acceptance/acceptance-criteria.md` | [Возможности и приёмка](06-capabilities-and-acceptance.md) |
| `REQ-DEC-026` | `requirements/08-acceptance/validation-success.md` | [Возможности и приёмка](06-capabilities-and-acceptance.md) |
| `REQ-DEC-027` | `requirements/09-traceability/traceability.md` | [Трассировка](08-traceability.md) |
| `REQ-DEC-030` | `requirements/07-scenarios/business-scenarios.md` | [Пользователи, сценарии и интерфейс](04-user-flows-and-ui.md) |
| `REQ-DEC-031` | `requirements/02-system/business-rules.md` | [Предметная модель, состояния и бизнес-правила](03-domain-model-and-rules.md) |
| `REQ-DEC-032` | `requirements/05-integrations/integrations.md` | [Данные, интеграции и системная обработка](05-data-and-integrations.md) |
| `REQ-DEC-033` | `requirements/02-system/system-requirements.md` | [Возможности и приёмка](06-capabilities-and-acceptance.md) |
| `REQ-DEC-034` | `requirements/01-base/goals-and-scope.md` | [Продукт, цели и границы](01-product-scope.md) |
| `REQ-DEC-035` | `requirements/02-system/entities-and-data.md` | [Предметная модель, состояния и бизнес-правила](03-domain-model-and-rules.md) |
| `REQ-DEC-036` | `requirements/02-system/business-rules.md` | [Предметная модель, состояния и бизнес-правила](03-domain-model-and-rules.md) |
| `REQ-DEC-037` | `requirements/02-system/system-requirements.md` | [Возможности и приёмка](06-capabilities-and-acceptance.md) |
| `REQ-DEC-038` | `requirements/02-system/states-and-errors.md` | [Предметная модель, состояния и бизнес-правила](03-domain-model-and-rules.md) |
| `REQ-DEC-039` | `requirements/05-integrations/data-requirements.md` | [Данные, интеграции и системная обработка](05-data-and-integrations.md) |
| `REQ-DEC-040` | `requirements/06-system-scenarios/system-scenarios.md` | [Данные, интеграции и системная обработка](05-data-and-integrations.md) |
| `REQ-DEC-041` | `requirements/07-scenarios/business-scenarios.md` | [Пользователи, сценарии и интерфейс](04-user-flows-and-ui.md) |
| `REQ-DEC-042` | `requirements/07-scenarios/user-journeys.md` | [Пользователи, сценарии и интерфейс](04-user-flows-and-ui.md) |
| `REQ-DEC-043` | `requirements/08-acceptance/acceptance-criteria.md` | [Возможности и приёмка](06-capabilities-and-acceptance.md) |
| `REQ-DEC-044` | `requirements/08-acceptance/validation-success.md` | [Возможности и приёмка](06-capabilities-and-acceptance.md) |
| `REQ-DEC-045` | `requirements/09-traceability/traceability.md` | [Трассировка](08-traceability.md) |
| `REQ-DEC-046` | `requirements/02-system/business-rules.md` | [Предметная модель, состояния и бизнес-правила](03-domain-model-and-rules.md) |
| `REQ-DEC-047` | `requirements/02-system/business-rules.md` | [Предметная модель, состояния и бизнес-правила](03-domain-model-and-rules.md) |
| `REQ-DEC-048` | `requirements/02-system/business-rules.md` | [Предметная модель, состояния и бизнес-правила](03-domain-model-and-rules.md) |
| `REQ-DEC-049` | `requirements/02-system/business-rules.md` | [Предметная модель, состояния и бизнес-правила](03-domain-model-and-rules.md) |
| `REQ-DEC-051` | `requirements/02-system/system-requirements.md` | [Возможности и приёмка](06-capabilities-and-acceptance.md) |
| `REQ-DEC-052` | `requirements/01-base/sales-objects.md` | [Продукт, цели и границы](01-product-scope.md) |
| `REQ-DEC-053` | `requirements/02-system/business-rules.md` | [Предметная модель, состояния и бизнес-правила](03-domain-model-and-rules.md) |
| `REQ-DEC-054` | `requirements/02-system/business-rules.md` | [Предметная модель, состояния и бизнес-правила](03-domain-model-and-rules.md) |
| `REQ-DEC-055` | `requirements/02-system/business-rules.md` | [Предметная модель, состояния и бизнес-правила](03-domain-model-and-rules.md) |
| `REQ-DEC-056` | `requirements/02-system/business-rules.md` | [Предметная модель, состояния и бизнес-правила](03-domain-model-and-rules.md) |
| `REQ-DEC-057` | `requirements/02-system/business-rules.md` | [Предметная модель, состояния и бизнес-правила](03-domain-model-and-rules.md) |
| `REQ-DEC-058` | `requirements/02-system/business-rules.md` | [Предметная модель, состояния и бизнес-правила](03-domain-model-and-rules.md) |
| `REQ-DEC-059` | `requirements/02-system/business-rules.md` | [Предметная модель, состояния и бизнес-правила](03-domain-model-and-rules.md) |
| `REQ-DEC-060` | `requirements/02-system/business-rules.md` | [Предметная модель, состояния и бизнес-правила](03-domain-model-and-rules.md) |
| `REQ-DEC-061` | `requirements/02-system/business-rules.md` | [Предметная модель, состояния и бизнес-правила](03-domain-model-and-rules.md) |
| `REQ-DEC-062` | `requirements/02-system/business-rules.md` | [Предметная модель, состояния и бизнес-правила](03-domain-model-and-rules.md) |
| `REQ-DEC-063` | `requirements/05-integrations/data-requirements.md` | [Данные, интеграции и системная обработка](05-data-and-integrations.md) |
| `REQ-DEC-064` | `requirements/05-integrations/data-requirements.md` | [Данные, интеграции и системная обработка](05-data-and-integrations.md) |
| `REQ-DEC-065` | `requirements/02-system/business-rules.md` | [Предметная модель, состояния и бизнес-правила](03-domain-model-and-rules.md) |
| `REQ-DEC-066` | `requirements/02-system/business-rules.md` | [Предметная модель, состояния и бизнес-правила](03-domain-model-and-rules.md) |
| `REQ-DEC-067` | `requirements/02-system/business-rules.md` | [Предметная модель, состояния и бизнес-правила](03-domain-model-and-rules.md) |
| `REQ-DEC-068` | `requirements/05-integrations/data-requirements.md` | [Данные, интеграции и системная обработка](05-data-and-integrations.md) |
| `REQ-DEC-069` | `requirements/05-integrations/data-requirements.md` | [Данные, интеграции и системная обработка](05-data-and-integrations.md) |
| `REQ-DEC-070` | `requirements/05-integrations/data-requirements.md` | [Данные, интеграции и системная обработка](05-data-and-integrations.md) |
| `REQ-DEC-071` | `requirements/04-quality/localization-requirements.md` | [Нефункциональные и эксплуатационные требования](07-nonfunctional-and-operations.md) |
| `REQ-DEC-072` | `requirements/04-quality/localization-requirements.md` | [Нефункциональные и эксплуатационные требования](07-nonfunctional-and-operations.md) |
| `REQ-DEC-073` | `requirements/02-system/roles-and-permissions.md` | [Пользователи, сценарии и интерфейс](04-user-flows-and-ui.md) |
| `REQ-DEC-074` | `requirements/02-system/roles-and-permissions.md` | [Пользователи, сценарии и интерфейс](04-user-flows-and-ui.md) |
| `REQ-DEC-075` | `requirements/05-integrations/integrations.md` | [Данные, интеграции и системная обработка](05-data-and-integrations.md) |
| `REQ-DEC-076` | `requirements/02-system/roles-and-permissions.md` | [Пользователи, сценарии и интерфейс](04-user-flows-and-ui.md) |
| `REQ-DEC-077` | `requirements/02-system/system-requirements.md` | [Возможности и приёмка](06-capabilities-and-acceptance.md) |
| `REQ-DEC-078` | `requirements/03-architecture/component-source.md` | [Пользователи, сценарии и интерфейс](04-user-flows-and-ui.md) |
| `REQ-DEC-079` | `requirements/02-system/system-requirements.md` | [Возможности и приёмка](06-capabilities-and-acceptance.md) |
| `REQ-DEC-080` | `requirements/02-system/system-requirements.md` | [Возможности и приёмка](06-capabilities-and-acceptance.md) |
| `REQ-DEC-081` | `requirements/03-architecture/technical-constraints.md` | [Системный контекст и границы реализации](02-system-context-and-boundaries.md) |
| `REQ-DEC-082` | `requirements/02-system/business-rules.md` | [Предметная модель, состояния и бизнес-правила](03-domain-model-and-rules.md) |
| `REQ-DEC-083` | `requirements/02-system/states-and-errors.md` | [Предметная модель, состояния и бизнес-правила](03-domain-model-and-rules.md) |
| `REQ-DEC-084` | `requirements/02-system/roles-and-permissions.md` | [Пользователи, сценарии и интерфейс](04-user-flows-and-ui.md) |
| `REQ-DEC-085` | `requirements/02-system/business-rules.md` | [Предметная модель, состояния и бизнес-правила](03-domain-model-and-rules.md) |
| `REQ-DEC-086` | `requirements/08-acceptance/acceptance-criteria.md` | [Возможности и приёмка](06-capabilities-and-acceptance.md) |
| `REQ-DEC-087` | `requirements/03-architecture/technical-constraints.md` | [Системный контекст и границы реализации](02-system-context-and-boundaries.md) |
| `REQ-DEC-088` | `requirements/05-integrations/data-requirements.md` | [Данные, интеграции и системная обработка](05-data-and-integrations.md) |
| `REQ-DEC-089` | `requirements/01-base/goals-and-scope.md` | [Продукт, цели и границы](01-product-scope.md) |
| `REQ-DEC-090` | `requirements/02-system/system-requirements.md` | [Возможности и приёмка](06-capabilities-and-acceptance.md) |
| `REQ-DEC-091` | `requirements/02-system/entities-and-data.md` | [Предметная модель, состояния и бизнес-правила](03-domain-model-and-rules.md) |
| `REQ-DEC-092` | `requirements/02-system/business-rules.md` | [Предметная модель, состояния и бизнес-правила](03-domain-model-and-rules.md) |
| `REQ-DEC-093` | `requirements/02-system/business-rules.md` | [Предметная модель, состояния и бизнес-правила](03-domain-model-and-rules.md) |
| `REQ-DEC-094` | `requirements/02-system/business-rules.md` | [Предметная модель, состояния и бизнес-правила](03-domain-model-and-rules.md) |
| `REQ-DEC-095` | `requirements/02-system/business-rules.md` | [Предметная модель, состояния и бизнес-правила](03-domain-model-and-rules.md) |
| `REQ-DEC-096` | `requirements/05-integrations/integrations.md` | [Данные, интеграции и системная обработка](05-data-and-integrations.md) |
| `REQ-DEC-097` | `requirements/05-integrations/data-requirements.md` | [Данные, интеграции и системная обработка](05-data-and-integrations.md) |
| `REQ-DEC-098` | `requirements/05-integrations/data-requirements.md` | [Данные, интеграции и системная обработка](05-data-and-integrations.md) |
| `REQ-DEC-099` | `requirements/05-integrations/integrations.md` | [Данные, интеграции и системная обработка](05-data-and-integrations.md) |
| `REQ-DEC-100` | `requirements/06-system-scenarios/operational-scenarios.md` | [Нефункциональные и эксплуатационные требования](07-nonfunctional-and-operations.md) |
| `REQ-DEC-101` | `requirements/01-base/goals-and-scope.md` | [Продукт, цели и границы](01-product-scope.md) |
| `REQ-DEC-102` | `requirements/02-system/system-requirements.md` | [Возможности и приёмка](06-capabilities-and-acceptance.md) |
| `REQ-DEC-103` | `requirements/01-base/sales-objects.md` | [Продукт, цели и границы](01-product-scope.md) |
| `REQ-DEC-104` | `requirements/02-system/roles-and-permissions.md` | [Пользователи, сценарии и интерфейс](04-user-flows-and-ui.md) |
| `REQ-DEC-105` | `requirements/02-system/states-and-errors.md` | [Предметная модель, состояния и бизнес-правила](03-domain-model-and-rules.md) |
| `REQ-DEC-106` | `requirements/05-integrations/data-requirements.md` | [Данные, интеграции и системная обработка](05-data-and-integrations.md) |
| `REQ-DEC-107` | `requirements/05-integrations/integrations.md` | [Данные, интеграции и системная обработка](05-data-and-integrations.md) |
| `REQ-DEC-108` | `requirements/08-acceptance/acceptance-criteria.md` | [Возможности и приёмка](06-capabilities-and-acceptance.md) |
| `REQ-DEC-109` | `requirements/03-architecture/technical-constraints.md` | [Системный контекст и границы реализации](02-system-context-and-boundaries.md) |
| `REQ-DEC-110` | `requirements/01-base/goals-and-scope.md` | [Продукт, цели и границы](01-product-scope.md) |
| `REQ-DEC-111` | `requirements/02-system/system-requirements.md` | [Возможности и приёмка](06-capabilities-and-acceptance.md) |
| `REQ-DEC-112` | `requirements/02-system/roles-and-permissions.md` | [Пользователи, сценарии и интерфейс](04-user-flows-and-ui.md) |
| `REQ-DEC-113` | `requirements/03-architecture/technical-constraints.md` | [Системный контекст и границы реализации](02-system-context-and-boundaries.md) |
| `REQ-DEC-114` | `requirements/03-architecture/component-source.md` | [Пользователи, сценарии и интерфейс](04-user-flows-and-ui.md) |
| `REQ-DEC-115` | `requirements/05-integrations/integrations.md` | [Данные, интеграции и системная обработка](05-data-and-integrations.md) |
| `REQ-DEC-116` | `requirements/06-system-scenarios/operational-scenarios.md` | [Нефункциональные и эксплуатационные требования](07-nonfunctional-and-operations.md) |
| `REQ-DEC-117` | `requirements/08-acceptance/acceptance-criteria.md` | [Возможности и приёмка](06-capabilities-and-acceptance.md) |
| `REQ-DEC-118` | `requirements/02-system/roles-and-permissions.md` | [Пользователи, сценарии и интерфейс](04-user-flows-and-ui.md) |
| `REQ-DEC-119` | `requirements/02-system/system-requirements.md` | [Возможности и приёмка](06-capabilities-and-acceptance.md) |
| `REQ-DEC-120` | `requirements/05-integrations/integrations.md` | [Данные, интеграции и системная обработка](05-data-and-integrations.md) |
| `REQ-DEC-121` | `requirements/06-system-scenarios/operational-scenarios.md` | [Нефункциональные и эксплуатационные требования](07-nonfunctional-and-operations.md) |
| `REQ-DEC-122` | `requirements/08-acceptance/acceptance-criteria.md` | [Возможности и приёмка](06-capabilities-and-acceptance.md) |
| `REQ-DEC-123` | `requirements/02-system/states-and-errors.md` | [Предметная модель, состояния и бизнес-правила](03-domain-model-and-rules.md) |
| `REQ-DEC-124` | `requirements/08-acceptance/acceptance-criteria.md` | [Возможности и приёмка](06-capabilities-and-acceptance.md) |
| `REQ-DEC-125` | `requirements/02-system/business-rules.md` | [Предметная модель, состояния и бизнес-правила](03-domain-model-and-rules.md) |
| `REQ-DEC-126` | `requirements/02-system/states-and-errors.md` | [Предметная модель, состояния и бизнес-правила](03-domain-model-and-rules.md) |
| `REQ-DEC-127` | `requirements/05-integrations/integrations.md` | [Данные, интеграции и системная обработка](05-data-and-integrations.md) |
| `REQ-DEC-128` | `requirements/08-acceptance/acceptance-criteria.md` | [Возможности и приёмка](06-capabilities-and-acceptance.md) |
| `REQ-DEC-129` | `requirements/01-base/goals-and-scope.md` | [Продукт, цели и границы](01-product-scope.md) |
| `REQ-DEC-130` | `requirements/02-system/system-requirements.md` | [Возможности и приёмка](06-capabilities-and-acceptance.md) |
| `REQ-DEC-131` | `requirements/02-system/business-rules.md` | [Предметная модель, состояния и бизнес-правила](03-domain-model-and-rules.md) |
| `REQ-DEC-132` | `requirements/05-integrations/data-requirements.md` | [Данные, интеграции и системная обработка](05-data-and-integrations.md) |
| `REQ-DEC-133` | `requirements/07-scenarios/business-scenarios.md` | [Пользователи, сценарии и интерфейс](04-user-flows-and-ui.md) |
| `REQ-DEC-134` | `requirements/07-scenarios/user-journeys.md` | [Пользователи, сценарии и интерфейс](04-user-flows-and-ui.md) |
| `REQ-DEC-135` | `requirements/08-acceptance/acceptance-criteria.md` | [Возможности и приёмка](06-capabilities-and-acceptance.md) |
| `REQ-DEC-136` | `requirements/02-system/entities-and-data.md` | [Предметная модель, состояния и бизнес-правила](03-domain-model-and-rules.md) |
| `REQ-DEC-137` | `requirements/02-system/states-and-errors.md` | [Предметная модель, состояния и бизнес-правила](03-domain-model-and-rules.md) |
| `REQ-DEC-138` | `requirements/04-quality/quality-requirements.md` | [Нефункциональные и эксплуатационные требования](07-nonfunctional-and-operations.md) |
| `REQ-DEC-139` | `requirements/06-system-scenarios/exception-scenarios.md` | [Нефункциональные и эксплуатационные требования](07-nonfunctional-and-operations.md) |
| `REQ-DEC-140` | `requirements/08-acceptance/validation-success.md` | [Возможности и приёмка](06-capabilities-and-acceptance.md) |
| `REQ-DEC-142` | `requirements/09-traceability/traceability.md` | [Трассировка](08-traceability.md) |
| `REQ-DEC-143` | `requirements/01-base/product-context.md` | [Продукт, цели и границы](01-product-scope.md) |
| `REQ-DEC-144` | `requirements/02-system/roles-and-permissions.md` | [Пользователи, сценарии и интерфейс](04-user-flows-and-ui.md) |
| `REQ-DEC-145` | `requirements/04-quality/localization-requirements.md` | [Нефункциональные и эксплуатационные требования](07-nonfunctional-and-operations.md) |
| `REQ-DEC-146` | `requirements/06-system-scenarios/system-scenarios.md` | [Данные, интеграции и системная обработка](05-data-and-integrations.md) |
| `REQ-DEC-147` | `requirements/02-system/system-requirements.md` | [Возможности и приёмка](06-capabilities-and-acceptance.md) |
| `REQ-DEC-148` | `requirements/03-architecture/technical-constraints.md` | [Системный контекст и границы реализации](02-system-context-and-boundaries.md) |
| `REQ-DEC-149` | `requirements/05-integrations/integrations.md` | [Данные, интеграции и системная обработка](05-data-and-integrations.md) |
| `REQ-DEC-150` | `requirements/06-system-scenarios/operational-scenarios.md` | [Нефункциональные и эксплуатационные требования](07-nonfunctional-and-operations.md) |
| `REQ-DEC-151` | `requirements/08-acceptance/acceptance-criteria.md` | [Возможности и приёмка](06-capabilities-and-acceptance.md) |
| `REQ-DEC-152` | `requirements/01-base/sales-objects.md` | [Продукт, цели и границы](01-product-scope.md) |
| `REQ-DEC-153` | `requirements/02-system/system-requirements.md` | [Возможности и приёмка](06-capabilities-and-acceptance.md) |
| `REQ-DEC-154` | `requirements/03-architecture/technical-constraints.md` | [Системный контекст и границы реализации](02-system-context-and-boundaries.md) |
| `REQ-DEC-155` | `requirements/05-integrations/integrations.md` | [Данные, интеграции и системная обработка](05-data-and-integrations.md) |
| `REQ-DEC-156` | `requirements/05-integrations/data-requirements.md` | [Данные, интеграции и системная обработка](05-data-and-integrations.md) |
| `REQ-DEC-157` | `requirements/08-acceptance/acceptance-criteria.md` | [Возможности и приёмка](06-capabilities-and-acceptance.md) |
| `REQ-DEC-158` | `requirements/01-base/sales-objects.md` | [Продукт, цели и границы](01-product-scope.md) |
| `REQ-DEC-159` | `requirements/02-system/business-rules.md` | [Предметная модель, состояния и бизнес-правила](03-domain-model-and-rules.md) |
| `REQ-DEC-160` | `requirements/02-system/roles-and-permissions.md` | [Пользователи, сценарии и интерфейс](04-user-flows-and-ui.md) |
| `REQ-DEC-161` | `requirements/02-system/system-requirements.md` | [Возможности и приёмка](06-capabilities-and-acceptance.md) |
| `REQ-DEC-162` | `requirements/05-integrations/data-requirements.md` | [Данные, интеграции и системная обработка](05-data-and-integrations.md) |
| `REQ-DEC-163` | `requirements/08-acceptance/acceptance-criteria.md` | [Возможности и приёмка](06-capabilities-and-acceptance.md) |
| `REQ-DEC-164` | `requirements/05-integrations/integrations.md` | [Данные, интеграции и системная обработка](05-data-and-integrations.md) |
| `REQ-DEC-165` | `requirements/03-architecture/technical-constraints.md` | [Системный контекст и границы реализации](02-system-context-and-boundaries.md) |
| `REQ-DEC-166` | `requirements/05-integrations/data-requirements.md` | [Данные, интеграции и системная обработка](05-data-and-integrations.md) |
| `REQ-DEC-167` | `requirements/06-system-scenarios/system-scenarios.md` | [Данные, интеграции и системная обработка](05-data-and-integrations.md) |
| `REQ-DEC-168` | `requirements/08-acceptance/acceptance-criteria.md` | [Возможности и приёмка](06-capabilities-and-acceptance.md) |
| `REQ-DEC-169` | `requirements/02-system/system-requirements.md` | [Возможности и приёмка](06-capabilities-and-acceptance.md) |
| `REQ-DEC-170` | `requirements/02-system/roles-and-permissions.md` | [Пользователи, сценарии и интерфейс](04-user-flows-and-ui.md) |
| `REQ-DEC-171` | `requirements/02-system/states-and-errors.md` | [Предметная модель, состояния и бизнес-правила](03-domain-model-and-rules.md) |
| `REQ-DEC-172` | `requirements/04-quality/localization-requirements.md` | [Нефункциональные и эксплуатационные требования](07-nonfunctional-and-operations.md) |
| `REQ-DEC-173` | `requirements/05-integrations/integrations.md` | [Данные, интеграции и системная обработка](05-data-and-integrations.md) |
| `REQ-DEC-174` | `requirements/05-integrations/data-requirements.md` | [Данные, интеграции и системная обработка](05-data-and-integrations.md) |
| `REQ-DEC-175` | `requirements/07-scenarios/business-scenarios.md` | [Пользователи, сценарии и интерфейс](04-user-flows-and-ui.md) |
| `REQ-DEC-176` | `requirements/07-scenarios/user-journeys.md` | [Пользователи, сценарии и интерфейс](04-user-flows-and-ui.md) |
| `REQ-DEC-177` | `requirements/08-acceptance/acceptance-criteria.md` | [Возможности и приёмка](06-capabilities-and-acceptance.md) |
| `REQ-DEC-178` | `requirements/09-traceability/traceability.md` | [Трассировка](08-traceability.md) |
| `REQ-DEC-179` | `requirements/03-architecture/hardware-requirements.md` | [Системный контекст и границы реализации](02-system-context-and-boundaries.md) |
| `REQ-DEC-180` | `requirements/03-architecture/technical-constraints.md` | [Системный контекст и границы реализации](02-system-context-and-boundaries.md) |
| `REQ-DEC-181` | `requirements/04-quality/quality-requirements.md` | [Нефункциональные и эксплуатационные требования](07-nonfunctional-and-operations.md) |
| `REQ-DEC-182` | `requirements/06-system-scenarios/system-scenarios.md` | [Данные, интеграции и системная обработка](05-data-and-integrations.md) |
| `REQ-DEC-183` | `requirements/08-acceptance/acceptance-criteria.md` | [Возможности и приёмка](06-capabilities-and-acceptance.md) |
| `REQ-DEC-184` | `requirements/09-traceability/traceability.md` | [Трассировка](08-traceability.md) |
| `REQ-DEC-185` | `requirements/09-traceability/traceability.md` | [Трассировка](08-traceability.md) |
| `REQ-DEC-186` | `requirements/02-system/roles-and-permissions.md` | [Пользователи, сценарии и интерфейс](04-user-flows-and-ui.md) |
| `REQ-DEC-188` | `requirements/09-traceability/traceability.md` | [Трассировка](08-traceability.md) |
| `REQ-DEC-189` | `requirements/05-integrations/data-requirements.md` | [Данные, интеграции и системная обработка](05-data-and-integrations.md) |
| `REQ-DEC-190` | `requirements/05-integrations/data-requirements.md` | [Данные, интеграции и системная обработка](05-data-and-integrations.md) |
| `REQ-DEC-191` | `requirements/05-integrations/data-requirements.md` | [Данные, интеграции и системная обработка](05-data-and-integrations.md) |
| `REQ-DEC-192` | `requirements/05-integrations/integrations.md` | [Данные, интеграции и системная обработка](05-data-and-integrations.md) |
| `REQ-DEC-193` | `requirements/01-base/goals-and-scope.md` | [Продукт, цели и границы](01-product-scope.md) |
| `REQ-FR-001` | `requirements/02-system/system-requirements.md` | [Возможности и приёмка](06-capabilities-and-acceptance.md) |
| `REQ-FR-002` | `requirements/02-system/system-requirements.md` | [Возможности и приёмка](06-capabilities-and-acceptance.md) |
| `REQ-FR-003` | `requirements/02-system/system-requirements.md` | [Возможности и приёмка](06-capabilities-and-acceptance.md) |
| `REQ-FR-004` | `requirements/02-system/system-requirements.md` | [Возможности и приёмка](06-capabilities-and-acceptance.md) |
| `REQ-FR-005` | `requirements/02-system/system-requirements.md` | [Возможности и приёмка](06-capabilities-and-acceptance.md) |
| `REQ-FR-006` | `requirements/02-system/system-requirements.md` | [Возможности и приёмка](06-capabilities-and-acceptance.md) |
| `REQ-FR-007` | `requirements/02-system/system-requirements.md` | [Возможности и приёмка](06-capabilities-and-acceptance.md) |
| `REQ-FR-008` | `requirements/02-system/system-requirements.md` | [Возможности и приёмка](06-capabilities-and-acceptance.md) |
| `REQ-GS-001` | `requirements/01-base/goals-and-scope.md` | [Продукт, цели и границы](01-product-scope.md) |
| `REQ-GS-002` | `requirements/01-base/goals-and-scope.md` | [Продукт, цели и границы](01-product-scope.md) |
| `REQ-GS-003` | `requirements/01-base/goals-and-scope.md` | [Продукт, цели и границы](01-product-scope.md) |
| `REQ-GS-004` | `requirements/01-base/goals-and-scope.md` | [Продукт, цели и границы](01-product-scope.md) |
| `REQ-INT-001` | `requirements/05-integrations/integrations.md` | [Данные, интеграции и системная обработка](05-data-and-integrations.md) |
| `REQ-INT-002` | `requirements/05-integrations/integrations.md` | [Данные, интеграции и системная обработка](05-data-and-integrations.md) |
| `REQ-INT-003` | `requirements/05-integrations/integrations.md` | [Данные, интеграции и системная обработка](05-data-and-integrations.md) |
| `REQ-MKT-001` | `requirements/01-base/market-assessment.md` | [Продукт, цели и границы](01-product-scope.md) |
| `REQ-MKT-002` | `requirements/01-base/market-assessment.md` | [Продукт, цели и границы](01-product-scope.md) |
| `REQ-MKT-003` | `requirements/01-base/market-assessment.md` | [Продукт, цели и границы](01-product-scope.md) |
| `REQ-MKT-004` | `requirements/01-base/market-assessment.md` | [Продукт, цели и границы](01-product-scope.md) |
| `REQ-MKT-005` | `requirements/01-base/market-assessment.md` | [Продукт, цели и границы](01-product-scope.md) |
| `REQ-MKT-006` | `requirements/01-base/market-assessment.md` | [Продукт, цели и границы](01-product-scope.md) |
| `REQ-NFR-001` | `requirements/04-quality/quality-requirements.md` | [Нефункциональные и эксплуатационные требования](07-nonfunctional-and-operations.md) |
| `REQ-NFR-002` | `requirements/04-quality/quality-requirements.md` | [Нефункциональные и эксплуатационные требования](07-nonfunctional-and-operations.md) |
| `REQ-NFR-003` | `requirements/04-quality/quality-requirements.md` | [Нефункциональные и эксплуатационные требования](07-nonfunctional-and-operations.md) |
| `REQ-PC-001` | `requirements/01-base/product-context.md` | [Продукт, цели и границы](01-product-scope.md) |
| `REQ-PC-002` | `requirements/01-base/product-context.md` | [Продукт, цели и границы](01-product-scope.md) |
| `REQ-SO-001` | `requirements/01-base/sales-objects.md` | [Продукт, цели и границы](01-product-scope.md) |
