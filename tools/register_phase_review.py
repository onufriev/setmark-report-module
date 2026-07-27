#!/usr/bin/env python3
from __future__ import annotations

import argparse
import os

from common import PHASE_SEQUENCE, artifact_sha256, load, now, project_path, run_tool, save, sha256
from requirements_baseline import verify_baseline


def main() -> int:
    parser = argparse.ArgumentParser(description='Внутренняя регистрация отчёта этапа')
    parser.add_argument('--phase', required=True, choices=PHASE_SEQUENCE)
    parser.add_argument('--markdown', required=True)
    parser.add_argument('--pdf', required=True)
    args = parser.parse_args()
    if os.environ.get('PC_PHASE_REVIEW_FINALIZER') != '1':
        raise SystemExit('Прямая регистрация отчёта запрещена. Используйте tools/finalize_phase_review.py')

    run_tool('sync_workspace.py')
    state = load('project-state.json')
    if state.get('currentPhase') != args.phase:
        raise SystemExit(f'Этап отчёта {args.phase} не совпадает с текущим этапом {state.get("currentPhase")}')
    if state.get('status') in {'READY_FOR_REVIEW', 'WAITING_FOR_APPROVAL'}:
        raise SystemExit('Текущий отчёт уже ожидает показа или решения')

    validation = run_tool('validate_workspace.py', [], allowed_returncodes={0, 1})
    if validation.returncode:
        raise SystemExit('Нельзя зарегистрировать отчёт:\n' + validation.stdout + validation.stderr)

    manifest = load('sources/source-manifest.json')
    if args.phase == 'SOURCE_SETUP':
        if manifest.get('setupStatus') != 'COMPLETED':
            raise SystemExit('SOURCE_SETUP нельзя завершить: настройка источников не завершена')
        if manifest.get('inputMode') != 'CONVERSATION_ONLY' and not manifest.get('entries'):
            raise SystemExit('SOURCE_SETUP нельзя завершить: нет зарегистрированных источников')

    markdown = project_path(args.markdown, must_exist=True, allowed_root='reports')
    pdf = project_path(args.pdf, must_exist=True, allowed_root='reports')
    if markdown.suffix.lower() != '.md':
        raise SystemExit('Markdown-отчёт должен иметь расширение .md')
    if pdf.suffix.lower() != '.pdf' or not pdf.is_file() or pdf.stat().st_size == 0:
        raise SystemExit('PDF-отчёт отсутствует или пуст')
    markdown_text = markdown.read_text(encoding='utf-8-sig', errors='replace')
    if ('NEEDS_INPUT' in markdown_text or 'NEED_INPUTS' in markdown_text) and args.phase == 'PRODUCT_DEFINITION':
        raise SystemExit('PRODUCT_DEFINITION-отчёт не может объявлять готовность при наличии NEEDS_INPUT')

    completeness = load('product/completeness-report.json')
    if args.phase == 'PRODUCT_DEFINITION':
        visual_gate = completeness.get('gates', {}).get('VISUAL_PROTOTYPE', {})
        if visual_gate.get('status') != 'PASSED' or visual_gate.get('blockingQuestions'):
            raise SystemExit('PRODUCT_DEFINITION не завершён: остались неподтверждённые требования')
        baseline_ok, baseline_errors = verify_baseline()
        if not baseline_ok:
            raise SystemExit('Требования не зафиксированы перед отчётом:\n' + '\n'.join(baseline_errors))

    artifact_evidence = load('product/artifact-evidence.json').get('evidence', [])
    required_artifact = {
        'VISUAL_PROTOTYPE': ('VISUAL_PROTOTYPE', 'visual-prototype'),
        'WORKING_PROTOTYPE': ('WORKING_PROTOTYPE', 'prototype'),
        'HANDOFF_READY': ('HANDOFF_READY', 'handoff'),
    }.get(args.phase)
    if required_artifact:
        artifact_phase, artifact_path = required_artifact
        artifact = project_path(artifact_path, must_exist=True)
        current_digest = artifact_sha256(artifact)
        passed = [
            item for item in artifact_evidence
            if item.get('phase') == artifact_phase
            and item.get('artifactPath') == artifact_path
            and item.get('result') == 'PASSED'
            and item.get('sha256') == current_digest
        ]
        if not passed:
            raise SystemExit(
                f'Нет актуального успешного доказательства артефакта {artifact_path} для этапа {args.phase}. '
                'Повторно запустите обязательную проверку и register_artifact_evidence.py.'
            )

    if args.phase == 'WORKING_PROTOTYPE':
        working_gate = completeness.get('gates', {}).get('WORKING_PROTOTYPE', {})
        if working_gate.get('status') != 'PASSED':
            raise SystemExit('WORKING_PROTOTYPE нельзя завершить: не закрыты источник данных, стек или требования')

    reviews_doc = load('product/phase-reviews.json')
    existing = [item for item in reviews_doc.get('reviews', []) if item.get('phase') == args.phase]
    revision = max([int(item.get('revision') or 0) for item in existing] or [0]) + 1
    review_id = f'{args.phase}-R{revision}'
    phase_index = PHASE_SEQUENCE.index(args.phase)
    next_phase = PHASE_SEQUENCE[phase_index + 1] if phase_index + 1 < len(PHASE_SEQUENCE) else None
    for item in existing:
        if item.get('status') == 'READY_FOR_REVIEW':
            item['status'] = 'SUPERSEDED'
    entry = {
        'reviewId': review_id,
        'phase': args.phase,
        'revision': revision,
        'status': 'READY_FOR_REVIEW',
        'preparedAt': now(),
        'registeredBy': 'finalize_phase_review.py',
        'shownToProductManagerAt': None,
        'markdownReport': args.markdown,
        'markdownSha256': sha256(markdown),
        'pdfReport': args.pdf,
        'pdfSha256': sha256(pdf),
        'nextPhase': next_phase,
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
    reviews_doc.setdefault('reviews', []).append(entry)
    save('product/phase-reviews.json', reviews_doc)
    run_tool('sync_workspace.py')
    print(review_id)
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
