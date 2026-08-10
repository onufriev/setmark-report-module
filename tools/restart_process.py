#!/usr/bin/env python3
from __future__ import annotations

import argparse
from pathlib import Path

from common import PHASE_SEQUENCE, ROOT, load, mark_phase_reviews_stale, now, run_tool, save

CHANGE_START_PHASE = {
    'SOURCE_MATERIALS': 'SOURCE_SETUP',
    'REQUIREMENTS': 'PRODUCT_DEFINITION',
    'UI_SOURCE': 'VISUAL_PROTOTYPE',
    'VISUAL_PROTOTYPE': 'VISUAL_PROTOTYPE',
    'TECH_STACK': 'WORKING_PROTOTYPE',
    'DATA_SOURCE': 'WORKING_PROTOTYPE',
    'WORKING_PROTOTYPE': 'WORKING_PROTOTYPE',
    'HANDOFF': 'HANDOFF_READY',
}

CHANGE_ALIASES = {
    'requirements': 'REQUIREMENTS',
    'requirement': 'REQUIREMENTS',
    'ui': 'UI_SOURCE',
    'ui_source': 'UI_SOURCE',
    'components': 'UI_SOURCE',
    'component_library': 'UI_SOURCE',
    'storybook': 'UI_SOURCE',
    'figma': 'UI_SOURCE',
    'visual': 'VISUAL_PROTOTYPE',
    'visual_prototype': 'VISUAL_PROTOTYPE',
    'stack': 'TECH_STACK',
    'technology_stack': 'TECH_STACK',
    'data': 'DATA_SOURCE',
    'data_source': 'DATA_SOURCE',
    'prototype': 'WORKING_PROTOTYPE',
    'working_prototype': 'WORKING_PROTOTYPE',
    'handoff': 'HANDOFF',
    'source': 'SOURCE_MATERIALS',
    'sources': 'SOURCE_MATERIALS',
}


def normalize_change_type(value: str) -> str:
    raw = value.strip()
    upper = raw.upper()
    if upper in CHANGE_START_PHASE:
        return upper
    alias = CHANGE_ALIASES.get(raw.lower())
    if alias:
        return alias
    raise SystemExit('Неизвестный тип изменения: ' + value)


def affected_phases(start_phase: str) -> list[str]:
    index = PHASE_SEQUENCE.index(start_phase)
    return PHASE_SEQUENCE[index:]


def stale_reviews(phases: list[str], reason: str) -> list[str]:
    changed: list[str] = []
    for phase in phases:
        changed.extend(mark_phase_reviews_stale(phase, reason))
    return changed


def invalidate_requirements_baseline(reason: str) -> None:
    doc = load('product/requirements-baseline.json')
    if doc.get('status') == 'COMMITTED':
        doc['status'] = 'STALE'
        doc['staleAt'] = now()
        doc['staleReason'] = reason
        save('product/requirements-baseline.json', doc)


def write_report(change_type: str, start_phase: str, phases: list[str], stale_ids: list[str], reason: str) -> str:
    reports = ROOT / 'reports'
    reports.mkdir(parents=True, exist_ok=True)
    stamp = now().replace(':', '').replace('-', '').replace('+00:00', 'Z').replace('.', '')
    rel = f'reports/restart-impact-{stamp}.md'
    path = ROOT / rel
    phase_lines = '\n'.join(f'- {phase}' for phase in phases)
    stale_lines = '\n'.join(f'- {review_id}' for review_id in stale_ids) or '- Нет ранее утверждённых ревью'
    path.write_text(
        '# Анализ влияния изменений\n\n'
        f'**Тип изменения:** {change_type}\n\n'
        f'**Основание:** {reason}\n\n'
        f'**Продолжить с этапа:** {start_phase}\n\n'
        '## Затронутые этапы\n\n'
        f'{phase_lines}\n\n'
        '## Ревью, признанные устаревшими\n\n'
        f'{stale_lines}\n\n'
        '## Правило продолжения\n\n'
        'Не пересоздавать неизменённые исходники и артефакты. Обновить первый затронутый этап, '
        'после чего последовательно пересобрать только реально зависимые этапы. Новые отчёты создавать '
        'как следующие ревизии, не перезаписывая предыдущие.\n',
        encoding='utf-8',
    )
    return rel


def main() -> int:
    parser = argparse.ArgumentParser(description='Продолжить Product Compiler после изменений без запуска с начала')
    parser.add_argument('--change-type', required=True, help='REQUIREMENTS, UI_SOURCE, VISUAL_PROTOTYPE, TECH_STACK, DATA_SOURCE, WORKING_PROTOTYPE, HANDOFF или SOURCE_MATERIALS')
    parser.add_argument('--reason', required=True, help='Точный текст сообщения Product Manager или краткое основание')
    args = parser.parse_args()

    change_type = normalize_change_type(args.change_type)
    start_phase = CHANGE_START_PHASE[change_type]
    phases = affected_phases(start_phase)
    reason = f'{change_type}: {args.reason}'

    if change_type == 'REQUIREMENTS':
        invalidate_requirements_baseline(reason)

    stale_ids = stale_reviews(phases, reason)
    report = write_report(change_type, start_phase, phases, stale_ids, args.reason)
    sync = run_tool('sync_workspace.py', ['--strict-json'], allowed_returncodes={0, 1})

    print('OK: процесс повторно открыт')
    print(f'Тип изменения: {change_type}')
    print(f'Продолжить с этапа: {start_phase}')
    print('Затронутые этапы: ' + ' -> '.join(phases))
    print('Устаревшие ревью: ' + (', '.join(stale_ids) if stale_ids else 'нет'))
    print(f'Отчёт влияния: {report}')
    print('Следующее действие ИИ: проанализировать фактические изменения, обновить первый затронутый артефакт и продолжить штатный процесс.')
    if sync.returncode:
        print(sync.stdout, end='')
        print(sync.stderr, end='')
    return sync.returncode


if __name__ == '__main__':
    raise SystemExit(main())
