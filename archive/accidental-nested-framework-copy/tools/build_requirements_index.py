#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

from common import ROOT, SCHEMA_VERSION, directory_sha256, load, save

REQ_ROOT = ROOT / 'requirements'
NEW_ID = re.compile(r'^(VISION|SCOPE|SCN|RULE|QUAL)-[0-9]{3}$')
CANONICAL_LEGACY_ID = re.compile(r'^REQ-[A-Z][A-Z0-9]*-[0-9]{3}$')
SHORT_LEGACY_ID = re.compile(r'^[A-Z][A-Z0-9]*-[0-9]{3}$')
LEGACY_HEADING = re.compile(r'^##\s+((?:REQ-)?[A-Z][A-Z0-9]*-[0-9]{3})(?:\.|\s+[—:-])?\s*(.*)$')
LEGACY_NEEDS_INPUT = re.compile(
    r'^##\s+(?:NEEDS_INPUT|NEED_INPUTS|NEED_INPUT)(?:\[([A-Z0-9-]+)\])?\s*:\s*(.+)$',
    re.IGNORECASE,
)
META_COMMENT = re.compile(
    r'^\s*<!--\s*product-compiler-(requirement|question)\s*:\s*(\{.*\})\s*-->\s*$'
)
HEADING = re.compile(r'^(#{1,3})\s+(.+?)\s*$')
LEGACY_META = re.compile(
    r'^\s*\*\*\s*(ID требования|Requirement ID|Область|Domain|Статус|Status|Основание|Evidence|ID вопроса|Question ID|Применимость|Applicability)\s*:?\s*\*\*\s*:?\s*(.+?)\s*$',
    re.IGNORECASE,
)
KEY_MAP = {
    'id требования': 'ID требования', 'requirement id': 'ID требования',
    'область': 'Область', 'domain': 'Область', 'статус': 'Статус', 'status': 'Статус',
    'основание': 'Основание', 'evidence': 'Основание', 'id вопроса': 'ID вопроса',
    'question id': 'ID вопроса', 'применимость': 'Применимость', 'applicability': 'Применимость',
}
STATUS_ALIASES = {
    'Подтверждено_sources': 'Подтверждено источником',
    'Подтверждено source': 'Подтверждено источником',
    'Confirmed by source': 'Подтверждено источником',
    'Confirmed by Product Manager': 'Подтверждено Product Manager',
}
UNRESOLVED_STATUSES = {
    'В процессе', 'Требуется заполнение', 'Черновик', 'DRAFT', 'IN_PROGRESS',
    'NEEDS_INPUT', 'NEED_INPUTS', 'NEED_INPUT',
}
NEW_KINDS = {'VISION', 'SCOPE', 'SCENARIO', 'RULE', 'QUALITY'}
NEW_HORIZONS = {'CURRENT', 'NEXT', 'LATER'}
QUESTION_OWNERS = {'PRODUCT_MANAGER', 'SYSTEM_ANALYST', 'ARCHITECT', 'DEVELOPMENT_TEAM'}


def normalize_status(value: str | None) -> str | None:
    if value is None:
        return None
    value = value.strip()
    return STATUS_ALIASES.get(value, value)


def normalize_legacy_id(value: str) -> str | None:
    value = value.strip().strip('`')
    if CANONICAL_LEGACY_ID.fullmatch(value):
        return value
    if SHORT_LEGACY_ID.fullmatch(value):
        return f'REQ-{value}'
    return None


def active_lines(lines: list[str]) -> list[tuple[int, str]]:
    """Return lines outside fenced examples so templates are not indexed."""
    result: list[tuple[int, str]] = []
    in_fence = False
    for index, line in enumerate(lines):
        if line.strip().startswith('```'):
            in_fence = not in_fence
            continue
        if not in_fence:
            result.append((index, line))
    return result


