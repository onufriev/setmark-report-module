# Product Compiler 4.3

Read `PRODUCT-COMPILER.md` immediately.

Never invent or silently omit a requirement domain. Use `NEEDS_INPUT` when information is missing. Before a visual prototype, pass the complete requirements gate and run `tools/commit_requirements.py`.

Do not edit `project-state.json`. Do not treat a discovered UI reference as selected. Store stage reports only in `reports/` and finalize them through `tools/finalize_phase_review.py`.

A visual or working prototype must include a local implementation, manifest, data description and complete runbook. A working prototype also requires an explicit data-source decision.
