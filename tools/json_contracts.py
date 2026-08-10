from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def _schema_contract() -> tuple[str, tuple[str, ...]]:
    contract = json.loads((ROOT / 'schemas/schema-version.schema.json').read_text(encoding='utf-8'))
    return str(contract['x-currentVersion']), tuple(str(item) for item in contract.get('enum', []))


VERSION, SUPPORTED_VERSIONS = _schema_contract()

SCHEMA_FILES = {
    'internal/domain-catalog.json': 'schemas/domain-catalog.schema.json',
    'sources/source-manifest.json': 'schemas/source-manifest.schema.json',
    'product/evidence-register.json': 'schemas/evidence-register.schema.json',
    'product/artifact-evidence.json': 'schemas/artifact-evidence.schema.json',
    'product/open-questions.json': 'schemas/open-questions.schema.json',
    'product/phase-reviews.json': 'schemas/phase-reviews.schema.json',
    'product/requirements-index.json': 'schemas/requirements-index.schema.json',
    'product/requirements-baseline.json': 'schemas/requirements-baseline.schema.json',
    'product/completeness-report.json': 'schemas/completeness-report.schema.json',
    'product/ui-source.json': 'schemas/ui-source.schema.json',
    'product/ui-component-inventory.json': 'schemas/ui-component-inventory.schema.json',
    'product/prototype-data-source.json': 'schemas/prototype-data-source.schema.json',
    'product/technology-stack.json': 'schemas/technology-stack.schema.json',
    'product/conflict-register.json': 'schemas/conflict-register.schema.json',
    'project-state.json': 'schemas/project-state.schema.json',
    'visual-prototype/prototype-manifest.json': 'schemas/visual-prototype-manifest.schema.json',
    'prototype/prototype-manifest.json': 'schemas/working-prototype-manifest.schema.json',
    'work-queue.json': 'schemas/work-queue.schema.json',
}

TOP_LEVEL_LISTS = {
    'product/evidence-register.json': 'evidence',
    'product/artifact-evidence.json': 'evidence',
    'product/phase-reviews.json': 'reviews',
    'product/open-questions.json': 'questions',
    'product/requirements-index.json': 'requirements',
    'product/requirements-baseline.json': 'baselines',
    'product/conflict-register.json': 'conflicts',
    'product/ui-component-inventory.json': 'components',
    'sources/source-manifest.json': 'entries',
    'internal/domain-catalog.json': 'domains',
    'work-queue.json': 'tasks',
}


def _required(item: dict, fields: tuple[str, ...], prefix: str) -> list[str]:
    return [f'{prefix}: отсутствует обязательное поле {field}' for field in fields if item.get(field) in (None, '')]


@lru_cache(maxsize=None)
def _validator_for(schema_rel: str):
    try:
        from jsonschema import Draft202012Validator
    except ImportError as exc:
        raise RuntimeError('Не установлен jsonschema. Выполните: python -m pip install -r requirements-tooling.txt') from exc
    schema_path = ROOT / schema_rel
    if not schema_path.is_file():
        raise RuntimeError(f'Не найдена JSON Schema: {schema_rel}')
    try:
        schema = json.loads(schema_path.read_text(encoding='utf-8-sig'))
    except (OSError, json.JSONDecodeError) as exc:
        raise RuntimeError(f'Некорректна JSON Schema {schema_rel}: {exc}') from exc
    try:
        from referencing import Registry, Resource
    except ImportError as exc:
        raise RuntimeError('Не установлен referencing. Он устанавливается вместе с jsonschema.') from exc
    registry = Registry()
    for candidate in (ROOT / 'schemas').glob('*.schema.json'):
        candidate_schema = json.loads(candidate.read_text(encoding='utf-8-sig'))
        registry = registry.with_resource(candidate.name, Resource.from_contents(candidate_schema))
    return Draft202012Validator(schema, registry=registry)


def _schema_errors(rel: str, obj) -> list[str]:
    schema_rel = SCHEMA_FILES.get(rel)
    if not schema_rel:
        return []
    try:
        validator = _validator_for(schema_rel)
    except RuntimeError as exc:
        return [str(exc)]
    errors = []
    for error in sorted(validator.iter_errors(obj), key=lambda item: list(item.absolute_path)):
        location = '.'.join(str(part) for part in error.absolute_path) or '<root>'
        errors.append(f'{location}: {error.message}')
    return errors


def validate_document(rel: str, obj, *, strict_items: bool = True, use_schema: bool = True) -> list[str]:
    rel = Path(rel).as_posix()
    errors: list[str] = []
    if not isinstance(obj, dict):
        return ['Корневое значение должно быть JSON-объектом']
    if obj.get('schemaVersion') not in SUPPORTED_VERSIONS:
        errors.append(f'schemaVersion должен быть одним из: {", ".join(SUPPORTED_VERSIONS)}')
    list_key = TOP_LEVEL_LISTS.get(rel)
    if list_key and not isinstance(obj.get(list_key), list):
        errors.append(f'Поле {list_key} должно быть массивом')
        return errors

    # JSON Schema is the canonical structural contract. It is applied on every
    # write through common.save() and during full workspace validation.
    if use_schema:
        errors.extend(_schema_errors(rel, obj))
    if not strict_items:
        return errors

    # The checks below produce concise domain-specific messages in addition to
    # generic JSON Schema paths.
    if rel == 'product/evidence-register.json':
        for index, item in enumerate(obj.get('evidence', []), start=1):
            prefix = f'evidence[{index}]'
            if not isinstance(item, dict):
                errors.append(f'{prefix}: запись должна быть объектом')
                continue
            errors.extend(_required(item, ('id', 'type', 'createdAt', 'recordedBy'), prefix))
            if not (item.get('domainId') or item.get('domainIds')):
                errors.append(f'{prefix}: требуется domainId или domainIds')
            if item.get('type') == 'SOURCE_EXCERPT':
                errors.extend(_required(item, ('sourceId', 'snapshotPath', 'snapshotSha256', 'location', 'excerpt'), prefix))
            elif item.get('type') == 'PRODUCT_MANAGER_DECISION':
                errors.extend(_required(item, ('questionId', 'decision', 'exactUserMessage'), prefix))
            elif item.get('type') not in {'AI_PROPOSAL'}:
                errors.append(f'{prefix}: неизвестный type {item.get("type")}')
    elif rel == 'product/phase-reviews.json':
        for index, item in enumerate(obj.get('reviews', []), start=1):
            if not isinstance(item, dict):
                errors.append(f'reviews[{index}]: запись должна быть объектом')
                continue
            errors.extend(_required(item, ('reviewId', 'phase', 'status', 'revision'), f'reviews[{index}]'))
    elif rel == 'product/requirements-index.json':
        if not isinstance(obj.get('needsInput'), list):
            errors.append('Поле needsInput должно быть массивом')
        if not isinstance(obj.get('errors'), list):
            errors.append('Поле errors должно быть массивом')
        for index, item in enumerate(obj.get('requirements', []), start=1):
            if not isinstance(item, dict):
                errors.append(f'requirements[{index}]: запись должна быть объектом')
                continue
            errors.extend(_required(item, ('id', 'file', 'line', 'domainId', 'status'), f'requirements[{index}]'))
    return errors
