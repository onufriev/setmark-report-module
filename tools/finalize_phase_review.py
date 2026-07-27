#!/usr/bin/env python3
from __future__ import annotations

import argparse
import os

from common import PHASE_SEQUENCE, ROOT, project_path, run_tool


def main() -> int:
    parser = argparse.ArgumentParser(description='Атомарно создать PDF и зарегистрировать контрольный отчёт этапа')
    parser.add_argument('--phase', required=True, choices=PHASE_SEQUENCE)
    parser.add_argument('--markdown', required=True, help='Markdown-файл внутри reports/')
    args = parser.parse_args()

    markdown = project_path(args.markdown, must_exist=True, allowed_root='reports')
    if markdown.suffix.lower() != '.md':
        raise SystemExit('Ожидается Markdown-файл внутри reports/')
    pdf = markdown.with_suffix('.pdf')
    pdf_rel = pdf.relative_to(ROOT).as_posix()

    run_tool('generate_stage_report.py', [
        '--phase', args.phase,
        '--markdown', args.markdown,
        '--pdf', pdf_rel,
    ])
    env = {'PC_PHASE_REVIEW_FINALIZER': '1'}
    try:
        register = run_tool('register_phase_review.py', [
            '--phase', args.phase,
            '--markdown', args.markdown,
            '--pdf', pdf_rel,
        ], env=env)
    except SystemExit:
        pdf.unlink(missing_ok=True)
        raise
    print(register.stdout.strip())
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