def next_heading(lines: list[str], start: int) -> tuple[int, str] | None:
    in_fence = False
    for index in range(start, len(lines)):
        line = lines[index]
        if line.strip().startswith('```'):
            in_fence = not in_fence
            continue
        if not in_fence:
            match = HEADING.match(line)
            if match:
                return index, match.group(2).strip()
    return None


def section_end(lines: list[str], start: int) -> int:
    in_fence = False
    for index in range(start + 1, len(lines)):
        line = lines[index]
        if line.strip().startswith('```'):
            in_fence = not in_fence
            continue
        if not in_fence and META_COMMENT.match(line):
            return index
    return len(lines)


def string_list(value, field: str, location: str, errors: list[str]) -> list[str]:
    if isinstance(value, str):
        return [value]
    if isinstance(value, list) and all(isinstance(item, str) and item for item in value):
        return value
    errors.append(f'{location}: {field} должен быть строкой или массивом непустых строк')
    return []


def parse_new_format(path: Path, lines: list[str], rel: str, errors: list[str], warnings: list[str]):
    requirements: list[dict] = []
    gaps: list[dict] = []
    comments = [(index, META_COMMENT.match(line)) for index, line in active_lines(lines) if META_COMMENT.match(line)]
    for comment_line, match in comments:
        kind = match.group(1)
        location = f'{rel}:{comment_line + 1}'
        try:
            meta = json.loads(match.group(2))
        except json.JSONDecodeError as exc:
            errors.append(f'{location}: некорректные служебные метаданные: {exc.msg}')
            continue
        heading = next_heading(lines, comment_line + 1)
        if not heading:
            errors.append(f'{location}: после служебных метаданных нет заголовка')
            continue
        heading_line, title = heading
        domains = string_list(meta.get('domains') or meta.get('domain'), 'domains', location, errors)
        if kind == 'question':
            question_id = str(meta.get('id') or '')
            owner = str(meta.get('owner') or '')
            blocking = meta.get('blocking')
            if not re.fullmatch(r'Q-[A-Z0-9-]+', question_id):
                errors.append(f'{location}: некорректный внутренний ID вопроса')
            if owner not in QUESTION_OWNERS:
                errors.append(f'{location}: неизвестный владелец вопроса {owner or "<не указан>"}')
            if not isinstance(blocking, bool):
                errors.append(f'{location}: blocking должен быть true или false')
            gaps.append({
                'title': title,
                'file': rel,
                'line': heading_line + 1,
                'questionId': question_id,
                'domainId': domains[0] if domains else None,
                'domainIds': domains,
                'status': 'Требуется решение',
                'owner': owner,
                'blocking': bool(blocking),
                'neededFor': meta.get('neededFor') or 'PRODUCT_DEFINITION',
            })
            continue

        requirement_id = str(meta.get('id') or '')
        requirement_kind = str(meta.get('kind') or '')
        horizon = str(meta.get('horizon') or 'CURRENT')
        status = normalize_status(str(meta.get('status') or ''))
        evidence = string_list(meta.get('evidence') or [], 'evidence', location, errors)
        if not NEW_ID.fullmatch(requirement_id):
            errors.append(f'{location}: новые материалы используют VISION-, SCOPE-, SCN-, RULE- или QUAL-ID')
        if requirement_kind not in NEW_KINDS:
            errors.append(f'{location}: неизвестный вид требования {requirement_kind or "<не указан>"}')
        if horizon not in NEW_HORIZONS:
            errors.append(f'{location}: неизвестный горизонт {horizon}')
        if not domains:
            errors.append(f'{location}: не указана ни одна область')
        if title.lower().startswith('решение product manager'):
            errors.append(f'{location}: решение Product Manager нужно встроить в осмысленный сценарий или правило')
        body = '\n'.join(lines[heading_line:section_end(lines, comment_line)])
        if requirement_kind == 'SCENARIO' and horizon == 'CURRENT' and status not in UNRESOLVED_STATUSES:
            missing = [name for name in ('Цель', 'Основной ход', 'Результат', 'Условия готовности') if not re.search(rf'^##\s+{name}\s*$', body, re.MULTILINE)]
            if missing:
                errors.append(f'{location}: текущему сценарию не хватает разделов: {", ".join(missing)}')
            if not re.search(r'^\s*1\.\s+\S+', body, re.MULTILINE):
                errors.append(f'{location}: основной ход сценария должен содержать действия')
        if len(body.split()) > 1200:
            warnings.append(f'{location}: материал длиннее 1200 слов; проверьте, не объединены ли разные пользовательские задачи')
        requirements.append({
            'id': requirement_id,
            'title': title,
            'kind': requirement_kind,
            'file': rel,
            'line': heading_line + 1,
            'domainId': domains[0] if domains else None,
            'domainIds': domains,
            'status': status,
            'evidenceRefs': evidence,
            'horizon': horizon,
            'format': 'SCENARIO_V5',
        })
    return requirements, gaps


