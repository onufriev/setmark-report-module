# Правила анализа инцидентов

Согласованные подробные правила:

- [INC-001 — Повторные продажи у одного продавца более или равно 30 минут](inc-001-repeat-sales-same-seller-v0.1.md)
- [INC-002 — Реализован товар с истекшим сроком годности](inc-002-expired-product-sale-v0.1.md)
- [INC-003 — Продажа товара с КИ, незарегистрированными в ГИС](inc-003-unregistered-code-v0.1.md) — согласовано Product Manager (`PM-DEC-048`)
- [INC-004 — Реализация от участника, незарегистрированного в ГИС МТ](inc-004-participant-not-registered-v0.1.md) — согласовано Product Manager (`PM-DEC-050`)
- [INC-005 — Реализация от участника, незарегистрированного в товарной группе](inc-005-participant-product-group-v0.1.md) — согласовано Product Manager (`PM-DEC-049`)
- [INC-006 — Продажа товара без проверки КМ](inc-006-sale-without-code-check-v0.1.md)
- [INC-007 — Продажа товара с некорректным статусом РД](inc-007-invalid-permit-status-v0.1.md) — согласовано Product Manager (`PM-DEC-047`)
- [INC-008 — Повторная реализация товаров, не подлежащих возврату](inc-008-non-returnable-resale-v0.1.md) — согласовано Product Manager (`PM-DEC-047`)
- INC-009 — служебный тип неизвестного отклонения; обрабатывается правилом `DM-002`

Связанные схемы:

- [INC-003 — алгоритм разбора](../diagrams/inc-003-analysis-flow-v0.4.png)
- [INC-004 — алгоритм разбора](../diagrams/inc-004-analysis-flow-v0.2.png)
- [INC-005 — алгоритм разбора](../diagrams/inc-005-analysis-flow-v0.1.png)
- [INC-006 — алгоритм разбора](../diagrams/inc-006-analysis-flow-v0.1.svg)
- [INC-007 — алгоритм разбора](../diagrams/inc-007-analysis-flow-v0.4.png)
- [INC-008 — алгоритм разбора](../diagrams/inc-008-analysis-flow-v0.4.png)

При расхождении предварительных формулировок каталога и подробного согласованного правила приоритет имеет подробное правило.
