# Правила анализа инцидентов

Согласованные подробные правила:

- [INC-001 — Повторные продажи у одного продавца более или равно 30 минут](inc-001-repeat-sales-same-seller-v0.1.md)
- [INC-002 — Реализован товар с истекшим сроком годности](inc-002-expired-product-sale-v0.1.md)
- [INC-003 — Продажа товара с КИ, незарегистрированными в ГИС](inc-003-unregistered-code-v0.1.md) — согласовано Product Manager (`PM-DEC-048`)
- [INC-004 — Реализация от участника, незарегистрированного в ГИС МТ](inc-004-participant-not-registered-v0.1.md) — согласовано Product Manager (`PM-DEC-050`)
- [INC-005 — Реализация от участника, незарегистрированного в товарной группе](inc-005-participant-product-group-v0.1.md) — согласовано Product Manager (`PM-DEC-049`)
- [INC-006 — Продажа товара без проверки КМ](inc-006-sale-without-code-check-v0.1.md)
- [INC-007 — Продажа товара, заблокированного по решению ОГВ](inc-007-invalid-permit-status-v0.1.md) — включает некорректный статус РД и другие блокировки с `isBlocked=true`; согласовано Product Manager (`PM-DEC-047`, `PM-DEC-064`)
- [INC-008 — Повторная реализация товаров, не подлежащих возврату](inc-008-non-returnable-resale-v0.1.md) — согласовано Product Manager (`PM-DEC-047`)
- INC-009 — служебный тип неизвестного отклонения; обрабатывается правилом `DM-002`
- [INC-010 — Продажа с нарушением МЦ / МРЦ / ЕМЦ](inc-010-price-deviation-v0.1.md) — согласовано Product Manager (`PM-DEC-057`)
- [INC-011 — Реализация товаров с истекшим сроком годности в объёмных показателях](inc-011-expired-volume-v0.1.md) — согласовано Product Manager (`PM-DEC-058`)
- [INC-012 — Оборот участником в ненадлежащем статусе](inc-012-participant-improper-status-v0.1.md) — согласовано Product Manager (`PM-DEC-059`)
- [INC-013 — Реализация ветеринарных препаратов при отсутствии действующей лицензии](inc-013-missing-veterinary-license-v0.1.md) — согласовано Product Manager (`PM-DEC-060`)
- [INC-014 — Отсутствует документ, подтверждающий соответствие ТР ТС / ЕАЭС](inc-014-missing-compliance-document-v0.1.md) — согласовано Product Manager (`PM-DEC-061`)
- [INC-015 — Продажа товара с некорректным кодом проверки](inc-015-invalid-verification-code-v0.1.md) — согласовано Product Manager (`PM-DEC-062`)
- [INC-016 — Превышение зарегистрированного объёма при частичной реализации](inc-016-partial-volume-exceeded-v0.1.md) — согласовано Product Manager (`PM-DEC-063`)

Связанные схемы:

- [INC-003 — алгоритм разбора](../diagrams/inc-003-analysis-flow-v0.4.png)
- [INC-004 — алгоритм разбора](../diagrams/inc-004-analysis-flow-v0.2.png)
- [INC-005 — алгоритм разбора](../diagrams/inc-005-analysis-flow-v0.1.png)
- [INC-006 — алгоритм разбора](../diagrams/inc-006-analysis-flow-v0.1.svg)
- [INC-007 — алгоритм разбора](../diagrams/inc-007-analysis-flow-v0.6.svg)
- [INC-008 — алгоритм разбора](../diagrams/inc-008-analysis-flow-v0.4.png)
- [INC-010 — алгоритм разбора](../diagrams/inc-010-analysis-flow-v0.1.png)
- [INC-011 — алгоритм разбора](../diagrams/inc-011-analysis-flow-v0.1.png)
- [INC-015 — алгоритм разбора](../diagrams/inc-015-analysis-flow-v0.1.png)
- [INC-016 — алгоритм разбора](../diagrams/inc-016-analysis-flow-v0.2.png)
- [Единая ветка доказанного отсутствия результата онлайн ЧЗ и ЛМ ЧЗ](../diagrams/proven-no-response-settings-flow-v0.1.svg) — применяется в INC-007, INC-010, INC-011, INC-015 и INC-016

При расхождении предварительных формулировок каталога и подробного согласованного правила приоритет имеет подробное правило.