def parse_legacy_format(lines: list[str], rel: str, errors: list[str], warnings: list[str]):
    requirements: list[dict] = []
    gaps: list[dict] = []
    active = active_lines(lines)
    starts = [(index, line) for index, line in active if line.lstrip('\ufeff').startswith('## ')]
    active_indexes = [item[0] for item in starts]
    for position, (start, heading_line) in enumerate(starts):
        end = active_indexes[position + 1] if position + 1 < len(active_indexes) else len(lines)
        need_match = LEGACY_NEEDS_INPUT.match(heading_line.lstrip('\ufeff'))
        head_match = LEGACY_HEADING.match(heading_line.lstrip('\ufeff'))
        metadata: dict[str, str] = {}
        for raw in lines[start + 1:end]:
            match = LEGACY_META.match(raw.replace('\u00a0', ' ').strip())
            if match:
                metadata[KEY_MAP[match.group(1).strip().lower()]] = match.group(2).strip().strip('`')
        if need_match:
            gaps.append({
                'title': need_match.group(2).strip(), 'file': rel, 'line': start + 1,
                'questionId': metadata.get('ID вопроса') or need_match.group(1),
                'domainId': metadata.get('Область'),
                'domainIds': [metadata.get('Область')] if metadata.get('Область') else [],
                'status': normalize_status(metadata.get('Статус')),
                'owner': 'PRODUCT_MANAGER', 'blocking': True, 'neededFor': 'PRODUCT_DEFINITION',
            })
            continue
        requirement_id = normalize_legacy_id(head_match.group(1)) if head_match else None
        metadata_id = normalize_legacy_id(metadata.get('ID требования', '')) if metadata.get('ID требования') else None
        requirement_id = requirement_id or metadata_id
        if not requirement_id:
            continue
        title = head_match.group(2).strip(' .—:-') if head_match and head_match.group(2) else requirement_id
        status = normalize_status(metadata.get('Статус'))
        if status in UNRESOLVED_STATUSES:
            gaps.append({
                'title': title, 'file': rel, 'line': start + 1,
                'questionId': metadata.get('ID вопроса') or f'Q-MIGRATED-{requirement_id.removeprefix("REQ-")}',
                'domainId': metadata.get('Область'),
                'domainIds': [metadata.get('Область')] if metadata.get('Область') else [],
                'status': 'Требуется решение', 'owner': 'PRODUCT_MANAGER', 'blocking': True,
                'neededFor': 'PRODUCT_DEFINITION', 'legacyRequirementId': requirement_id,
            })
            continue
        domain = metadata.get('Область')
        refs = [part.strip().strip('`') for part in re.split(r'[,;]', metadata.get('Основание', '')) if part.strip()]
        requirements.append({
            'id': requirement_id, 'title': title, 'kind': 'LEGACY', 'file': rel, 'line': start + 1,
            'domainId': domain, 'domainIds': [domain] if domain else [], 'status': status,
            'evidenceRefs': refs, 'horizon': metadata.get('Применимость') or 'CURRENT', 'format': 'LEGACY',
        })
        if requirement_id.startswith('REQ-DEC-') or title.lower() == 'решение product manager':
            warnings.append(f'{rel}:{start + 1}: историческое REQ-DEC нужно объединить с осмысленным сценарием при следующем пересмотре')
    return requirements, gaps


