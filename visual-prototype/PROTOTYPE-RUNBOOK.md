# Инструкция по визуальному прототипу

## 1. Состав прототипа
Источник UI: `COMPONENT_LIBRARY`. Переиспользуемая визуальная основа: `visual-prototype/prototype-kit/csi_ui-prototype-kit/`, собранная по `@crystalservice/csi_ui` v1.31.2 и Storybook. Источник приложения: `GENERATED_PROTOTYPE`. Реальный entryPoint: `visual-prototype/app/index.html`.

## 2. Предварительные требования
- Современный браузер.

## 3. Запуск
`Открыть файл visual-prototype/app/index.html двойным кликом`.

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
Проверьте entryPoint, относительные ссылки и соответствие `visual-prototype/prototype-kit/csi_ui-prototype-kit/source-manifest.json` версии CSI UI.
