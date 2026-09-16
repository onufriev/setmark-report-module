#!/usr/bin/env python3
from __future__ import annotations

import argparse

from common import PHASE_SEQUENCE, latest_review_for_phase, load, now, project_path, run_tool, save, sha256


def main() -> int:
    parser = argparse.ArgumentParser(description='Отметить фактический показ отчёта Product Manager')
    parser.add_argument('--phase', required=True, choices=PHASE_SEQUENCE)
    parser.add_argument('--review-id', help='По умолчанию используется последняя активная ревизия этапа')
    args = parser.parse_args()
    doc = load('product/phase-reviews.json')
    review = latest_review_for_phase(doc.get('reviews', []), args.phase, args.review_id)
    if not review or review.get('status') != 'READY_FOR_REVIEW':
        raise SystemExit('Отчёт этапа не готов к показу')
    markdown = project_path(review.get('markdownReport', ''), must_exist=True, allowed_root='reports')
    pdf = project_path(review.get('pdfReport', ''), must_exist=True, allowed_root='reports')
    if sha256(markdown) != review.get('markdownSha256') or sha256(pdf) != review.get('pdfSha256'):
        raise SystemExit('Отчёт изменён после регистрации; зарегистрируйте новую ревизию')
    if not review.get('presentationPreparedAt'):
        raise SystemExit('Сначала запустите present_phase_review.py с тем же --phase')
    if review.get('presentationMarkdownSha256') != review.get('markdownSha256') or review.get('presentationPdfSha256') != review.get('pdfSha256'):
        raise SystemExit('Подготовленная презентация относится к другой версии отчёта')
    review['shownToProductManagerAt'] = now()
    save('product/phase-reviews.json', doc)
    run_tool('sync_workspace.py')
    print(f'OK: {review["reviewId"]} показан Product Manager')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
