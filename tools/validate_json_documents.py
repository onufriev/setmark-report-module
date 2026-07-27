#!/usr/bin/env python3
from __future__ import annotations

from common import ROOT, load
from json_contracts import SCHEMA_FILES, validate_document

errors = []
for rel in sorted(SCHEMA_FILES):
    if not (ROOT / rel).exists():
        errors.append(f'{rel}: файл отсутствует')
        continue
    try:
        document = load(rel)
    except SystemExit as exc:
        errors.append(str(exc))
        continue
    errors.extend(f'{rel}: {error}' for error in validate_document(rel, document, strict_items=True))

if errors:
    for error in errors:
        print('ERROR:', error)
    raise SystemExit(1)
print(f'OK: {len(SCHEMA_FILES)} JSON-документов соответствуют схемам 4.4')
