# Контрольные отчёты

Все контрольные Markdown- и PDF-отчёты хранятся только здесь. `ai-artifacts/` для отчётов этапов не используется.

PDF и запись в `product/phase-reviews.json` создаются атомарно:

```bash
python tools/finalize_phase_review.py --phase <PHASE> --markdown reports/<name>.md
```
