# Контроль переходов

1. Агент создаёт Markdown в `reports/`.
2. `finalize_phase_review.py` запускает проверки, создаёт PDF и регистрирует ревизию.
3. `present_phase_review.py` готовит точные ссылки.
4. Агент показывает ссылки Product Manager.
5. `mark_phase_review_shown.py` фиксирует показ.
6. Агент останавливается.
7. Только отдельный ответ Product Manager разрешает `approve_phase_review.py`.
8. `sync_workspace.py` пересчитывает индекс, полноту и следующий этап из реестра утверждений.

Ручное изменение `project-state.json`, `phase-reviews.json` или пропуск этапа не имеют силы и выявляются валидатором.
