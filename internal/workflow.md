# Workflow Product Compiler

1. `SOURCE_SETUP` — выбрать режим источников и сохранить проверяемые snapshots.
2. `INTAKE` — извлечь факты, кандидаты UI и пробелы без объявления полноты.
3. `PRODUCT_DEFINITION` — закрыть каждую область до `VISUAL_PROTOTYPE`, зафиксировать baseline требований и получить отдельное утверждение отчёта.
4. `VISUAL_PROTOTYPE` — создать локальный кликабельный прототип с манифестом, данными и runbook.
5. `VISUAL_VALIDATION` — проверить сценарии с Product Manager/клиентом.
6. `WORKING_PROTOTYPE` — сначала подтвердить стек и источник данных, затем создать запускаемую реализацию и инструкцию.
7. `WORKING_VALIDATION` — проверить запуск, данные, health-check и ключевые сценарии.
8. `HANDOFF_READY` — собрать полный комплект для разработки.

Каждый переход: Markdown в `reports/` -> `finalize_phase_review.py` -> показ -> остановка -> отдельное подтверждение -> `approve_phase_review.py`.
