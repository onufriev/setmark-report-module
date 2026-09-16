#!/usr/bin/env python3
from __future__ import annotations

import argparse
from common import ROOT, artifact_sha256, load, next_id, now, project_path, save, run_tool


def run_required_validator(phase: str) -> list[str]:
    mapping = {
        'VISUAL_PROTOTYPE': 'validate_visual_prototype.py',
        'WORKING_PROTOTYPE': 'validate_working_prototype.py',
    }
    tool = mapping.get(phase)
    if not tool:
        return []
    result = run_tool(tool, ['--phase', phase], allowed_returncodes={0, 1})
    if result.returncode:
        raise SystemExit(f'Артефакт не прошёл обязательную проверку {tool}\n{result.stdout}{result.stderr}')
    return [line.strip() for line in result.stdout.splitlines() if line.strip()]


def main():
    parser = argparse.ArgumentParser(description='Зарегистрировать доказательство существования и проверки артефакта')
    parser.add_argument('--phase', required=True)
    parser.add_argument('--path', required=True, dest='artifact_path')
    parser.add_argument('--type', required=True, dest='artifact_type')
    parser.add_argument('--check', action='append', required=True, dest='checks')
    parser.add_argument('--result', choices=['PASSED', 'FAILED'], required=True)
    parser.add_argument('--command', default='')
    parser.add_argument('--notes', default='')
    parser.add_argument('--runbook')
    parser.add_argument('--data-source-ref')
    args = parser.parse_args()

    path = project_path(args.artifact_path, must_exist=True)
    automated_checks = []
    if args.result == 'PASSED':
        automated_checks = run_required_validator(args.phase)
    if args.phase == 'VISUAL_PROTOTYPE':
        if path != (ROOT / 'visual-prototype').resolve():
            raise SystemExit('VISUAL_PROTOTYPE должен регистрировать каталог visual-prototype/')
        if args.runbook != 'visual-prototype/PROTOTYPE-RUNBOOK.md':
            raise SystemExit('Для VISUAL_PROTOTYPE обязателен --runbook visual-prototype/PROTOTYPE-RUNBOOK.md')
    if args.phase == 'WORKING_PROTOTYPE':
        if path != (ROOT / 'prototype').resolve():
            raise SystemExit('WORKING_PROTOTYPE должен регистрировать каталог prototype/')
        if args.runbook != 'prototype/PROTOTYPE-RUNBOOK.md':
            raise SystemExit('Для WORKING_PROTOTYPE обязателен --runbook prototype/PROTOTYPE-RUNBOOK.md')
        if args.data_source_ref != 'product/prototype-data-source.json':
            raise SystemExit('Для WORKING_PROTOTYPE обязателен --data-source-ref product/prototype-data-source.json')

    doc = load('product/artifact-evidence.json')
    items = doc.setdefault('evidence', [])
    item = {
        'id': next_id('ART-EV', items),
        'phase': args.phase,
        'artifactPath': path.relative_to(ROOT).as_posix(),
        'artifactType': args.artifact_type,
        'verifiedAt': now(),
        'checks': args.checks + automated_checks,
        'result': args.result,
        'sha256': artifact_sha256(path),
        'verificationCommand': args.command,
        'runbookPath': args.runbook,
        'dataSourceRef': args.data_source_ref,
        'notes': args.notes,
        'recordedBy': 'register_artifact_evidence.py',
    }
    items.append(item)
    save('product/artifact-evidence.json', doc)
    run_tool('sync_workspace.py')
    print(item['id'])


if __name__ == '__main__':
    main()
