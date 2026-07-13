# ADR 071 — Contracts vs conventions; the tolerant-reader three-state rule

**Status**: accepted
**Date**: 2026-07-13
**Source**: `blueprints/thoughts/2026-07-13-fixed-structure-learning-curve.md` (藥方一 + 藥方二; the fork + the currency check are both in that thought, not re-derived here)

## Context

Paul's complaint: `shape`/`nav` carry a lot of fixed on-disk shape — the `blueprints/` tree, `plan.md`, file-top headers, the codebase map, `HANDOFF.md` — and using them feels like "you have to learn this whole filing religion first." The thought split the concern into a data layer (this ADR) and a verb layer (routing — explicitly out of scope here, still deferred per the matt-adoption scope call).

A quick inventory in the thought found that almost none of that fixed shape is actually enforced: `blueprints/` is scaffolded by `align` itself, headers are written by `sync` itself, the codebase map renders on demand, and `HANDOFF.md` is tolerated absent by `catchup`. The only structures with a real machine gate today are relay's thought frontmatter (`/relay:format` lints it) and the manifest/generated-artifact set (this repo's own gates 1–2, `validate-codex-skills.mjs`). Everything else is already, in principle, a convention — the learning-curve complaint is arguably that this "softness" isn't *visible*, not that the structures are actually rigid (rule ② read backwards: artifact-layer complexity leaking into the human interface).

The thought's own park A/B experiment (`docs/findings/2026-07-13-park-ab-experiment.md`) is direct evidence for the "soften, don't harden" direction: an unstructured notes file scored 19/20 against a structured `HANDOFF.md`'s 19/20 — content beats format standardization far more than format rigor buys accuracy.

## Decision

1. **Name the only three true contracts, once, in root `CLAUDE.md`.** ① relay thought frontmatter (`/relay:format` lints it), ② the manifest + generated-artifact set (gates 1–2, `validate-codex-skills.mjs`), ③ `docs/core/`'s freeze protocol (ADR-041, per-project). Everything else on disk is a **convention**: the writing verb scaffolds it, the reading verb tolerates it missing or reshaped. This turns "learn the whole filing religion" into "learn three things you must not hand-edit" — the rest is safe to leave alone, rearrange, or skip.
2. **State the tolerant-reader three-state rule as a standing convention**, not an implicit per-skill default: a verb reading a convention-owned structure must handle **standard shape** (consume), **non-standard/ad-hoc shape** (tolerate, consume what's readable), and **absent** (degrade gracefully, and **self-report which tier it read from** — so the user can calibrate trust). `plugins/reflect/skills/catchup/SKILL.md`'s existing "Consumption priority" section (HANDOFF.md, current or "possibly stale" → plan/thoughts family → pure git/files, each tier named in the reported output) is the canonical instance; it already did this, it just wasn't named as a repo-wide convention other skills should match.
3. **Instance check across four reader verbs** (`shape:align`, `shape:reconcile`, `shape:build`, `nav:plan`) confirmed which already state their absent/non-standard-shape behavior and which didn't:
   - `shape:align` — **already compliant**: Step 1 ("Locate or scaffold the tree — no separate init") explicitly scaffolds on first run and fills only what's missing on repeat runs. No change.
   - `nav:plan` — **already compliant**: explicit soft preference (`blueprints/plans/` when the tree exists, else `docs/plans/`, created if absent — ADR-012/017). No change.
   - `shape:reconcile` — **gap, now closed**: Step 1 named `blueprints/` but never stated what happens if it's absent. Added one sentence: report nothing-to-reconcile and point at `/shape:align` (the scaffolder) rather than inventing the tree.
   - `shape:build` — **gap, now closed**: the per-item loop assumed `plan.md` already exists. Added one sentence: if it's absent, report there's no board to drive and point at `/shape:align`, rather than guessing at items.

## Why

- The learning-curve complaint is best read as a *documentation/visibility* problem, not a *structural* one — the fix is naming what's already true (most structure is soft), not loosening anything that was actually load-bearing.
- Contracts need a machine gate or they aren't really contracts; conventions need a tolerant reader or the "soft" claim is just a description nobody enforces. Both halves of the fork needed a concrete rule, not just a label.
- Fixing `reconcile`/`build` with one sentence each (rather than a rewrite) matches the existing bar: `align`/`nav:plan` show the fix is usually this cheap once the convention is named.

## Consequences

- Root `CLAUDE.md`: two new Authoring-conventions bullets — "★ Contracts vs conventions" and "★ Tolerant reader — three states, self-reported."
- `plugins/shape/skills/reconcile/SKILL.md`: one sentence added to Step 1 (absent-tree degrade path).
- `plugins/shape/skills/build/SKILL.md`: one sentence added at the top of "The per-item loop" (absent-`plan.md` degrade path).
- `plugins/shape/skills/align/SKILL.md`, `plugins/nav/skills/plan/SKILL.md`: unchanged — already compliant.
- `blueprints/thoughts/2026-07-13-fixed-structure-learning-curve.md`: 藥方一/二 marked landed here; 藥方三 (表述翻轉) explicitly still riding on the description-diet rollout, not landed; the open "concrete pain-case" question stays open.
- shape plugin version bumps for the `reconcile`/`build` SKILL.md edits (patch); manifests/site map regenerated accordingly.

## Notes

- 藥方三（表述翻轉，讓 SKILL.md/README 意圖先行）is deliberately **not** landed here — the thought itself scoped it to ride the description-diet rollout (ADR-065's pilot → marketplace-wide decision), so it has an owner already and doesn't need a second one.
- The verb-layer question (router / lifecycle buckets) stays out of scope per the thought's own framing — it was deferred at the matt-adoption scope call and this ADR doesn't reopen it.
