#!/usr/bin/env python3
from __future__ import annotations

import argparse

from common import load, run_tool


def main() -> int:
    parser = argparse.ArgumentParser(
        description='Атомарно синхронизировать JSON, индекс требований, полноту и project-state'
    )
    parser.add_argument('--strict-json', action='store_true')
    parser.add_argument('--verbose', action='store_true')
    args = parser.parse_args()

    # Migration is intentionally permissive before derived documents are rebuilt.
    normalize = run_tool('normalize_workspace_json.py', [], allowed_returncodes={0, 1})
    if normalize.returncode:
        print(normalize.stdout, end='')
        print(normalize.stderr, end='')
        return normalize.returncode

    index_args = ['--verbose'] if args.verbose else []
    index = run_tool('build_requirements_index.py', index_args, allowed_returncodes={0, 1})
    index_failed = index.returncode != 0

    # A second normalization pass enriches legacy evidence with domains discovered
    # by the freshly rebuilt requirements index.
    normalize = run_tool('normalize_workspace_json.py', [], allowed_returncodes={0, 1})
    if normalize.returncode:
        print(normalize.stdout, end='')
        print(normalize.stderr, end='')
        return normalize.returncode

    completeness = run_tool('evaluate_completeness.py', [], allowed_returncodes={0, 2})
    state = run_tool('sync_project_state.py')
    if args.strict_json:
        strict_validation = run_tool('validate_json_documents.py', [], allowed_returncodes={0, 1})
        if strict_validation.returncode:
            print(strict_validation.stdout, end='')
            print(strict_validation.stderr, end='')
            return strict_validation.returncode

    index_doc = load('product/requirements-index.json')
    report = load('product/completeness-report.json')
    project_state = load('project-state.json')
    print(
        'OK: sync; '
        f"requirements={len(index_doc.get('requirements', []))}; "
        f"NEEDS_INPUT={len(index_doc.get('needsInput', []))}; "
        f"visualGate={report.get('gates', {}).get('VISUAL_PROTOTYPE', {}).get('status')}; "
        f"phase={project_state.get('currentPhase')}"
    )
    if args.verbose or index_failed:
        print(index.stdout, end='')
        print(index.stderr, end='')
    if args.verbose:
        print(completeness.stdout, end='')
        print(state.stdout, end='')
    return 1 if index_failed else 0


if __name__ == '__main__':
    raise SystemExit(main())
