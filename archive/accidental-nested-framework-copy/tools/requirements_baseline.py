from __future__ import annotations

import hashlib
import json

from common import ROOT, directory_sha256, load, sha256


def _referenced_evidence_sha256() -> str:
    index = load('product/requirements-index.json')
    referenced = {
        ref
        for requirement in index.get('requirements', [])
        for ref in requirement.get('evidenceRefs', [])
    }
    evidence = load('product/evidence-register.json').get('evidence', [])
    subset = sorted(
        (item for item in evidence if item.get('id') in referenced),
        key=lambda item: item.get('id', ''),
    )
    payload = json.dumps(subset, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode('utf-8')
    return hashlib.sha256(payload).hexdigest()


def current_snapshot() -> dict:
    files = []
    for path in sorted((ROOT / 'requirements').rglob('*.md')):
        if path.name == 'README.md':
            continue
        files.append({'path': path.relative_to(ROOT).as_posix(), 'sha256': sha256(path)})
    return {
        'requirementsSha256': directory_sha256(ROOT / 'requirements', ignored_names={'README.md'}),
        'indexSha256': sha256(ROOT / 'product/requirements-index.json'),
        'referencedEvidenceSha256': _referenced_evidence_sha256(),
        'files': files,
    }


def current_baseline() -> dict | None:
    doc = load('product/requirements-baseline.json')
    baseline_id = doc.get('currentBaselineId')
    return next((item for item in doc.get('baselines', []) if item.get('baselineId') == baseline_id), None)


def verify_baseline() -> tuple[bool, list[str]]:
    doc = load('product/requirements-baseline.json')
    baseline = current_baseline()
    if doc.get('status') != 'COMMITTED' or not baseline:
        return False, ['Требования не зафиксированы через tools/commit_requirements.py']
    actual = current_snapshot()
    errors = []
    for field in ('requirementsSha256', 'indexSha256', 'referencedEvidenceSha256'):
        if actual.get(field) != baseline.get(field):
            errors.append(f'Базовая линия требований устарела: изменилось поле {field}')
    expected_files = {item['path']: item['sha256'] for item in baseline.get('files', [])}
    actual_files = {item['path']: item['sha256'] for item in actual.get('files', [])}
    if expected_files != actual_files:
        errors.append('Состав или содержимое файлов requirements/ изменилось после фиксации')
    return not errors, errors
