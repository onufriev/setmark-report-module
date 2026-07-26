# Выбор технологического стека

## Когда обсуждается стек

До этапа `WORKING_PROTOTYPE` технологический стек:

- не запрашивается у Product Manager;
- не выбирается Product Compiler;
- не добавляется как подтверждённое решение;
- не влияет на `INTAKE`, `PRODUCT_DEFINITION`, `VISUAL_PROTOTYPE` и `VISUAL_VALIDATION`.

После перехода в `WORKING_PROTOTYPE` Product Compiler обязан сначала проверить `product/technology-stack.json`.

Если решение не подтверждено, Product Compiler обязан:

1. показать стандартный стек CSI;
2. спросить, использовать ли его или нужен другой стек;
3. явно написать, что стандартный стек пока только рекомендация;
4. остановиться;
5. не создавать код, конфигурацию, схему БД, API или инфраструктуру рабочего прототипа до ответа Product Manager.

## Стандартный стек CSI

### Backend

- Java 21;
- Spring Boot 4.x;
- Gradle Wrapper.

### Frontend

- React 18/19;
- TypeScript 6.0.x.

### Database

- PostgreSQL 18;
- Flyway.

### Infrastructure

- Docker;
- Docker Compose.

### API

- OpenAPI.

## Обязательный вопрос

Формулировка по умолчанию:

> Для работающего прототипа предлагаю стандартный стек CSI: Java 21, Spring Boot 4.x, Gradle Wrapper, React 18/19, TypeScript 6.0.x, PostgreSQL 18, Flyway, Docker, Docker Compose и OpenAPI. Используем его или требуется другой стек?

До ответа Product Manager статус решения должен оставаться `Требуется решение`.

## Что считается подтверждением

Стек считается выбранным только если:

- точный ответ Product Manager зарегистрирован как `PM-DEC-*` через `tools/record_stack_decision.py`;
- ID решения записан в `product/technology-stack.json` в `evidenceRefs`;
- поле `status` имеет значение `Подтверждено Product Manager` или `Временно принято Product Manager`;
- поле `selectedStack` содержит только то, что явно подтвердил Product Manager.

Фразы Product Compiler, значения по умолчанию и наличие этого файла не являются подтверждением.

## Запреты

Product Compiler запрещено:

- молча применять стандартный стек CSI;
- считать отсутствие ответа согласием;
- выбирать более удобный стек самостоятельно;
- создавать минимальную реализацию на другом стеке «для скорости»;
- продолжать разработку рабочего прототипа при статусе `Требуется решение`;
- записывать `AI-PROP-*` как основание выбора стека.


## Команды регистрации

Стандартный стек:

```text
python tools/record_stack_decision.py --selection standard --message "<точный ответ Product Manager>"
```

Другой стек:

```text
python tools/record_stack_decision.py --selection custom --selected-stack-json '{"backend":["..."],"frontend":["..."]}' --message "<точный ответ Product Manager>"
```

## Источник данных рабочего прототипа

Выбор стека не заменяет выбор данных. До создания реализации также необходимо:

1. задать вопрос `Q-PROTO-DATA-001`;
2. зарегистрировать решение через `tools/record_prototype_data_source.py`;
3. заменить соответствующий `NEEDS_INPUT` в требованиях;
4. заново зафиксировать baseline требований;
5. перенести тип источника, расположение, команды наполнения и проверки в `prototype/PROTOTYPE-RUNBOOK.md` и `prototype/prototype-manifest.json`.

Допустимые типы: реальный объект, ручной ввод, SQL-скрипт, CSV, эмулятор, Postman-коллекция, API или явно описанный иной вариант.
