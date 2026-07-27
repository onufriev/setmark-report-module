#!/usr/bin/env python3
from __future__ import annotations

import argparse

from common import (
    PHASE_SEQUENCE,
    latest_review_for_phase,
    load,
    now,
    project_path,
    run_tool,
    save,
    sha256,
)


def main() -> int:
    parser = argparse.ArgumentParser(description='Утвердить показанный отчёт этапа')
    parser.add_argument('--phase', required=True, choices=PHASE_SEQUENCE)
    parser.add_argument('--review-id', help='По умолчанию используется последняя активная ревизия этапа')
    parser.add_argument('--decision', required=True)
    parser.add_argument('--message', required=True, help='Точный текст решения Product Manager')
    args = parser.parse_args()
    if not args.decision.strip() or len(args.message.strip()) < 2:
        raise SystemExit('Нужны решение и точный текст ответа Product Manager')

    doc = load('product/phase-reviews.json')
    state = load('project-state.json')
    review = latest_review_for_phase(doc.get('reviews', []), args.phase, args.review_id)
    if not review or review.get('status') != 'READY_FOR_REVIEW':
        raise SystemExit('Утвердить можно только READY_FOR_REVIEW')
    if not review.get('shownToProductManagerAt'):
        raise SystemExit('Отчёт не был показан Product Manager')
    if state.get('currentPhase') != args.phase:
        raise SystemExit(f'Текущий этап {state.get("currentPhase")} не совпадает с --phase {args.phase}')
    markdown = project_path(review.get('markdownReport', ''), must_exist=True, allowed_root='reports')
    pdf = project_path(review.get('pdfReport', ''), must_exist=True, allowed_root='reports')
    if sha256(markdown) != review.get('markdownSha256') or sha256(pdf) != review.get('pdfSha256'):
        raise SystemExit('Отчёт изменён после показа; требуется новая ревизия')

    validation = run_tool('validate_workspace.py', [], allowed_returncodes={0, 1})
    if validation.returncode:
        raise SystemExit('Перед утверждением workspace перестал проходить проверку:\n' + validation.stdout + validation.stderr)
    expected_next = (
        PHASE_SEQUENCE[PHASE_SEQUENCE.index(args.phase) + 1]
        if PHASE_SEQUENCE.index(args.phase) + 1 < len(PHASE_SEQUENCE)
        else None
    )
    if review.get('nextPhase') != expected_next:
        raise SystemExit('Некорректный следующий этап')
    review.update({
        'status': 'APPROVED',
        'approvedAt': now(),
        'approvedBy': 'PRODUCT_MANAGER',
        'decisionText': args.decision,
        'exactUserMessage': args.message,
    })
    save('product/phase-reviews.json', doc)
    run_tool('sync_workspace.py')
    print(f'OK: {review["reviewId"]}; разрешён только {expected_next}')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
