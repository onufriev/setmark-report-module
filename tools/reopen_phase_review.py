#!/usr/bin/env python3
import argparse
from common import mark_phase_reviews_stale, run_tool
ap=argparse.ArgumentParser(description='Повторно открыть ревью этапа');ap.add_argument('--phase',required=True);ap.add_argument('--reason',required=True);a=ap.parse_args()
mark_phase_reviews_stale(a.phase,a.reason)
run_tool('sync_workspace.py')
print(f'{a.phase}: ревью повторно открыто')
