#!/usr/bin/env python3
from __future__ import annotations
import argparse
from html.parser import HTMLParser
from urllib.parse import urlparse
from common import load, now, project_path, save
class Parser(HTMLParser):
 def __init__(self): super().__init__();self.links=[];self.ids=set();self.scripts=[];self.styles=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if a.get('id'): self.ids.add(a['id'])
  if tag=='a' and a.get('href'): self.links.append(a['href'])
  if tag=='script' and a.get('src'): self.scripts.append(a['src'])
  if tag=='link' and a.get('href'): self.styles.append(a['href'])
def target(base,value):
 u=urlparse(value)
 if u.scheme or u.netloc or value.startswith(('mailto:','javascript:')): return None
 return (base/u.path).resolve() if u.path else base
ap=argparse.ArgumentParser();ap.add_argument('--phase',required=True,choices=['VISUAL_PROTOTYPE']);a=ap.parse_args();errors=[]
m=load('visual-prototype/prototype-manifest.json')
for f in ('entryPoint','startCommand','url','runbookPath','uiSourceMode','applicationMode','requiredUserPath','smokeTest'):
 if not m.get(f): errors.append(f'Не заполнено поле {f}')
entry=project_path(m.get('entryPoint',''),must_exist=True,allowed_root='visual-prototype')
if entry.suffix.lower() not in {'.html','.htm'}: errors.append('entryPoint должен быть реальным HTML-файлом')
text=entry.read_text(encoding='utf-8-sig',errors='replace');p=Parser();p.feed(text)
for rel in [*p.links,*p.scripts,*p.styles]:
 t=target(entry.parent,rel)
 if t and not t.exists(): errors.append(f'Некорректная относительная ссылка: {rel}')
if not p.scripts: errors.append('Не найден подключённый JavaScript')
if not p.styles: errors.append('Не найден подключённый CSS')
for step in m.get('requiredUserPath',[]):
 href=step.get('href','');frag=urlparse(href).fragment
 if href not in p.links and frag not in p.ids: errors.append(f'Не работает обязательный переход: {step.get("label")} ({href})')
parts=[]
for x in entry.parent.rglob('*'):
 if x.is_file() and x.suffix.lower() in {'.html','.js','.css','.json','.md'}: parts.append(x.read_text(encoding='utf-8-sig',errors='ignore'))
workspace='\n'.join(parts)
if 'NEEDS_INPUT' in workspace or 'NEED_INPUTS' in workspace: errors.append('visual-prototype содержит незаполненный NEEDS_INPUT')
if m.get('applicationMode') in {'EXISTING_CLICKABLE_APP','GENERATED_PROTOTYPE'} and any(x in workspace.lower() for x in ('storybook-static','iframe.html','__storybook_','@storybook/')): errors.append('Приложение зависит от Storybook')
runbook=project_path(m.get('runbookPath',''),must_exist=True,allowed_root='visual-prototype').read_text(encoding='utf-8-sig')
if m.get('entryPoint') not in runbook or m.get('startCommand') not in runbook: errors.append('Runbook не соответствует фактическому entryPoint или команде запуска')
new_status='PASSED' if not errors else 'FAILED';new_details=errors or ['entrypoint, HTML/CSS/JS, ссылки и обязательный путь проверены'];current=m.get('smokeTest') or {};
if current.get('status') != new_status or current.get('details') != new_details:
 m['smokeTest']={'status':new_status,'checkedAt':now(),'details':new_details};save('visual-prototype/prototype-manifest.json',m)
if errors:
 print('ОШИБКИ:');print('\n'.join('- '+x for x in errors));raise SystemExit(1)
print('OK: визуальный прототип — кликабельное приложение; обязательный путь проверен')
