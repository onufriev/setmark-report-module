# JSON-схемы Product Compiler

Каждый изменяемый JSON-документ Product Compiler имеет JSON Schema Draft 2020-12 в этой папке.
Исключение — `kilo.jsonc`: это внешняя конфигурация клиента с комментариями, а не реестр Product Compiler.

Соответствие файлов и схем зафиксировано в `tools/json_contracts.py`.

- `common.save()` проверяет схему перед атомарной записью;
- `tools/validate_json_documents.py` проверяет все документы целиком;
- `tools/normalize_workspace_json.py` сначала мигрирует ключи версий 4.0–4.2;
- `tools/sync_workspace.py` после миграции пересчитывает производные JSON.

Для проверки требуется пакет `jsonschema`, указанный в `requirements-tooling.txt`.
