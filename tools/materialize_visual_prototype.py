#!/usr/bin/env python3
from __future__ import annotations

import argparse
import html
import shutil
from pathlib import Path

from common import ROOT, load, now, run_tool, save

IMAGE_SUFFIXES = {'.png', '.jpg', '.jpeg', '.webp', '.gif'}
TARGET = ROOT / 'visual-prototype'
CONTENT = TARGET / 'content'


def external_path(value: str) -> Path:
    path = Path(value).expanduser()
    if not path.is_absolute():
        path = (Path.cwd() / path).resolve()
    else:
        path = path.resolve()
    if not path.exists():
        raise SystemExit(f'Источник не найден: {path}')
    return path


def clear_content() -> None:
    if CONTENT.exists():
        shutil.rmtree(CONTENT)
    index = TARGET / 'index.html'
    if index.exists():
        index.unlink()
    CONTENT.mkdir(parents=True, exist_ok=True)


def make_screenshot_gallery(images: list[Path]) -> None:
    cards = '\n'.join(
        f'<figure><img src="content/{html.escape(image.name)}" alt="Экран {position}"><figcaption>Экран {position}: {html.escape(image.stem)}</figcaption></figure>'
        for position, image in enumerate(images, start=1)
    )
    (TARGET / 'index.html').write_text(
        '<!doctype html><html lang="ru"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1">'
        '<title>Visual prototype</title><style>'
        'body{font-family:Arial,sans-serif;margin:0;padding:24px;background:#f5f6f8;color:#18202a}'
        'main{max-width:1200px;margin:auto}figure{background:white;padding:16px;border-radius:12px;margin:0 0 24px}'
        'img{display:block;max-width:100%;height:auto;margin:auto}figcaption{margin-top:10px;color:#52606d}'
        '</style></head><body><main><h1>Локальный визуальный прототип</h1>' + cards + '</main></body></html>',
        encoding='utf-8',
        newline='\n',
    )


def write_runbook(source_reference: str, mode: str, entrypoint: str) -> None:
    (TARGET / 'PROTOTYPE-RUNBOOK.md').write_text(f'''# Инструкция по визуальному прототипу

## 1. Состав прототипа

Локальная копия получена из `{source_reference}` в режиме `{mode}`. Точка входа: `{entrypoint}`.

## 2. Предварительные требования

- Python 3.10 или новее.
- Свободный локальный порт 8000.
- Команды одинаковы для Windows PowerShell, cmd, macOS и Linux.

## 3. Запуск

Из корня проекта выполните:

```text
python -m http.server 8000 --directory visual-prototype
```

Если команда `python` недоступна в Windows, используйте `py` с теми же аргументами.
Откройте `http://localhost:8000/`.

## 4. Демонстрационные данные

Источник визуального материала: `{source_reference}`. Локальные файлы находятся в `visual-prototype/content/`.
Изменение реальных систем и баз данных для просмотра не требуется.

## 5. Проверка основного сценария

1. Запустите локальный сервер.
2. Откройте главную страницу.
3. Проверьте наличие всех импортированных экранов или переходов.
4. Выполните `python tools/validate_visual_prototype.py --phase VISUAL_PROTOTYPE`.

## 6. Устранение проблем

- Ошибка порта: замените `8000` на свободный порт.
- Не загружаются ресурсы: повторите экспорт вместе с папкой assets и снова выполните materialize.
- Кириллица повреждена: убедитесь, что HTML содержит `<meta charset="utf-8">`.
- Внешняя ссылка недоступна: используйте локальные файлы из `visual-prototype/`.
''', encoding='utf-8', newline='\n')


