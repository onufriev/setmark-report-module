#!/usr/bin/env python3
from __future__ import annotations

import argparse

from common import load, next_id, now, run_tool, save


def main() -> int:
    parser = argparse.ArgumentParser(description='Зарегистрировать внутреннее противоречие')
    parser.add_argument('--title', required=True)
    parser.add_argument('--severity', choices=['BLOCKER', 'MAJOR', 'MINOR'], required=True)
    parser.add_argument('--statement', action='append', required=True)
    parser.add_argument('--notes', default='')
    args = parser.parse_args()
    if len(args.statement) < 2:
        raise SystemExit('Нужно минимум два противоречащих утверждения')
    doc = load('product/conflict-register.json')
    items = doc.setdefault('conflicts', [])
    item = {
        'id': next_id('CONFLICT', items),
        'title': args.title,
        'severity': args.severity,
        'status': 'OPEN',
        'statements': args.statement,
        'resolutionRefs': [],
        'notes': args.notes,
        'createdAt': now(),
    }
    items.append(item)
    save('product/conflict-register.json', doc)
    run_tool('sync_workspace.py')
    print(item['id'])
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
