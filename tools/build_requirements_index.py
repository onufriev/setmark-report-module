#!/usr/bin/env python3
from __future__ import annotations

import argparse
import re
from pathlib import Path

from common import ROOT, SCHEMA_VERSION, directory_sha256, load, save

REQ_ROOT = ROOT / 'requirements'
CANONICAL_ID = re.compile(r'^REQ-[A-Z][A-Z0-9]*-[0-9]{3}$')
LEGACY_ID = re.compile(r'^[A-Z][A-Z0-9]*-[0-9]{3}$')
# Accepted examples:
# ## REQ-FR-001. Title
# ## FR-001 — Title
# ## Подтверждено источником: Title + metadata ID below
HEADING = re.compile(r'^##\s+((?:REQ-)?[A-Z][A-Z0-9]*-[0-9]{3})(?:\.|\s+[—:-])?\s*(.*)$')
NEEDS_INPUT = re.compile(
    r'^##\s+(?:NEEDS_INPUT|NEED_INPUTS|NEED_INPUT)(?:\[([A-Z0-9-]+)\])?\s*:\s*(.+)$',
    re.IGNORECASE,
)
META = re.compile(
    r'^\s*\*\*\s*(ID требования|Requirement ID|Область|Domain|Статус|Status|Основание|Evidence|ID вопроса|Question ID|Применимость|Applicability)\s*:?\s*\*\*\s*:?\s*(.+?)\s*$',
    re.IGNORECASE,
)
KEY_MAP = {
    'id требования': 'ID требования',
    'requirement id': 'ID требования',
    'область': 'Область',
    'domain': 'Область',
    'статус': 'Статус',
    'status': 'Статус',
    'основание': 'Основание',
    'evidence': 'Основание',
    'id вопроса': 'ID вопроса',
    'question id': 'ID вопроса',
    'применимость': 'Применимость',
    'applicability': 'Применимость',
}

STATUS_ALIASES = {
    'Подтверждено_sources': 'Подтверждено источником',
    'Подтверждено source': 'Подтверждено источником',
    'Confirmed by source': 'Подтверждено источником',
    'Confirmed by Product Manager': 'Подтверждено Product Manager',
}
UNRESOLVED_STATUSES = {
    'В процессе',
    'Требуется заполнение',
    'Черновик',
    'DRAFT',
    'IN_PROGRESS',
    'NEEDS_INPUT',
    'NEED_INPUTS',
    'NEED_INPUT',
}


def normalize_status(value: str | None) -> str | None:
    if value is None:
        return None
    value = value.strip()
    return STATUS_ALIASES.get(value, value)


def normalize_requirement_id(value: str) -> str | None:
    value = value.strip().strip('`')
    if CANONICAL_ID.fullmatch(value):
        return value
    if LEGACY_ID.fullmatch(value):
        return f'REQ-{value}'
    return None


def split_sections(lines: list[str]):
    starts = [index for index, line in enumerate(lines) if line.lstrip('\ufeff').startswith('## ')]
    for position, start in enumerate(starts):
        end = starts[position + 1] if position + 1 < len(starts) else len(lines)
        yield start, end, lines[start].lstrip('\ufeff')


def parse_metadata(lines: list[str]) -> dict[str, str]:
    metadata: dict[str, str] = {}
    for raw in lines:
        line = raw.replace('\u00a0', ' ').strip()
        match = META.match(line)
        if match:
            canonical = KEY_MAP[match.group(1).strip().lower()]
            metadata[canonical] = match.group(2).strip().strip('`')
    return metadata


