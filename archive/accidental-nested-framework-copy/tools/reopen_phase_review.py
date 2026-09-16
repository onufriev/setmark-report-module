#!/usr/bin/env python3
import argparse
from common import load, mark_phase_reviews_stale, now, run_tool, save
ap=argparse.ArgumentParser(description='Повторно открыть ревью этапа');ap.add_argument('--phase',required=True);ap.add_argument('--reason',required=True);a=ap.parse_args()
mark_phase_reviews_stale(a.phase,a.reason)
doc=load('product/phase-reviews.json');existing=[x for x in doc.get('reviews',[]) if x.get('phase')==a.phase];rev=max([int(x.get('revision') or 0) for x in existing] or [0])+1;rid=f'{a.phase}-R{rev}'
doc.setdefault('reviews',[]).append({'reviewId':rid,'phase':a.phase,'revision':rev,'status':'STALE_REVIEW','preparedAt':now(),'registeredBy':'reopen_phase_review.py','shownToProductManagerAt':None,'markdownReport':None,'markdownSha256':None,'pdfReport':None,'pdfSha256':None,'nextPhase':None,'approvedAt':None,'approvedBy':None,'decisionText':None,'exactUserMessage':None,'staleAt':now(),'staleReason':a.reason});save('product/phase-reviews.json',doc);run_tool('sync_workspace.py');print(rid)
