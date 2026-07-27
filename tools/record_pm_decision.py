#!/usr/bin/env python3
from __future__ import annotations
import argparse,re
from common import ROOT, load, next_id, now, run_tool, save
ap=argparse.ArgumentParser();ap.add_argument('--question-id',required=True);ap.add_argument('--domain-id',required=True);ap.add_argument('--decision',required=True);ap.add_argument('--message',required=True);ap.add_argument('--requirement-text');a=ap.parse_args()
run_tool('sync_workspace.py');questions=load('product/open-questions.json');q=next((x for x in questions.get('questions',[]) if x.get('id')==a.question_id),None)
if not q: raise SystemExit('Вопрос не зарегистрирован')
if q.get('domainId')!=a.domain_id: raise SystemExit('Область вопроса не совпадает')
if q.get('answerEvidenceRef'): raise SystemExit('Вопрос уже закрыт')
e=load('product/evidence-register.json');eid=next_id('PM-DEC',e.get('evidence',[]));e.setdefault('evidence',[]).append({'id':eid,'type':'PRODUCT_MANAGER_DECISION','questionId':a.question_id,'domainId':a.domain_id,'domainIds':[a.domain_id],'decision':a.decision,'exactUserMessage':a.message,'createdAt':now(),'recordedBy':'record_pm_decision.py'});save('product/evidence-register.json',e)
source=q.get('file');line=int(q.get('line') or 1)
if not source: raise SystemExit('У вопроса нет файла требования')
p=ROOT/source;lines=p.read_text(encoding='utf-8-sig').splitlines();start=max(0,line-1)
while start>0 and not lines[start].startswith('## '): start-=1
end=start+1
while end<len(lines) and not lines[end].startswith('## '): end+=1
idx=load('product/requirements-index.json');nums=[]
for x in idx.get('requirements',[]):
 m=re.fullmatch(r'REQ-DEC-(\d+)',str(x.get('id','')))
 if m: nums.append(int(m.group(1)))
rid=f'REQ-DEC-{max(nums or [0])+1:03d}';text=(a.requirement_text or a.message).strip()
block=[f'## {rid}. Решение Product Manager','',f'**Область:** {a.domain_id}','**Статус:** Подтверждено Product Manager',f'**Основание:** {eid}','**Применимость:** MVP1','',text,'','### Проверка',f'Реализация соответствует решению {eid}.']
p.write_text('\n'.join(lines[:start]+block+lines[end:]).rstrip()+'\n',encoding='utf-8',newline='\n')
for x in questions.get('questions',[]):
 if x.get('id')==a.question_id: x['status']='CLOSED';x['answerEvidenceRef']=eid;x['answeredAt']=now()
save('product/open-questions.json',questions);run_tool('sync_workspace.py',['--strict-json']);print(eid)