def main() -> int:
    parser = argparse.ArgumentParser(description='Построить индекс требований из Markdown')
    parser.add_argument('--verbose', action='store_true', help='Показать статистику по каждому файлу')
    args = parser.parse_args()

    items: list[dict] = []
    gaps: list[dict] = []
    errors: list[str] = []
    diagnostics: list[dict] = []

    for path in sorted(REQ_ROOT.rglob('*.md')):
        if path.name == 'README.md':
            continue
        text = path.read_text(encoding='utf-8-sig')
        lines = text.splitlines()
        rel = path.relative_to(ROOT).as_posix()
        file_requirements = 0
        file_gaps = 0
        candidate_sections = 0
        for start, end, heading_line in split_sections(lines):
            need_match = NEEDS_INPUT.match(heading_line)
            head_match = HEADING.match(heading_line)
            metadata = parse_metadata(lines[start + 1:end])
            if need_match or head_match or metadata.get('ID требования'):
                candidate_sections += 1

            if need_match:
                question_id = metadata.get('ID вопроса') or need_match.group(1)
                gap = {
                    'title': need_match.group(2).strip(),
                    'file': rel,
                    'line': start + 1,
                    'questionId': question_id,
                    'domainId': metadata.get('Область'),
                    'status': normalize_status(metadata.get('Статус')),
                }
                if not gap['questionId'] or not gap['domainId']:
                    errors.append(f'{rel}:{start + 1}: NEEDS_INPUT без ID вопроса или области')
                if gap.get('status') not in {'Требуется решение', 'NEEDS_INPUT'}:
                    errors.append(f'{rel}:{start + 1}: NEEDS_INPUT должен иметь статус «Требуется решение»')
                gaps.append(gap)
                file_gaps += 1
                continue

            requirement_id = normalize_requirement_id(head_match.group(1)) if head_match else None
            title = head_match.group(2).strip(' .—:-') if head_match and head_match.group(2) else heading_line[3:].strip()
            metadata_id = metadata.get('ID требования')
            if metadata_id:
                normalized_metadata_id = normalize_requirement_id(metadata_id)
                if not normalized_metadata_id:
                    errors.append(f'{rel}:{start + 1}: некорректный ID требования {metadata_id}')
                elif requirement_id and requirement_id != normalized_metadata_id:
                    errors.append(
                        f'{rel}:{start + 1}: ID в заголовке {requirement_id} не совпадает с метаданными {normalized_metadata_id}'
                    )
                else:
                    requirement_id = normalized_metadata_id

            if not requirement_id:
                continue
            if not title:
                title = requirement_id
            normalized_status = normalize_status(metadata.get('Статус'))
            if normalized_status in UNRESOLVED_STATUSES:
                domain_id = metadata.get('Область')
                question_id = metadata.get('ID вопроса') or f'Q-MIGRATED-{requirement_id.removeprefix("REQ-")}'
                gaps.append({
                    'title': title,
                    'file': rel,
                    'line': start + 1,
                    'questionId': question_id,
                    'domainId': domain_id,
                    'status': 'Требуется решение',
                    'legacyRequirementId': requirement_id,
                })
                if not domain_id:
                    errors.append(f'{rel}:{start + 1}: незавершённый блок {requirement_id} без области')
                file_gaps += 1
                continue
            item = {
                'id': requirement_id,
                'title': title,
                'file': rel,
                'line': start + 1,
                'domainId': metadata.get('Область'),
                'status': normalized_status,
                'evidenceRefs': [
                    part.strip().strip('`')
                    for part in re.split(r'[,;]', metadata.get('Основание', ''))
                    if part.strip()
                ],
                'applicability': metadata.get('Применимость'),
            }
            for key in ('domainId', 'status'):
                if not item.get(key):
                    errors.append(f'{rel}:{start + 1}: {requirement_id}: отсутствует {key}')
            items.append(item)
            file_requirements += 1

        diagnostics.append({
            'file': rel,
            'requirements': file_requirements,
            'needsInput': file_gaps,
            'candidateSections': candidate_sections,
        })

    seen: dict[str, str] = {}
    for item in items:
        location = f"{item['file']}:{item['line']}"
        if item['id'] in seen:
            errors.append(f"Повтор ID {item['id']}: {seen[item['id']]} и {location}")
        seen[item['id']] = location

    catalog = load('internal/domain-catalog.json')
    domain_ids = {domain['id'] for domain in catalog.get('domains', [])}
    for item in items:
        if item.get('domainId') and item['domainId'] not in domain_ids:
            errors.append(f"{item['file']}:{item['line']}: неизвестная область {item['domainId']}")
    for gap in gaps:
        if gap.get('domainId') and gap['domainId'] not in domain_ids:
            errors.append(f"{gap['file']}:{gap['line']}: неизвестная область {gap['domainId']}")

    for domain in catalog.get('domains', []):
        expected_file = ROOT / domain['file']
        if not expected_file.exists():
            errors.append(f"Отсутствует файл области {domain['id']}: {domain['file']}")
        has_entry = any(item.get('domainId') == domain['id'] for item in items) or any(
            gap.get('domainId') == domain['id'] for gap in gaps
        )
        if not has_entry:
            errors.append(
                f"Область {domain['id']} проигнорирована: добавьте подтверждённое требование, "
                'явное «не применимо» или NEEDS_INPUT'
            )

    out = {
        'schemaVersion': SCHEMA_VERSION,
        'requirementsSha256': directory_sha256(REQ_ROOT, ignored_names={'README.md'}),
        'requirements': items,
        'needsInput': gaps,
        'errors': errors,
        'diagnostics': diagnostics,
    }
    save('product/requirements-index.json', out)

    old_questions = (
        load('product/open-questions.json')
        if (ROOT / 'product/open-questions.json').exists()
        else {'schemaVersion': SCHEMA_VERSION, 'questions': []}
    )
    old_by_id = {item.get('id'): item for item in old_questions.get('questions', []) if item.get('id')}
    questions = []
    for gap in gaps:
        old = old_by_id.get(gap.get('questionId'), {})
        answered = bool(old.get('answerEvidenceRef'))
        questions.append({
            'id': gap.get('questionId'),
            'domainId': gap.get('domainId'),
            'title': gap.get('title'),
            'file': gap.get('file'),
            'line': gap.get('line'),
            'status': 'ANSWERED_NOT_APPLIED' if answered else 'OPEN',
            'answerEvidenceRef': old.get('answerEvidenceRef'),
            'answeredAt': old.get('answeredAt'),
        })
    save('product/open-questions.json', {'schemaVersion': SCHEMA_VERSION, 'questions': questions})

    if args.verbose:
        for item in diagnostics:
            print(
                f"{item['file']}: requirements={item['requirements']}, "
                f"NEEDS_INPUT={item['needsInput']}, candidates={item['candidateSections']}"
            )
        for error in errors:
            print('ERROR:', error)
    print(f'Требований: {len(items)}; NEEDS_INPUT: {len(gaps)}; ошибок: {len(errors)}')
    return 1 if errors else 0


if __name__ == '__main__':
    raise SystemExit(main())
