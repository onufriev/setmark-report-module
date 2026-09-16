#!/usr/bin/env python3
from requirements_baseline import verify_baseline

ok, errors = verify_baseline()
if not ok:
    for error in errors:
        print('ERROR:', error)
    raise SystemExit(1)
print('OK: базовая линия требований актуальна')
