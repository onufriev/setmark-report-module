#!/usr/bin/env python3
from __future__ import annotations

import argparse
import base64
import json
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

from common import ROOT, sha256


def run(
    workspace: Path,
    script: str,
    *args: str,
    binary: bool = False,
    extra_env: dict[str, str] | None = None,
):
    env = os.environ.copy()
    env['PYTHONUTF8'] = '1'
    if extra_env:
        env.update(extra_env)
    command = [sys.executable, str(workspace / 'tools' / script), *args]
    if binary:
        return subprocess.run(
            command,
            cwd=workspace,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            env=env,
            check=False,
        )
    return subprocess.run(
        command,
        cwd=workspace,
        capture_output=True,
        encoding='utf-8',
        errors='replace',
        env=env,
        check=False,
    )


def output(result) -> str:
    stdout = result.stdout.decode('utf-8', 'replace') if isinstance(result.stdout, bytes) else result.stdout
    stderr = result.stderr.decode('utf-8', 'replace') if isinstance(result.stderr, bytes) else result.stderr
    return (stdout or '') + (stderr or '')


def assert_ok(result, label: str) -> None:
    if result.returncode:
        raise AssertionError(f'{label} failed ({result.returncode})\n{output(result)}')


def assert_failed(result, label: str, expected: str | None = None) -> None:
    if result.returncode == 0:
        raise AssertionError(f'{label} unexpectedly succeeded\n{output(result)}')
    if expected and expected not in output(result):
        raise AssertionError(f'{label} did not mention {expected!r}\n{output(result)}')


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding='utf-8-sig'))


def make_workspace(temp: str, name: str) -> Path:
    workspace = Path(temp) / name
    shutil.copytree(ROOT, workspace, ignore=shutil.ignore_patterns('__pycache__', '*.pyc', '.git'))
    return workspace


def core_suite() -> None:
    with tempfile.TemporaryDirectory(prefix='product-compiler-4.4-core-') as temp:
        workspace = make_workspace(temp, 'workspace with spaces')
        assert_ok(run(workspace, 'validate_workspace.py'), 'initial validation')

        legacy = {'schemaVersion': '4.0', 'evidenceEntries': []}
        (workspace / 'product/evidence-register.json').write_text(
            json.dumps(legacy, ensure_ascii=False), encoding='utf-8'
        )
        assert_ok(run(workspace, 'normalize_workspace_json.py'), 'legacy JSON migration')
        migrated = read_json(workspace / 'product/evidence-register.json')
        assert 'evidence' in migrated and 'evidenceEntries' not in migrated
        assert migrated['schemaVersion'] == '4.4'

        snapshot = workspace / 'sources/snapshots/тестовый источник.md'
        snapshot.parent.mkdir(parents=True, exist_ok=True)
        snapshot.write_text(
            '# Источник\n\nЦель продукта — показать проверяемый основной сценарий.\n',
            encoding='utf-8',
        )
        assert_ok(run(
            workspace,
            'register_source_snapshot.py',
            '--source-id', 'SRC-001',
            '--name', 'Тестовый источник',
            '--type', 'FILE',
            '--origin', 'file://local-test',
            '--snapshot', 'sources/snapshots/тестовый источник.md',
        ), 'source registration')

        evidence_doc = read_json(workspace / 'product/evidence-register.json')
        (workspace / 'product/evidence-register.json').write_text(
            json.dumps(
                {'schemaVersion': '4.1', 'evidenceEntries': evidence_doc.get('evidence', [])},
                ensure_ascii=False,
            ),
            encoding='utf-8',
        )
        assert_ok(run(
            workspace,
            'register_source_evidence.py',
            '--source-id', 'SRC-001',
            '--domain-id', 'productContext',
            '--snapshot', 'sources/snapshots/тестовый источник.md',
            '--location', 'Цель продукта',
            '--excerpt', 'Цель продукта — показать проверяемый основной сценарий.',
        ), 'source evidence registration over legacy JSON')
        evidence_doc = read_json(workspace / 'product/evidence-register.json')
        assert evidence_doc.get('evidence', [])[0].get('id') == 'SRC-EV-001'
        assert 'evidenceEntries' not in evidence_doc

        requirement_file = workspace / 'requirements/01-base/product-context.md'
        requirement_file.write_text(
            '# Продуктовый контекст\n\n'
            '## Подтверждено источником: Контекст продукта\n\n'
            '**ID требования**: REQ-PC-001\n'
            '**Область:** productContext\n'
            '**Статус:** Подтверждено источником\n'
            '**Основание:** SRC-EV-001\n',
            encoding='utf-8',
        )
        assert_ok(run(workspace, 'sync_workspace.py', '--verbose'), 'historical requirement parser and sync')
        index = read_json(workspace / 'product/requirements-index.json')
        requirement_ids = [item.get('id') for item in index.get('requirements', [])]
        assert 'REQ-PC-001' in requirement_ids
        assert None not in requirement_ids
        assert len(index.get('requirements', [])) >= 1

        assert_ok(run(
            workspace,
            'record_pm_decision.py',
            '--question-id', 'Q-002',
            '--domain-id', 'goalsScope',
            '--decision', 'CONFIRMED',
            '--message', 'Первая версия должна проверить основной пользовательский сценарий.',
        ), 'PM decision registration')
        evidence_doc = read_json(workspace / 'product/evidence-register.json')
        assert any(item.get('id') == 'PM-DEC-001' for item in evidence_doc.get('evidence', []))
        questions = read_json(workspace / 'product/open-questions.json')
        assert not any(item.get('id') == 'Q-002' for item in questions.get('questions', []))
        assert any('PM-DEC-001' in f.read_text(encoding='utf-8') for f in (workspace / 'requirements').rglob('*.md'))
        state = read_json(workspace / 'project-state.json')
        assert state.get('sourceSetup', {}).get('status') == 'COMPLETED'

        assert_ok(run(workspace, 'validate_json_documents.py'), 'final JSON validation')
    print('OK: self-test 4.4 core')