def main() -> int:
    parser = argparse.ArgumentParser(description='Экспортировать внешний визуальный прототип в visual-prototype/')
    parser.add_argument('--phase', required=True, choices=['VISUAL_PROTOTYPE'])
    parser.add_argument('--mode', required=True, choices=['DIRECTORY', 'HTML_FILE', 'SCREENSHOTS'])
    parser.add_argument('--source', required=True, help='Локальный экспорт: каталог, HTML или изображения')
    parser.add_argument('--entrypoint', help='Относительный index.html внутри импортируемого каталога')
    parser.add_argument('--source-reference', help='Исходная Confluence/Figma/Storybook/другая ссылка или ID')
    parser.add_argument('--skip-evidence', action='store_true', help='Не регистрировать ART-EV автоматически')
    args = parser.parse_args()

    source = external_path(args.source)
    ui_source = load('product/ui-source.json')
    source_reference = args.source_reference or ui_source.get('location')
    if not source_reference:
        raise SystemExit('Укажите --source-reference или сначала выберите product/ui-source.json')
    clear_content()

    if args.mode == 'DIRECTORY':
        if not source.is_dir():
            raise SystemExit('Для DIRECTORY --source должен быть каталогом')
        shutil.copytree(source, CONTENT, dirs_exist_ok=True)
        entry_rel = args.entrypoint or 'index.html'
        imported_entry = CONTENT / entry_rel
        if not imported_entry.is_file():
            candidates = sorted(CONTENT.rglob('index.html'))
            if len(candidates) == 1:
                imported_entry = candidates[0]
            else:
                raise SystemExit('Не найден однозначный index.html; укажите --entrypoint')
        entrypoint = imported_entry.relative_to(ROOT).as_posix()
        data_location = 'visual-prototype/content/'
        interaction = 'CLICKABLE'
    elif args.mode == 'HTML_FILE':
        if not source.is_file() or source.suffix.lower() not in {'.html', '.htm'}:
            raise SystemExit('Для HTML_FILE нужен файл .html или .htm')
        shutil.copy2(source, TARGET / 'index.html')
        entrypoint = 'visual-prototype/index.html'
        data_location = 'visual-prototype/index.html'
        interaction = 'CLICKABLE'
    else:
        candidates = [source] if source.is_file() else sorted(
            item for item in source.iterdir() if item.is_file() and item.suffix.lower() in IMAGE_SUFFIXES
        )
        images = [item for item in candidates if item.suffix.lower() in IMAGE_SUFFIXES]
        if not images:
            raise SystemExit('Не найдены PNG/JPG/JPEG/WEBP/GIF скриншоты')
        copied = []
        for position, image in enumerate(images, start=1):
            destination = CONTENT / f'{position:02d}-{image.name}'
            shutil.copy2(image, destination)
            copied.append(destination)
        make_screenshot_gallery(copied)
        entrypoint = 'visual-prototype/index.html'
        data_location = 'visual-prototype/content/'
        interaction = 'STATIC_SCREENSHOTS'

    write_runbook(source_reference, args.mode, entrypoint)
    manifest = load('visual-prototype/prototype-manifest.json')
    manifest.update({
        'status': 'READY',
        'entryPoint': entrypoint,
        'startCommand': 'python -m http.server 8000 --directory visual-prototype',
        'dataMode': 'STATIC_FILE',
        'dataLocation': data_location,
        'runbookPath': 'visual-prototype/PROTOTYPE-RUNBOOK.md',
        'verificationCommand': 'python tools/validate_visual_prototype.py --phase VISUAL_PROTOTYPE',
        'sourceType': args.mode,
        'sourceReference': source_reference,
        'interactionLevel': interaction,
        'materializedAt': now(),
        'notes': 'Локальный экспорт. Внешняя ссылка не является единственным артефактом.',
    })
    save('visual-prototype/prototype-manifest.json', manifest)
    validation = run_tool('validate_visual_prototype.py', ['--phase', args.phase], allowed_returncodes={0, 1})
    if validation.returncode:
        print(validation.stdout, end='')
        print(validation.stderr, end='')
        return validation.returncode
    evidence_id = None
    if not args.skip_evidence:
        evidence = run_tool('register_artifact_evidence.py', [
            '--phase', 'VISUAL_PROTOTYPE',
            '--path', 'visual-prototype',
            '--type', 'visual-prototype',
            '--runbook', 'visual-prototype/PROTOTYPE-RUNBOOK.md',
            '--check', 'Создана локальная точка входа и сохранён источник прототипа',
            '--result', 'PASSED',
            '--command', 'python tools/validate_visual_prototype.py --phase VISUAL_PROTOTYPE',
            '--notes', f'Материализация из {source_reference} в режиме {args.mode}',
        ])
        evidence_id = evidence.stdout.strip().splitlines()[-1] if evidence.stdout.strip() else None
    else:
        run_tool('sync_workspace.py')
    suffix = f'; evidence={evidence_id}' if evidence_id else ''
    print(f'OK: визуальный прототип материализован; entryPoint={entrypoint}{suffix}')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
