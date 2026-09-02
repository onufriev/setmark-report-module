from __future__ import annotations

from pathlib import Path

from common import PHASE_SEQUENCE, PRODUCT_VERSION, ROOT, SCHEMA_VERSION, load


def _approved_phase_reviews(reviews: list[dict]) -> set[str]:
    return {
        item.get('phase')
        for item in reviews
        if item.get('status') == 'APPROVED'
        and item.get('approvedBy') == 'PRODUCT_MANAGER'
        and item.get('shownToProductManagerAt')
    }


def _current_phase(reviews: list[dict]) -> str:
    approved = _approved_phase_reviews(reviews)
    phases = list(PHASE_SEQUENCE)
    if load('product/prototype-exemption.json').get('status') == 'SKIPPED_BY_PM' and 'WORKING_PROTOTYPE' in approved:
        phases.remove('WORKING_VALIDATION')
    for phase in phases:
        if phase not in approved:
            return phase
    return phases[-1]


def _latest_review(reviews: list[dict], phase: str) -> dict | None:
    candidates = [item for item in reviews if item.get('phase') == phase and item.get('status') not in {'SUPERSEDED', 'STALE_REVIEW'}]
    if not candidates:
        return None
    return max(candidates, key=lambda item: int(item.get('revision', 0)))


def _has_files(folder: str, ignored: set[str]) -> bool:
    root = ROOT / folder
    return root.exists() and any(
        item.is_file() and item.name not in ignored and '__pycache__' not in item.parts
        for item in root.rglob('*')
    )


def _artifact_status(phase: str, folder: str) -> str:
    evidence = load('product/artifact-evidence.json').get('evidence', [])
    if any(item.get('phase') == phase and item.get('result') == 'PASSED' for item in evidence):
        return 'VERIFIED'
    if _has_files(folder, {'README.md', 'PROTOTYPE-RUNBOOK.md', 'prototype-manifest.json'}):
        return 'IN_PROGRESS'
    return 'NOT_STARTED'


def _requirements_status() -> str:
    index = load('product/requirements-index.json')
    baseline = load('product/requirements-baseline.json')
    completeness = load('product/completeness-report.json')
    if baseline.get('status') == 'COMMITTED' and completeness.get('gates', {}).get('VISUAL_PROTOTYPE', {}).get('status') == 'PASSED':
        return 'COMMITTED'
    if index.get('requirements') or index.get('needsInput'):
        return 'IN_PROGRESS'
    return 'NOT_STARTED'


def derive_state(existing: dict | None = None) -> dict:
    existing = existing or {}
    manifest = load('sources/source-manifest.json')
    review_doc = load('product/phase-reviews.json')
    reviews = review_doc.get('reviews', [])
    phase = _current_phase(reviews)
    current_review = _latest_review(reviews, phase)
    completeness = load('product/completeness-report.json')
    stack = load('product/technology-stack.json')
    data_source = load('product/prototype-data-source.json')

    phase_review = {
        'phase': None,
        'status': 'NOT_PREPARED',
        'reviewId': None,
        'markdownReport': None,
        'pdfReport': None,
        'shownToProductManagerAt': None,
        'nextPhase': None,
    }
    if current_review:
        for key in phase_review:
            if key in current_review:
                phase_review[key] = current_review.get(key)

    if current_review and current_review.get('status') == 'READY_FOR_REVIEW':
        if current_review.get('shownToProductManagerAt'):
            status = 'WAITING_FOR_APPROVAL'
            next_action = 'Ждать отдельного решения Product Manager по показанному отчёту.'
        else:
            status = 'READY_FOR_REVIEW'
            next_action = 'Показать зарегистрированный отчёт через tools/present_phase_review.py.'
    elif phase == 'SOURCE_SETUP':
        source_status = manifest.get('setupStatus', 'NOT_STARTED')
        status = 'NOT_STARTED' if source_status == 'NOT_STARTED' else 'IN_PROGRESS'
        next_action = (
            'Спросить Product Manager об источнике материалов.'
            if source_status == 'NOT_STARTED'
            else 'Завершить настройку источников и подготовить отчёт SOURCE_SETUP.'
        )
    elif phase == 'PRODUCT_DEFINITION' and completeness.get('gates', {}).get('VISUAL_PROTOTYPE', {}).get('status') != 'PASSED':
        status = 'WAITING_FOR_INPUT'
        next_action = 'Закрыть все требования или явно зафиксировать NEEDS_INPUT до визуального прототипа.'
    elif phase == 'WORKING_PROTOTYPE' and load('product/prototype-exemption.json').get('status') != 'SKIPPED_BY_PM' and (
        stack.get('status') not in {'Подтверждено Product Manager', 'Временно принято Product Manager'}
        or data_source.get('status') not in {'Подтверждено Product Manager', 'Временно принято Product Manager'}
    ):
        status = 'WAITING_FOR_INPUT'
        next_action = 'Зафиксировать технологический стек и источник данных рабочего прототипа.'
    elif len(_approved_phase_reviews(reviews)) == len(
        [p for p in PHASE_SEQUENCE if not (
            p == 'WORKING_VALIDATION'
            and load('product/prototype-exemption.json').get('status') == 'SKIPPED_BY_PM'
        )]
    ):
        status = 'VALIDATED'
        next_action = 'Процесс завершён.'
    else:
        status = 'IN_PROGRESS'
        next_action = f'Продолжить этап {phase} по правилам PRODUCT-COMPILER.md.'

    return {
        'schemaVersion': SCHEMA_VERSION,
        'productName': 'Product Compiler',
        'productVersion': PRODUCT_VERSION,
        'projectName': existing.get('projectName'),
        'currentPhase': phase,
        'status': status,
        'nextAction': next_action,
        'blockingQuestionId': existing.get('blockingQuestionId'),
        'sourceSetup': {
            'status': manifest.get('setupStatus', 'NOT_STARTED'),
            'inputMode': manifest.get('inputMode', 'UNSET'),
        },
        'phaseReview': phase_review,
        'artifactStatus': {
            'requirements': _requirements_status(),
            'visualPrototype': _artifact_status('VISUAL_PROTOTYPE', 'visual-prototype'),
            'workingPrototype': _artifact_status('WORKING_PROTOTYPE', 'prototype'),
            'handoff': _artifact_status('HANDOFF_READY', 'handoff'),
        },
    }
