#!/usr/bin/env python3
import argparse
import subprocess
import sys

from common import ROOT, load, now, save, run_tool

parser = argparse.ArgumentParser()
parser.add_argument('--mode', required=True, choices=['CONVERSATION_ONLY', 'FILES', 'LINKS', 'MIXED'])
args = parser.parse_args()
state = load('project-state.json')
if state.get('currentPhase') != 'SOURCE_SETUP':
    raise SystemExit('Режим источников можно выбирать только на этапе SOURCE_SETUP')
doc = load('sources/source-manifest.json')
doc['inputMode'] = args.mode
if args.mode == 'CONVERSATION_ONLY':
    doc['setupStatus'] = 'COMPLETED'
    doc['completedAt'] = now()
elif doc.get('entries'):
    doc['setupStatus'] = 'COMPLETED'
    doc['completedAt'] = now()
else:
    doc['setupStatus'] = 'IN_PROGRESS'
save('sources/source-manifest.json', doc)
run_tool('sync_workspace.py')
print('OK')
