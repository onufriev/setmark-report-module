#!/usr/bin/env python3
import argparse
import subprocess
import sys

from common import ROOT, load, now, project_path, save, sha256, run_tool

parser = argparse.ArgumentParser()
parser.add_argument('--source-id', required=True)
parser.add_argument('--name', required=True)
parser.add_argument('--type', required=True)
parser.add_argument('--origin', required=True)
parser.add_argument('--snapshot', required=True)
args = parser.parse_args()

state = load('project-state.json')
if state.get('currentPhase') != 'SOURCE_SETUP':
    raise SystemExit('Источники можно регистрировать только на этапе SOURCE_SETUP')
snapshot = project_path(args.snapshot, must_exist=True, allowed_root='sources/snapshots')
if not snapshot.is_file() or not snapshot.read_text(encoding='utf-8', errors='replace').strip():
    raise SystemExit('Снимок источника должен быть непустым текстовым файлом')

doc = load('sources/source-manifest.json')
if any(item.get('id') == args.source_id for item in doc.get('entries', [])):
    raise SystemExit('Такой source-id уже существует')
doc.setdefault('entries', []).append({
    'id': args.source_id,
    'name': args.name,
    'type': args.type,
    'origin': args.origin,
    'snapshotPath': args.snapshot,
    'snapshotSha256': sha256(snapshot),
    'accessStatus': 'SNAPSHOT_VERIFIED',
    'registeredAt': now(),
    'registeredBy': 'register_source_snapshot.py',
})
origins = {
    'LINKS' if str(item.get('origin', '')).startswith(('http://', 'https://')) else 'FILES'
    for item in doc['entries']
}
doc['setupStatus'] = 'COMPLETED'
doc['inputMode'] = next(iter(origins)) if len(origins) == 1 else 'MIXED'
doc['completedAt'] = now()
save('sources/source-manifest.json', doc)
run_tool('sync_workspace.py')
print(f'OK: зарегистрирован {args.source_id}')
