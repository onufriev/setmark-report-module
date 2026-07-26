#!/usr/bin/env python3
from __future__ import annotations

import argparse
from pathlib import Path

from common import ROOT, SCHEMA_VERSION, load, normalize_snapshot_relpath, save, sha256, source_snapshot_record
from json_contracts import TOP_LEVEL_LISTS, validate_document

JSON_FILES = [
    'sources/source-manifest.json',
    'product/evidence-register.json',
    'product/artifact-evidence.json',
    'product/open-questions.json',
    'product/phase-reviews.json',
    'product/requirements-index.json',
    'product/requirements-baseline.json',
    'product/completeness-report.json',
    'product/ui-source.json',
    'product/ui-component-inventory.json',
    'product/prototype-data-source.json',
    'product/technology-stack.json',
    'product/conflict-register.json',
    'project-state.json',
    'visual-prototype/prototype-manifest.json',
    'prototype/prototype-manifest.json',
    'internal/domain-catalog.json',
    'work-queue.json',
]


def normalize_source_manifest(doc: dict) -> dict:
    for entry in doc.get('entries', []):
        if not entry.get('id') and entry.get('sourceId'):
            entry['id'] = entry.pop('sourceId')
        if not entry.get('name'):
            entry['name'] = entry.get('title') or entry.get('id')
        if not entry.get('origin'):
            entry['origin'] = entry.get('url') or entry.get('location') or entry.get('id')
        if not entry.get('snapshotPath') and entry.get('snapshotFile'):
            entry['snapshotPath'] = normalize_snapshot_relpath(entry.pop('snapshotFile'))
        elif entry.get('snapshotPath'):
            entry['snapshotPath'] = normalize_snapshot_relpath(entry['snapshotPath'])
        for descendant in entry.get('descendants') or []:
            if not descendant.get('snapshotPath') and descendant.get('snapshotFile'):
                descendant['snapshotPath'] = normalize_snapshot_relpath(descendant.pop('snapshotFile'))
            elif descendant.get('snapshotPath'):
                descendant['snapshotPath'] = normalize_snapshot_relpath(descendant['snapshotPath'])
            child_path = descendant.get('snapshotPath')
            if child_path and (ROOT / child_path).is_file():
                descendant['snapshotSha256'] = sha256(ROOT / child_path)
        snapshot_path = entry.get('snapshotPath')
        if snapshot_path:
            path = ROOT / snapshot_path
            if path.is_file():
                entry['snapshotSha256'] = sha256(path)
        entry.setdefault('accessStatus', 'SNAPSHOT_VERIFIED' if snapshot_path or entry.get('descendants') else 'ACCESS_REQUIRED')
    mode = str(doc.get('inputMode') or '').upper()
    mode_aliases = {'CONFLUENCE': 'LINKS', 'FILE': 'FILES', 'FILES': 'FILES', 'LINK': 'LINKS', 'URL': 'LINKS'}
    doc['inputMode'] = mode_aliases.get(mode, mode if mode in {'UNSET','FILES','LINKS','MIXED','CONVERSATION_ONLY'} else ('FILES' if doc.get('entries') else 'UNSET'))
    doc.setdefault('setupStatus', 'IN_PROGRESS' if doc.get('entries') else 'NOT_STARTED')
    return doc


def normalize_special_document(rel: str, doc: dict) -> dict:
    if rel == 'product/ui-source.json':
        doc.setdefault('strategy', 'UNKNOWN')
        doc.setdefault('usageMode', 'UNDECIDED')
        doc.setdefault('status', 'UNKNOWN')
        doc.setdefault('location', None)
        doc.setdefault('selectedCandidateId', None)
        doc.setdefault('inspectedComponents', [])
        doc.setdefault('neutralFallbackApproved', False)
        doc.setdefault('temporary', False)
        doc.setdefault('evidenceRefs', [])
        doc.setdefault('candidates', [])
        doc.setdefault('notes', '')
    elif rel == 'product/ui-component-inventory.json':
        doc.setdefault('sourceStrategy', 'UNKNOWN')
        doc.setdefault('components', [])
        doc.setdefault('inspectedAt', None)
    elif rel == 'product/requirements-index.json':
        doc.setdefault('requirements', [])
        doc.setdefault('needsInput', [])
        doc.setdefault('errors', [])
        doc.setdefault('diagnostics', [])
    elif rel == 'product/completeness-report.json':
        doc.setdefault('domains', [])
        doc.setdefault('gates', {})
    elif rel == 'product/open-questions.json':
        doc.setdefault('questions', [])
    elif rel == 'product/phase-reviews.json':
        doc.setdefault('reviews', [])
    elif rel == 'product/evidence-register.json':
        doc.setdefault('evidence', [])
    elif rel == 'product/artifact-evidence.json':
        doc.setdefault('evidence', [])
    elif rel == 'product/conflict-register.json':
        doc.setdefault('conflicts', [])
    elif rel == 'work-queue.json':
        doc.setdefault('tasks', [])
    return doc