def report_generation_suite() -> None:
    with tempfile.TemporaryDirectory(prefix='product-compiler-4.4-report-generation-') as temp:
        workspace = make_workspace(temp, 'workspace report generation')
        assert_ok(
            run(workspace, 'set_source_mode.py', '--mode', 'CONVERSATION_ONLY'),
            'source mode setup',
        )
        for script in ('generate_stage_report.py', 'register_phase_review.py'):
            script_text = (workspace / 'tools' / script).read_text(encoding='utf-8')
            assert "add_argument('--phase'" in script_text, f'{script} must expose --phase'
            assert "add_argument('--markdown'" in script_text, f'{script} must expose --markdown'
            assert "add_argument('--pdf'" in script_text, f'{script} must expose --pdf'

        report = workspace / 'reports/source-setup.md'
        report.write_text(
            '# Настройка источников\n\n'
            '## Результат\n\n'
            '- Работа только из диалога подтверждена.\n\n'
            'Продолжить: перейти к intake.\n',
            encoding='utf-8',
        )
        assert_ok(run(
            workspace,
            'finalize_phase_review.py',
            '--phase', 'SOURCE_SETUP',
            '--markdown', 'reports/source-setup.md',
        ), 'finalize SOURCE_SETUP report')
        assert (workspace / 'reports/source-setup.pdf').is_file()
        reviews = read_json(workspace / 'product/phase-reviews.json').get('reviews', [])
        assert reviews and reviews[-1].get('phase') == 'SOURCE_SETUP'
        assert reviews[-1].get('registeredBy') == 'finalize_phase_review.py'
    print('OK: self-test 4.4 report-generation')


def review_lifecycle_suite() -> None:
    with tempfile.TemporaryDirectory(prefix='product-compiler-4.4-review-lifecycle-') as temp:
        workspace = make_workspace(temp, 'workspace review lifecycle')
        manifest_path = workspace / 'sources/source-manifest.json'
        manifest = read_json(manifest_path)
        manifest.update({
            'schemaVersion': '4.4',
            'setupStatus': 'COMPLETED',
            'inputMode': 'CONVERSATION_ONLY',
            'entries': [],
            'completedAt': '2026-01-01T00:00:00+00:00',
        })
        manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

        markdown = workspace / 'reports/source-setup.md'
        pdf = workspace / 'reports/source-setup.pdf'
        markdown.write_text('# Настройка источников\n\nГотово.\n', encoding='utf-8')
        pdf.write_bytes(b'%PDF-1.4\n% Product Compiler self-test\n%%EOF\n')
        review = {
            'reviewId': 'SOURCE_SETUP-R1',
            'phase': 'SOURCE_SETUP',
            'revision': 1,
            'status': 'READY_FOR_REVIEW',
            'preparedAt': '2026-01-01T00:00:00+00:00',
            'registeredBy': 'finalize_phase_review.py',
            'shownToProductManagerAt': None,
            'markdownReport': 'reports/source-setup.md',
            'markdownSha256': sha256(markdown),
            'pdfReport': 'reports/source-setup.pdf',
            'pdfSha256': sha256(pdf),
            'nextPhase': 'INTAKE',
            'approvedAt': None,
            'approvedBy': None,
            'decisionText': None,
            'exactUserMessage': None,
            'presentationPreparedAt': None,
            'presentationMarkdownReport': None,
            'presentationPdfReport': None,
            'presentationMarkdownSha256': None,
            'presentationPdfSha256': None,
        }
        (workspace / 'product/phase-reviews.json').write_text(
            json.dumps({'schemaVersion': '4.4', 'reviews': [review]}, ensure_ascii=False, indent=2) + '\n',
            encoding='utf-8',
        )
        assert_ok(run(workspace, 'sync_workspace.py'), 'prepare review state')

        for script in ('present_phase_review.py', 'mark_phase_review_shown.py', 'approve_phase_review.py'):
            script_text = (workspace / 'tools' / script).read_text(encoding='utf-8')
            assert "add_argument('--phase'" in script_text, f'{script} must expose --phase'

        cp_env = {'PYTHONIOENCODING': 'cp1251', 'PYTHONUTF8': '0'}
        presented = run(
            workspace,
            'present_phase_review.py',
            '--phase', 'SOURCE_SETUP',
            binary=True,
            extra_env=cp_env,
        )
        assert_ok(presented, 'present report under Windows code-page simulation')
        presented.stdout.decode('utf-8')
        presented.stderr.decode('utf-8')

        shown = run(
            workspace,
            'mark_phase_review_shown.py',
            '--phase', 'SOURCE_SETUP',
            binary=True,
            extra_env=cp_env,
        )
        assert_ok(shown, 'mark shown under Windows code-page simulation')
        shown.stdout.decode('utf-8')
        shown.stderr.decode('utf-8')

        approved = run(
            workspace,
            'approve_phase_review.py',
            '--phase', 'SOURCE_SETUP',
            '--decision', 'APPROVED',
            '--message', 'Источники приняты, продолжаем.',
            binary=True,
            extra_env=cp_env,
        )
        assert_ok(approved, 'approve report under Windows code-page simulation')
        approved.stdout.decode('utf-8')
        approved.stderr.decode('utf-8')
        state = read_json(workspace / 'project-state.json')
        assert state.get('currentPhase') == 'INTAKE'
    print('OK: self-test 4.4 review-lifecycle')

