#!/usr/bin/env python3
"""Prepare verified, user-visible links for a registered phase review."""
from __future__ import annotations

import argparse
from pathlib import Path

from common import PHASE_SEQUENCE, latest_review_for_phase, load, now, project_path, run_tool, save, sha256


def main() -> int:
    parser = argparse.ArgumentParser(
        description='Проверить отчёт этапа и подготовить точные ссылки для показа Product Manager'
    )
    parser.add_argument('--phase', required=True, choices=PHASE_SEQUENCE)
    parser.add_argument('--review-id', help='По умолчанию используется последняя активная ревизия этапа')
    args = parser.parse_args()

    reviews = load('product/phase-reviews.json')
    state = load('project-state.json')
    review = latest_review_for_phase(reviews.get('reviews', []), args.phase, args.review_id)
    if not review or review.get('status') != 'READY_FOR_REVIEW':
        raise SystemExit('Отчёт этапа не найден или не готов к показу')
    if state.get('currentPhase') != args.phase:
        raise SystemExit(f'Текущий этап {state.get("currentPhase")} не совпадает с --phase {args.phase}')
    current_review_id = state.get('phaseReview', {}).get('reviewId')
    if current_review_id and current_review_id != review.get('reviewId'):
        raise SystemExit('Выбранный отчёт не является текущим отчётом этапа')

    md = project_path(review.get('markdownReport', ''), must_exist=True, allowed_root='reports')
    pdf = project_path(review.get('pdfReport', ''), must_exist=True, allowed_root='reports')
    if sha256(md) != review.get('markdownSha256') or sha256(pdf) != review.get('pdfSha256'):
        raise SystemExit('Отчёт изменён после регистрации; зарегистрируйте новую ревизию')
    if pdf.suffix.lower() != '.pdf' or pdf.stat().st_size == 0:
        raise SystemExit('PDF-отчёт отсутствует или пуст')

    review['presentationPreparedAt'] = now()
    review['presentationMarkdownReport'] = review['markdownReport']
    review['presentationPdfReport'] = review['pdfReport']
    review['presentationMarkdownSha256'] = review['markdownSha256']
    review['presentationPdfSha256'] = review['pdfSha256']
    save('product/phase-reviews.json', reviews)
    run_tool('sync_workspace.py')

    md_rel = Path(review['markdownReport']).as_posix()
    pdf_rel = Path(review['pdfReport']).as_posix()
    print('PHASE_REVIEW_PRESENTATION_BEGIN')
    print(f'Контрольный отчёт этапа **{review["phase"]}** готов к проверке:')
    print()
    print(f'- [Открыть PDF-отчёт]({pdf_rel})')
    print(f'- [Открыть Markdown-отчёт]({md_rel})')
    print()
    print('Точные локальные пути:')
    print(f'PDF: {pdf.resolve()}')
    print(f'Markdown: {md.resolve()}')
    print()
    print('После фактического показа выполните mark_phase_review_shown.py с тем же --phase.')
    print('PHASE_REVIEW_PRESENTATION_END')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
