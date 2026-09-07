#!/usr/bin/env python3
from __future__ import annotations

import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
REQ_ROOT = ROOT / "requirements"
OUT = ROOT / "handoff" / "requirements"

EXPECTED = [
    "00-architect-and-lead-start-here.md",
    "01-product-scope.md",
    "02-system-context-and-boundaries.md",
    "03-domain-model-and-rules.md",
    "04-user-flows-and-ui.md",
    "05-data-and-integrations.md",
    "06-capabilities-and-acceptance.md",
    "07-nonfunctional-and-operations.md",
    "08-traceability.md",
]

ROUTES = {
    "01-product-scope.md": [
        "01-base/product-context.md",
        "01-base/goals-and-scope.md",
        "01-base/sales-objects.md",
        "01-base/market-assessment.md",
    ],
    "02-system-context-and-boundaries.md": [
        "03-architecture/technical-constraints.md",
        "03-architecture/hardware-requirements.md",
    ],
    "03-domain-model-and-rules.md": [
        "02-system/entities-and-data.md",
        "02-system/business-rules.md",
        "02-system/states-and-errors.md",
    ],
    "04-user-flows-and-ui.md": [
        "02-system/roles-and-permissions.md",
        "03-architecture/component-source.md",
        "07-scenarios/user-journeys.md",
        "07-scenarios/business-scenarios.md",
    ],
    "05-data-and-integrations.md": [
        "05-integrations/data-requirements.md",
        "05-integrations/integrations.md",
        "06-system-scenarios/system-scenarios.md",
    ],
    "06-capabilities-and-acceptance.md": [
        "02-system/system-requirements.md",
        "08-acceptance/acceptance-criteria.md",
        "08-acceptance/validation-success.md",
    ],
    "07-nonfunctional-and-operations.md": [
        "04-quality/quality-requirements.md",
        "04-quality/localization-requirements.md",
        "04-quality/accessibility-requirements.md",
        "06-system-scenarios/exception-scenarios.md",
        "06-system-scenarios/operational-scenarios.md",
    ],
    "08-traceability.md": [
        "09-traceability/traceability.md",
    ],
}

TITLES = {
    "01-product-scope.md": "Продукт, цели и границы",
    "02-system-context-and-boundaries.md": "Системный контекст и границы реализации",
    "03-domain-model-and-rules.md": "Предметная модель, состояния и бизнес-правила",
    "04-user-flows-and-ui.md": "Пользователи, сценарии и интерфейс",
    "05-data-and-integrations.md": "Данные, интеграции и системная обработка",
    "06-capabilities-and-acceptance.md": "Возможности и приёмка",
    "07-nonfunctional-and-operations.md": "Нефункциональные и эксплуатационные требования",
    "08-traceability.md": "Трассировка",
}

META = re.compile(r"^\*\*(Область|Статус|Основание|Применимость|ID вопроса):\*\*")
REQ_HEAD = re.compile(r"^## (REQ-[A-Z]+-\d+)\.\s*(.*)$")


def parse_requirements(relative: str) -> list[dict[str, object]]:
    path = REQ_ROOT / relative
    lines = path.read_text(encoding="utf-8-sig").splitlines()
    result: list[dict[str, object]] = []
    current: dict[str, object] | None = None
    for line in lines:
        match = REQ_HEAD.match(line)
        if match:
            if current:
                result.append(current)
            current = {
                "id": match.group(1),
                "title": match.group(2).strip(),
                "source": relative,
                "applicability": "MVP1",
                "lines": [],
            }
            continue
        if current is None:
            continue
        if line.startswith("**Применимость:**"):
            current["applicability"] = line.split(":**", 1)[1].strip()
            continue
        if META.match(line):
            continue
        cast_lines = current["lines"]
        assert isinstance(cast_lines, list)
        cast_lines.append(line)
    if current:
        result.append(current)
    for item in result:
        lines = list(item["lines"])
        while lines and not lines[0].strip():
            lines.pop(0)
        while lines and not lines[-1].strip():
            lines.pop()
        item["lines"] = lines
    return result