def prototype_suite() -> None:
    with tempfile.TemporaryDirectory(prefix='product-compiler-4.4-prototype-') as temp:
        workspace = make_workspace(temp, 'workspace prototype')
        source = workspace / '_clickable app with spaces'
        source.mkdir()
        (source / 'styles.css').write_text('body{font-family:Arial}', encoding='utf-8')
        (source / 'app.js').write_text("document.documentElement.dataset.prototype='clickable';", encoding='utf-8')
        transitions = [
            ('dashboard', 'outsiders'),
            ('outsiders', 'store-card'),
            ('store-card', 'downtime-reason'),
            ('downtime-reason', 'create-task'),
            ('create-task', 'create-task'),
        ]
        sections = ''.join(
            f'<section id="{current}"><a href="index.html#{target}">next</a></section>'
            for current, target in transitions
        )
        (source / 'index.html').write_text(
            '<!doctype html><html><head><link rel="stylesheet" href="styles.css"></head>'
            '<body>' + sections + '<script src="app.js"></script></body></html>',
            encoding='utf-8',
        )
        ui = read_json(workspace / 'product/ui-source.json')
        ui.update({
            'strategy': 'STORYBOOK',
            'sourceMode': 'STORYBOOK',
            'applicationMode': 'GENERATED_PROTOTYPE',
            'status': 'SELECTED',
            'location': 'https://example.test/storybook',
        })
        (workspace / 'product/ui-source.json').write_text(json.dumps(ui, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        assert_ok(run(
            workspace,
            'materialize_visual_prototype.py',
            '--phase', 'VISUAL_PROTOTYPE',
            '--mode', 'DIRECTORY',
            '--application-mode', 'GENERATED_PROTOTYPE',
            '--source', str(source),
            '--entrypoint', 'index.html',
            '--source-reference', 'generated from selected Storybook',
        ), 'visual prototype materialization')
        assert (workspace / 'visual-prototype/app/index.html').is_file()
        runbook = (workspace / 'visual-prototype/PROTOTYPE-RUNBOOK.md').read_text(encoding='utf-8')
        assert 'python -m http.server' in runbook and 'STORYBOOK' in runbook and 'GENERATED_PROTOTYPE' in runbook
        manifest = read_json(workspace / 'visual-prototype/prototype-manifest.json')
        assert manifest.get('uiSourceMode') == 'STORYBOOK'
        assert manifest.get('applicationMode') == 'GENERATED_PROTOTYPE'
        assert manifest.get('smokeTest', {}).get('status') == 'PASSED'
        artifact_evidence = read_json(workspace / 'product/artifact-evidence.json').get('evidence', [])
        assert artifact_evidence and artifact_evidence[-1].get('phase') == 'VISUAL_PROTOTYPE'
        assert_ok(run(workspace, 'validate_visual_prototype.py', '--phase', 'VISUAL_PROTOTYPE'), 'visual validation')
        assert_ok(run(workspace, 'sync_workspace.py', '--strict-json'), 'strict synchronization')
        assert_ok(run(workspace, 'validate_json_documents.py'), 'JSON validation')
        assert_ok(run(workspace, 'validate_workspace.py'), 'workspace validation')
    print('OK: self-test 4.4 prototype')


def main() -> int:
    parser = argparse.ArgumentParser(description='Изолированная самопроверка Product Compiler 4.4')
    parser.add_argument('--suite', choices=['core', 'report-generation', 'review-lifecycle', 'prototype', 'all'], default='core')
    args = parser.parse_args()
    suites = {
        'core': core_suite,
        'report-generation': report_generation_suite,
        'review-lifecycle': review_lifecycle_suite,
        'prototype': prototype_suite,
    }
    selected = list(suites) if args.suite == 'all' else [args.suite]
    for name in selected:
        suites[name]()
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
