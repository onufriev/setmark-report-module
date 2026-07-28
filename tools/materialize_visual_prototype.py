#!/usr/bin/env python3
from __future__ import annotations
import argparse, shutil
from pathlib import Path
from common import ROOT, load, mark_phase_reviews_stale, now, run_tool, save

TARGET=(ROOT/'visual-prototype').resolve()
PATH=[
 {'id':'overview','label':'Обзор сети','href':'#overview'},
 {'id':'priority','label':'Критические инциденты с риском автоштрафа','href':'#priority'},
 {'id':'incidents','label':'Список инцидентов','href':'#incidents'},
 {'id':'incident','label':'Карточка инцидента','href':'#incident/INC-10482'},
 {'id':'analytics','label':'Аналитика и выгрузка','href':'#analytics'},
]

def ext(value):
 p=Path(value).expanduser().resolve()
 if not p.exists(): raise SystemExit(f'Источник не найден: {p}')
 return p

def clear_target():
 expected=(ROOT/'visual-prototype').resolve()
 if TARGET!=expected or TARGET.parent!=ROOT.resolve(): raise SystemExit('Небезопасная целевая директория очистки')
 for item in TARGET.iterdir():
  if item.name=='README.md': continue
  shutil.rmtree(item) if item.is_dir() else item.unlink()

def storybook(path):
 names=' '.join(x.relative_to(path).as_posix().lower() for x in path.rglob('*'))
 return [m for m in ('storybook-static','stories.json','iframe.html','@storybook','__storybook_') if m in names]

def runbook(source,ui_source_mode,application_mode,entry,start,url):
 steps='\n'.join(f'{i}. {x["label"]}: `{x["href"]}`' for i,x in enumerate(PATH,1))
 (TARGET/'PROTOTYPE-RUNBOOK.md').write_text(f'''# Инструкция по визуальному прототипу

## 1. Состав прототипа
Источник UI: `{ui_source_mode}`. Источник приложения: `{application_mode}`. Материализованный источник: `{source}`. Реальный entryPoint: `{entry}`.

## 2. Предварительные требования
- Python 3.10+ на Windows, macOS или Linux.
- Свободный порт 8000.

## 3. Запуск
Из корня проекта: `{start}`. Открыть `{url}`.

## 4. Демонстрационные данные
Используются локальные статические данные внутри `visual-prototype/`.

## 5. Проверка основного сценария
{steps}

Проверка: `python tools/validate_visual_prototype.py --phase VISUAL_PROTOTYPE`.

## 6. Устранение проблем
Проверьте entryPoint, относительные ссылки и отсутствие Storybook-зависимостей.
''',encoding='utf-8',newline='\n')

def main():
 ap=argparse.ArgumentParser(description='Материализовать кликабельное приложение')
 ap.add_argument('--phase',required=True,choices=['VISUAL_PROTOTYPE'])
 ap.add_argument('--mode',required=True,choices=['DIRECTORY','HTML_FILE'])
 ap.add_argument('--application-mode',choices=['EXISTING_CLICKABLE_APP','GENERATED_PROTOTYPE'])
 ap.add_argument('--source',required=True);ap.add_argument('--entrypoint');ap.add_argument('--source-reference');ap.add_argument('--skip-evidence',action='store_true')
 a=ap.parse_args();source=ext(a.source);ui=load('product/ui-source.json')
 ui_source_mode=ui.get('sourceMode')
 application_mode=a.application_mode or ui.get('applicationMode')
 if ui_source_mode not in {'FIGMA','COMPONENT_LIBRARY','STORYBOOK'}:
  raise SystemExit('Сначала выберите источник UI: FIGMA, COMPONENT_LIBRARY или STORYBOOK')
 if application_mode not in {'EXISTING_CLICKABLE_APP','GENERATED_PROTOTYPE'}:
  raise SystemExit('Укажите --application-mode или зарегистрируйте applicationMode в product/ui-source.json')
 reference=a.source_reference or str(source)
 manifest=load('visual-prototype/prototype-manifest.json')
 markers=storybook(source if source.is_dir() else source.parent)
 if markers:
  raise SystemExit('ПРЕДУПРЕЖДЕНИЕ: материализуемый каталог похож на Storybook/каталог компонентов, а не на готовое приложение. Storybook допустим только как источник UI; передайте отдельное кликабельное приложение.')
 clear_target();assets=TARGET/'assets';assets.mkdir()
 if a.mode=='HTML_FILE':
  if source.suffix.lower() not in {'.html','.htm'}: raise SystemExit('Нужен HTML-файл')
  shutil.copy2(source,TARGET/'index.html');entry='visual-prototype/index.html'
 else:
  if not source.is_dir(): raise SystemExit('Нужен каталог')
  shutil.copytree(source,TARGET/'app',dirs_exist_ok=True)
  candidate=TARGET/'app'/(a.entrypoint or 'index.html')
  if not candidate.is_file():
   found=list((TARGET/'app').rglob('index.html'))
   if len(found)!=1: raise SystemExit('Не найден однозначный entrypoint; укажите --entrypoint')
   candidate=found[0]
  entry=candidate.relative_to(ROOT).as_posix()
 start='python -m http.server 8000 --directory visual-prototype';url='http://localhost:8000/'+entry.removeprefix('visual-prototype/')
 runbook(reference,ui_source_mode,application_mode,entry,start,url)
 m=manifest;m.update({'status':'READY','entryPoint':entry,'startCommand':start,'url':url,'dataMode':'STATIC_FILE','dataLocation':'visual-prototype/','runbookPath':'visual-prototype/PROTOTYPE-RUNBOOK.md','verificationCommand':'python tools/validate_visual_prototype.py --phase VISUAL_PROTOTYPE','sourceType':a.mode,'uiSourceMode':ui_source_mode,'applicationMode':application_mode,'sourceMode':application_mode,'sourceReference':reference,'interactionLevel':'CLICKABLE','requiredUserPath':PATH,'storybookDetected':False,'materializedAt':now(),'smokeTest':{'status':'PENDING','checkedAt':None,'details':[]}});save('visual-prototype/prototype-manifest.json',m)
 stale=mark_phase_reviews_stale('VISUAL_PROTOTYPE','Артефакт visual-prototype переработан')
 result=run_tool('validate_visual_prototype.py',['--phase','VISUAL_PROTOTYPE'],allowed_returncodes={0,1});print(result.stdout,end='')
 if result.returncode:return result.returncode
 m=load('visual-prototype/prototype-manifest.json')
 if not a.skip_evidence: run_tool('register_artifact_evidence.py',['--phase','VISUAL_PROTOTYPE','--path','visual-prototype','--type','visual-prototype','--runbook','visual-prototype/PROTOTYPE-RUNBOOK.md','--check','Обязательный путь кликабелен','--result','PASSED','--command','python tools/validate_visual_prototype.py --phase VISUAL_PROTOTYPE'])
 else: run_tool('sync_workspace.py')
 print(f'Источник UI: {ui_source_mode}\nИсточник приложения: {application_mode}\nentryPoint: {m["entryPoint"]}\nКоманда запуска: {m["startCommand"]}\nURL: {m["url"]}\nОбязательный путь: '+ ' → '.join(x['label'] for x in m['requiredUserPath'])+f'\nSmoke-test: {m["smokeTest"]["status"]}')
 if stale: print('Устаревшие ревью: '+', '.join(stale))
 return 0
if __name__=='__main__': raise SystemExit(main())