def render_requirement(item: dict[str, object]) -> str:
    lines = list(item["lines"])
    normalized: list[str] = []
    for line in lines:
        if line == "### Проверка":
            normalized.extend(["", "**Как проверить**"])
        else:
            normalized.append(line)
    while normalized and not normalized[-1].strip():
        normalized.pop()
    body = "\n".join(normalized)
    return f"### {item['id']}. {item['title']}\n\n{body}".rstrip()


def section_for(items: list[dict[str, object]], future: bool) -> str:
    selected = []
    for item in items:
        applicability = str(item["applicability"]).lower()
        is_future = "следующ" in applicability
        if is_future == future:
            selected.append(item)
    if not selected:
        return "_Требований в этой группе нет._"
    return "\n\n".join(render_requirement(item) for item in selected)


def compile_group(name: str, relative_files: list[str]) -> tuple[str, list[dict[str, object]]]:
    items: list[dict[str, object]] = []
    for relative in relative_files:
        items.extend(parse_requirements(relative))
    intro = (
        "Этот документ собран из канонического каталога `requirements/`. Он предназначен "
        "для чтения командой реализации и не заменяет канонические требования."
    )
    content = [
        f"# {TITLES[name]}",
        "",
        intro,
        "",
        "## MVP",
        "",
        section_for(items, future=False),
        "",
        "## Следующий этап",
        "",
        section_for(items, future=True),
        "",
    ]
    return "\n".join(content), items


