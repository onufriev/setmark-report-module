# Инструкция по визуальному прототипу

## 1. Состав прототипа
Источник UI: `COMPONENT_LIBRARY`. Источник приложения: `GENERATED_PROTOTYPE`. Материализованный источник: `Сгенерированный прототип на основе @crystalservice/csi_ui и актуального frontend Set Mark`. Реальный entryPoint: `visual-prototype/app/index.html`. Визуальная основа: `visual-prototype/prototype-kit/csi_ui-prototype-kit/`.

## 2. Предварительные требования
- Python 3.10+ на Windows, macOS или Linux.
- Свободный порт 8000.

## 3. Запуск
Из корня проекта: `python -m http.server 8000 --directory visual-prototype`. Открыть `http://localhost:8000/app/index.html`.

## 4. Демонстрационные данные
Используются локальные статические данные внутри `visual-prototype/`.

## 5. Проверка основного сценария
1. Обзор сети: `#overview`
2. Критические инциденты с риском автоштрафа: `#priority`
3. Список инцидентов: `#incidents`
4. Карточка инцидента: `#incident/INC-10482`
5. Аналитика и выгрузка: `#analytics`

Проверка: `python tools/validate_visual_prototype.py --phase VISUAL_PROTOTYPE`.

## 6. Устранение проблем
Проверьте entryPoint, относительные ссылки и отсутствие Storybook-зависимостей.
