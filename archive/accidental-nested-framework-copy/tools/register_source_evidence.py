#!/usr/bin/env python3
from __future__ import annotations

import argparse

from common import load, next_id, now, project_path, run_tool, save, sha256, source_snapshot_record

parser = argparse.ArgumentParser(description='Зарегистрировать проверенную выдержку из снимка источника')
parser.add_argument('--source-id', required=True)
parser.add_argument('--domain-id', required=True, action='append', dest='domain_ids', help='Можно повторить для нескольких областей')
parser.add_argument('--snapshot', required=True)
parser.add_argument('--location', required=True)
parser.add_argument('--excerpt', required=True)
args = parser.parse_args()

catalog = load('internal/domain-catalog.json')
known_domains = {item['id'] for item in catalog.get('domains', [])}
unknown = sorted(set(args.domain_ids) - known_domains)
if unknown:
    raise SystemExit('Неизвестные области требований: ' + ', '.join(unknown))
manifest = load('sources/source-manifest.json')
source = next((item for item in manifest.get('entries', []) if item.get('id') == args.source_id), None)
if not source:
    raise SystemExit('Источник не зарегистрирован')
snapshot_record = source_snapshot_record(source, args.snapshot)
if not snapshot_record:
    raise SystemExit('Путь снимка не зарегистрирован ни у источника, ни у его дочерних страниц')
path = project_path(args.snapshot, must_exist=True, allowed_root='sources/snapshots')
if sha256(path) != snapshot_record.get('snapshotSha256'):
    raise SystemExit('Снимок изменён после регистрации')
text = path.read_text(encoding='utf-8-sig', errors='replace')
if args.excerpt not in text:
    raise SystemExit('Выдержка не найдена в снимке. Подтверждение запрещено.')

doc = load('product/evidence-register.json')
evidence_id = next_id('SRC-EV', doc.get('evidence', []))
domain_ids = sorted(set(args.domain_ids))
entry = {
    'id': evidence_id,
    'type': 'SOURCE_EXCERPT',
    'domainIds': domain_ids,
    'sourceId': args.source_id,
    'snapshotPath': args.snapshot,
    'snapshotSha256': snapshot_record['snapshotSha256'],
    'location': args.location,
    'excerpt': args.excerpt,
    'createdAt': now(),
    'verified': True,
    'recordedBy': 'register_source_evidence.py',
}
if len(domain_ids) == 1:
    entry['domainId'] = domain_ids[0]
doc.setdefault('evidence', []).append(entry)
save('product/evidence-register.json', doc)
run_tool('sync_workspace.py')
print(evidence_id)
