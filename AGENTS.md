# Product Compiler 4.3

Сразу прочитай `PRODUCT-COMPILER.md`.

Нельзя придумывать требования, пропускать области, редактировать `project-state.json`, принимать найденный UI автоматически, создавать прототип до разрешённого этапа или формировать отчёты вне `reports/`.

Перед визуальным прототипом:

1. закрой все области gate `VISUAL_PROTOTYPE`;
2. зафиксируй требования через `tools/commit_requirements.py`;
3. создай и утверди отчёт PRODUCT_DEFINITION.

Перед рабочим прототипом отдельно подтверди стек и источник данных. Сразу подготовь `prototype-manifest.json` и полный `PROTOTYPE-RUNBOOK.md`.

Отчёт завершай только через `tools/finalize_phase_review.py`. После показа остановись и жди отдельного подтверждения Product Manager.