def main() -> int:
    parser = argparse.ArgumentParser(description='Построить индекс продуктовых сценариев и требований из Markdown')
    parser.add_argument('--verbose', action='store_true')
    args = parser.parse_args()
    items: list[dict] = []
    gaps: list[dict] = []
    errors: list[str] = []
    warnings: list[str] = []
    diagnostics: list[dict] = []

    for path in sorted(REQ_ROOT.rglob('*.md')):
        if path.name == 'README.md':
            continue
        lines = path.read_text(encoding='utf-8-sig').splitlines()
        rel = path.relative_to(ROOT).as_posix()
        new_items, new_gaps = parse_new_format(path, lines, rel, errors, warnings)
        legacy_items, legacy_gaps = parse_legacy_format(lines, rel, errors, warnings)
        items.extend(new_items)
        gaps.extend(new_gaps)
        items.extend(legacy_items)
        gaps.extend(legacy_gaps)
        diagnostics.append({'file': rel, 'requirements': len(new_items) + len(legacy_items), 'openQuestions': len(new_gaps) + len(legacy_gaps)})

    seen: dict[str, str] = {}
    for item in items:
        location = f"{item['file']}:{item['line']}"
        if item['id'] in seen:
            errors.append(f"Повтор ID {item['id']}: {seen[item['id']]} и {location}")
        seen[item['id']] = location

    catalog = load('internal/domain-catalog.json')
    domain_ids = {domain['id'] for domain in catalog.get('domains', [])}
    for entry in [*items, *gaps]:
        for domain in entry.get('domainIds') or []:
            if domain not in domain_ids:
                errors.append(f"{entry['file']}:{entry['line']}: неизвестная область {domain}")

    out = {
        'schemaVersion': SCHEMA_VERSION,
        'requirementsSha256': directory_sha256(REQ_ROOT, ignored_names={'README.md'}),
        'requirements': items,
        'needsInput': gaps,
        'errors': errors,
        'qualityWarnings': warnings,
        'diagnostics': diagnostics,
    }
    save('product/requirements-index.json', out)

    old_questions = load('product/open-questions.json') if (ROOT / 'product/open-questions.json').exists() else {'questions': []}
    old_by_id = {item.get('id'): item for item in old_questions.get('questions', []) if item.get('id')}
    questions = []
    for gap in gaps:
        old = old_by_id.get(gap.get('questionId'), {})
        answered = bool(old.get('answerEvidenceRef'))
        questions.append({
            'id': gap.get('questionId'), 'domainId': gap.get('domainId'), 'domainIds': gap.get('domainIds', []),
            'title': gap.get('title'), 'file': gap.get('file'), 'line': gap.get('line'),
            'owner': gap.get('owner'), 'blocking': gap.get('blocking', True), 'neededFor': gap.get('neededFor'),
            'status': 'ANSWERED_NOT_APPLIED' if answered else 'OPEN',
            'answerEvidenceRef': old.get('answerEvidenceRef'), 'answeredAt': old.get('answeredAt'),
        })
    save('product/open-questions.json', {'schemaVersion': SCHEMA_VERSION, 'questions': questions})

    if args.verbose:
        for item in diagnostics:
            print(f"{item['file']}: requirements={item['requirements']}, openQuestions={item['openQuestions']}")
        for warning in warnings:
            print('WARNING:', warning)
        for error in errors:
            print('ERROR:', error)
    print(f'Материалов: {len(items)}; открытых вопросов: {len(gaps)}; блокирующих: {sum(1 for gap in gaps if gap.get("blocking"))}; ошибок: {len(errors)}')
    return 1 if errors else 0


if __name__ == '__main__':
    raise SystemExit(main())
