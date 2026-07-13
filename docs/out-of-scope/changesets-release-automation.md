# Rejected: Changesets-based release automation

**Rejected proposal**: adopting [Changesets](https://github.com/changesets/changesets) (or an equivalent changelog/version-bump automation tool) to automate this marketplace's release/versioning workflow, considered as part of the `mattpocock/skills` comparative-adoption research on 2026-07-13.

**Reason**: the same-day comparative research judged it low-yield for this repo — the existing single-owner version gate (`plugins/<name>/.claude-plugin/plugin.json` + `scripts/build-manifests.mjs` + `scripts/validate-codex-skills.mjs`) already mechanically enforces version consistency across manifests; Changesets would add a second versioning mechanism without solving a problem the current gate leaves open.

**Source**: `blueprints/plans/2026-07-13-matt-skills-adoption.md`, "Out of scope (本計畫刻意不做)" section — "**Changesets 發布自動化**——比較報告已判定低收益，不採。" ("Changesets release automation — the comparison report judged it low-yield, not adopted.")

**Date**: 2026-07-13.