def enrich_evidence(doc: dict, requirements_index: dict, source_manifest: dict) -> dict:
    refs_to_domains: dict[str, set[str]] = {}
    for requirement in requirements_index.get('requirements', []):
        domain = requirement.get('domainId')
        for ref in requirement.get('evidenceRefs') or []:
            if domain:
                refs_to_domains.setdefault(ref, set()).add(domain)
    source_by_id = {item.get('id'): item for item in source_manifest.get('entries', []) if item.get('id')}
    for item in doc.get('evidence', []):
        item_id = item.get('id')
        domains = set(item.get('domainIds') or [])
        if item.get('domainId'):
            domains.add(item['domainId'])
        domains.update(refs_to_domains.get(item_id, set()))
        if not domains and item.get('recordedBy') == 'legacy-migration':
            # Old source evidence had no domain field. Preserve it as explicitly
            # global legacy evidence instead of failing with KeyError or guessing.
            domains.add('*')
        if domains:
            item['domainIds'] = sorted(domains)
            if len(domains) == 1:
                item['domainId'] = next(iter(domains))
        if item.get('type') == 'SOURCE_EXCERPT':
            snapshot = item.get('snapshotPath')
            if snapshot:
                path = ROOT / snapshot
                if path.is_file() and not item.get('snapshotSha256'):
                    item['snapshotSha256'] = sha256(path)
            source = source_by_id.get(item.get('sourceId'))
            snapshot_record = source_snapshot_record(source, item.get('snapshotPath', '')) if source else None
            if snapshot_record and not item.get('snapshotSha256'):
                item['snapshotSha256'] = snapshot_record.get('snapshotSha256')
            if not item.get('location'):
                item['location'] = item.get('pageTitle') or item.get('pageId') or 'legacy source excerpt'
            item.setdefault('verified', True)
    return doc



def ensure_domain_files() -> None:
    catalog = load('internal/domain-catalog.json')
    special_questions = {'prototypeDataSource': 'Q-PROTO-DATA-001'}
    for domain in catalog.get('domains', []):
        path = ROOT / domain['file']
        if path.exists():
            continue
        path.parent.mkdir(parents=True, exist_ok=True)
        question_id = special_questions.get(domain['id'], 'Q-AUTO-' + domain['id'].upper())
        path.write_text(
            f"# {domain['title']}\n\n"
            f"## NEEDS_INPUT: {domain['title']}\n\n"
            f"**ID вопроса:** {question_id}\n"
            f"**Область:** {domain['id']}\n"
            "**Статус:** Требуется решение\n\n"
            "Product Compiler 4.3 создал этот блок при миграции старого проекта. "
            "Замените его подтверждённым требованием, решением о неприменимости или точным ответом Product Manager.\n",
            encoding='utf-8',
            newline='\n',
        )

def main() -> int:
    parser = argparse.ArgumentParser(description='Привести JSON Product Compiler к контракту 4.3')
    parser.add_argument('--strict', action='store_true', help='Завершиться ошибкой при неполной структуре записей')
    args = parser.parse_args()

    ensure_domain_files()

    for rel in JSON_FILES:
        path = ROOT / rel
        if not path.exists():
            continue
        doc = load(rel)
        if rel == 'sources/source-manifest.json':
            doc = normalize_source_manifest(doc)
        doc = normalize_special_document(rel, doc)
        save(rel, doc, validate=False)

    index = load('product/requirements-index.json')
    manifest = load('sources/source-manifest.json')
    evidence = enrich_evidence(load('product/evidence-register.json'), index, manifest)
    save('product/evidence-register.json', evidence, validate=False)

    errors: list[str] = []
    if args.strict:
        for rel in JSON_FILES:
            path = ROOT / rel
            if not path.exists():
                continue
            doc = load(rel)
            errors.extend(f'{rel}: {error}' for error in validate_document(rel, doc, strict_items=True))
        if errors:
            for error in errors:
                print('ERROR:', error)
            return 1
    print(f'OK: JSON приведены к schemaVersion {SCHEMA_VERSION}')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
