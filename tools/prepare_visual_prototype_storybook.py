#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import shutil
from pathlib import Path

from common import ROOT, load, now, save


PRODUCT_VERSION = (ROOT / 'VERSION').read_text(encoding='utf-8').strip()


TARGET = (ROOT / 'visual-prototype-storybook').resolve()
REQUIRED_FILES = ('.storybook', 'package.json', 'src')
EXCLUDED_DIRS = {
    '.git', 'node_modules', 'docs', 'dist', 'build', 'storybook-static',
    'coverage', 'cypress', 'jest', 'media',
}


def source_path(value: str) -> Path:
    path = Path(value).expanduser().resolve()
    if not path.is_dir():
        raise SystemExit(f'Каталог исходников Storybook не найден: {path}')
    missing = [item for item in REQUIRED_FILES if not (path / item).exists()]
    if missing:
        raise SystemExit('В источнике отсутствуют обязательные элементы: ' + ', '.join(missing))
    stories = list((path / 'src').rglob('*.stories.*'))
    if not stories:
        raise SystemExit('В источнике не найдены исходники stories/components (*.stories.*)')
    return path


def copy_filtered(source: Path, target: Path) -> None:
    for item in source.iterdir():
        if item.name in EXCLUDED_DIRS:
            continue
        destination = target / item.name
        if item.is_dir():
            shutil.copytree(item, destination, dirs_exist_ok=True)
        else:
            shutil.copy2(item, destination)


def main() -> int:
    parser = argparse.ArgumentParser(description='Подготовить опциональный Storybook-прототип')
    parser.add_argument('--source', required=True, help='Каталог исходников, из которого собирается Storybook')
    parser.add_argument('--source-reference', required=True, help='Человеко-читаемая ссылка/описание источника')
    args = parser.parse_args()

    visual_manifest = load('visual-prototype/prototype-manifest.json')
    if visual_manifest.get('status') != 'READY' or (visual_manifest.get('smokeTest') or {}).get('status') != 'PASSED':
        raise SystemExit('Сначала завершите и проверьте visual-prototype')

    source = source_path(args.source)
    if TARGET.exists():
        for item in TARGET.iterdir():
            if item.name == 'README.md':
                continue
            if item.is_dir():
                shutil.rmtree(item)
            else:
                item.unlink()
    TARGET.mkdir(parents=True, exist_ok=True)
    copy_filtered(source, TARGET)
    product_dir = TARGET / 'src' / 'product'
    product_dir.mkdir(parents=True, exist_ok=True)
    (product_dir / 'README.md').write_text(
        '# Экранные stories продукта\n\nДобавляйте сюда stories экранов, используя компоненты из локальной копии источника UI.\n',
        encoding='utf-8',
    )
    manifest = {
        'productCompilerVersion': PRODUCT_VERSION,
        'status': 'READY',
        'sourceReference': args.source_reference,
        'sourcePath': str(source),
        'sourceType': 'STORYBOOK_SOURCES',
        'target': 'visual-prototype-storybook/',
        'requiredSourceParts': list(REQUIRED_FILES),
        'excludedDirectories': sorted(EXCLUDED_DIRS),
        'generatedAt': now(),
        'notes': 'Опциональный артефакт после visual-prototype; не влияет на переход к WORKING_PROTOTYPE.',
    }
    (TARGET / 'prototype-storybook-manifest.json').write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8'
    )
    kit_manifest = load('visual-prototype/prototype-kit/csi_ui-prototype-kit/source-manifest.json')
    kit_manifest.update({
        'status': 'READY',
        'source': str(source),
        'storybook': str(source / '.storybook'),
        'generatedAt': now(),
        'notes': 'Kit и Storybook подготовлены из источника, указанного Product Manager.',
    })
    save('visual-prototype/prototype-kit/csi_ui-prototype-kit/source-manifest.json', kit_manifest)
    print('Готово: visual-prototype-storybook подготовлен как опциональный артефакт')
    print(f'Источник: {source}')
    print('Экранные stories: visual-prototype-storybook/src/product/')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
