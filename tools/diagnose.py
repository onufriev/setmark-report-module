#!/usr/bin/env python3
from __future__ import annotations

import locale
import platform
import sys
from importlib.metadata import PackageNotFoundError, version

from common import PRODUCT_VERSION, run_tool


def main() -> int:
    print(f'Product Compiler: {PRODUCT_VERSION}')
    print(f'OS: {platform.platform()}')
    print(f'Python: {sys.version.split()[0]} ({sys.executable})')
    print(f'stdout encoding: {getattr(sys.stdout, "encoding", None)}')
    print(f'preferred encoding: {locale.getpreferredencoding(False)}')
    try:
        print(f'jsonschema: {version("jsonschema")}')
    except PackageNotFoundError:
        print('jsonschema: NOT INSTALLED (required for JSON contract validation)')
        return 1
    try:
        import reportlab  # type: ignore
        print(f'reportlab: {getattr(reportlab, "Version", "installed")}')
    except ImportError:
        print('reportlab: NOT INSTALLED (needed for PDF reports)')
    compile_result = run_tool('validate_json_documents.py', [], allowed_returncodes={0, 1})
    print(compile_result.stdout, end='')
    if compile_result.returncode:
        print(compile_result.stderr, end='')
        return 1
    validation = run_tool('validate_workspace.py', [], allowed_returncodes={0, 1})
    print(validation.stdout, end='')
    if validation.returncode:
        print(validation.stderr, end='')
        return 1
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