def start_here() -> str:
    return """# Начало работы архитектора и лида

## Что создаётся

Мониторинг маркировки развивается как дополнительная функция Set Mark. В MVP
интерфейс размещается в текущем Журнале нарушений, не меняя его существующие функции.
Источником факта отклонения является ЛК Честного знака через True API; Журнал
нарушений, чек, результаты проверок и настройки используются для обогащения.

## Этапы MVP

1. **Контроль отклонений Честного знака.** Самостоятельный выпуск с подключением ЭЦП,
   ручной синхронизацией, Обзором, Инцидентами, исходной карточкой ЧЗ, критичностью,
   поиском, фильтрами и группировками.
2. **Обогащённый разбор инцидента.** Самостоятельное расширение с сопоставлением ЖН,
   чека, проверок и исторических настроек. После него достигнут полный состав MVP.

Каждый этап должен быть пригоден для эксплуатации, не содержать заглушек в доступных
функциях и пройти отдельную приёмку на реальном подключении ЛК ЧЗ. Автоматический
анализ, рекомендации, отдельные Аналитика и Необходимые действия, CSV, PDF и
уведомления относятся к следующему этапу развития.

## Критические правила

- Мониторинг доступен только для `setmark.country=RU`.
- Одно релевантное отклонение True API создаёт один инцидент.
- Код марки сопоставляется по вхождению; окно ±5 минут считается точным совпадением.
- Онлайн ЧЗ и Set Mark проверяются параллельно, затем касса принимает решение и
  совершает фактическое действие.
- В MVP отдельной ролевой модели нет: функции доступны пользователю текущего ЖН.
- Синтетические данные и эмуляция True API не используются; полная приёмка требует
  реального подключения и рабочей ЭЦП.
- Мониторинг не добавляет синхронных вызовов в кассовый процесс и не должен ухудшать
  его показатели сверх утверждённых пределов.

## Порядок чтения

1. [Продукт, цели и границы](01-product-scope.md)
2. [Системный контекст](02-system-context-and-boundaries.md)
3. [Предметная модель и правила](03-domain-model-and-rules.md)
4. [Пользователи, сценарии и UI](04-user-flows-and-ui.md)
5. [Данные и интеграции](05-data-and-integrations.md)
6. [Возможности и приёмка](06-capabilities-and-acceptance.md)
7. [Нефункциональные и эксплуатационные требования](07-nonfunctional-and-operations.md)
8. [Трассировка](08-traceability.md)

Канонические решения обозначены ссылочными идентификаторами `REQ-*`. При спорной
детали следует открыть соответствующее требование в `requirements/`.
"""


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    actual = {path.name for path in OUT.glob("*.md")}
    unexpected = actual - set(EXPECTED)
    if unexpected:
        raise SystemExit(f"Неожиданные Markdown-файлы handoff: {sorted(unexpected)}")

    all_items: list[dict[str, object]] = []
    (OUT / EXPECTED[0]).write_text(start_here(), encoding="utf-8", newline="\n")
    for name in EXPECTED[1:]:
        content, items = compile_group(name, ROUTES[name])
        all_items.extend(items)
        (OUT / name).write_text(content, encoding="utf-8", newline="\n")

    index_lines = [
        "",
        "## Индекс канонических требований",
        "",
        "| Требование | Канонический файл | Раздел handoff |",
        "|---|---|---|",
    ]
    output_by_source = {
        source: output
        for output, sources in ROUTES.items()
        for source in sources
    }
    for item in sorted(all_items, key=lambda value: str(value["id"])):
        source = str(item["source"])
        output = output_by_source[source]
        index_lines.append(
            f"| `{item['id']}` | `requirements/{source}` | [{TITLES[output]}]({output}) |"
        )
    trace_path = OUT / "08-traceability.md"
    trace_path.write_text(
        trace_path.read_text(encoding="utf-8") + "\n".join(index_lines) + "\n",
        encoding="utf-8",
        newline="\n",
    )

    (ROOT / "handoff" / "README.md").write_text(
        """# Итоговые материалы для разработки

Handoff — производное человекочитаемое представление утверждённых требований. Он
предназначен для архитектора, лида, разработчиков и QA и не является источником
требований.

Начните с [DEVELOPER-START-HERE.md](DEVELOPER-START-HERE.md), затем используйте
[requirements/00-architect-and-lead-start-here.md](requirements/00-architect-and-lead-start-here.md).

Канонические требования находятся только в `requirements/`. Материалы прототипа,
служебные решения и исходные клиентские комментарии в handoff не включаются.
""",
        encoding="utf-8",
        newline="\n",
    )
    (ROOT / "handoff" / "DEVELOPER-START-HERE.md").write_text(
        """# Старт для команды разработки

1. Прочитайте [обзор продукта и этапов](requirements/00-architect-and-lead-start-here.md).
2. Согласуйте границы первого самостоятельного выпуска по
   [продукту и границам](requirements/01-product-scope.md).
3. Проверьте контракты и владение данными в
   [системном контексте](requirements/02-system-context-and-boundaries.md) и
   [данных и интеграциях](requirements/05-data-and-integrations.md).
4. Используйте [возможности и приёмку](requirements/06-capabilities-and-acceptance.md)
   как карту проверяемого результата, а
   [нефункциональные требования](requirements/07-nonfunctional-and-operations.md) —
   как обязательную часть каждого выпуска.
5. При спорной детали переходите по `REQ-*` из
   [трассировки](requirements/08-traceability.md) к каноническому файлу.

Handoff не заменяет `requirements/` и не используется для изменения требований.
Технические решения, отсутствующие в канонических требованиях, принимает команда
разработки и фиксирует отдельно.
""",
        encoding="utf-8",
        newline="\n",
    )
    (ROOT / "handoff" / "HANDOFF.md").write_text(
        """# Передача продукта в разработку

Передаётся MVP функции Мониторинга маркировки Set Mark, разбитый на два
самостоятельных законченных продуктовых этапа:

1. Контроль отклонений Честного знака.
2. Обогащённый разбор инцидента.

Полная картина продукта собрана в каталоге [requirements](requirements/). Начальная
точка чтения — [DEVELOPER-START-HERE.md](DEVELOPER-START-HERE.md).

Каноническим источником остаётся корневой каталог `requirements/`. Этот handoff —
производное представление для архитектора, лида, разработчиков и QA. Материалы
рабочего прототипа не включены. Технологический стек и производственные технические
решения, не закреплённые требованиями, определяет команда разработки.
""",
        encoding="utf-8",
        newline="\n",
    )


if __name__ == "__main__":
    main()
