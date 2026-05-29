# ADR 017 — `nav:plan` writes its grounded plan into `blueprints/plans/`; `reconcile` maintains it

**Status**: accepted
**Date**: 2026-05-29
**Plugins**: `nav` (plan) + `shape` (blueprints convention, reconcile)
**Extends**: [ADR-012](docs/adr/012-nav-plan-offers-visual-summary.md) (the hard/soft cross-plugin rule) and the blueprints hand-off seam ([ADR-010](docs/adr/010-shape-blueprints-workflow.md)).

## Context

`nav:plan` wrote its grounded implementation plan to `docs/plans/` by default. But a project using the `shape` `blueprints/` convention now has two homes for planning artifacts: intent in `blueprints/` (thoughts/ · plan.md · overview.html), grounded plans in a *separate* `docs/plans/`. The arc decision → status → grounded-how was split across two trees. The blueprints-spec already named `blueprints/` as the hand-off *input* to nav:plan but said nothing about where nav:plan's *output* lands.

The user asked for two things: (1) nav:plan should store its plan inside `blueprints/`; (2) `reconcile` should tidy those plans too, not only `thoughts/`.

## Decision

**1. When a `blueprints/` tree is present, `nav:plan` defaults its output to `blueprints/plans/<YYYY-MM-DD>-<slug>.md`** (creating `plans/` if absent); otherwise it keeps the `docs/plans/` default. This is a **soft** `nav → shape` preference — `nav` never *requires* `blueprints/` and runs fully standalone; it just prefers that home when the tree exists (consistent with ADR-012's soft-recommendation tier). Location is still confirmed before writing.

**2. `plans/` is a committed blueprints layer, distinct from `plan.md`.** `plan.md` (singular) is align's lean *status index*; `plans/` (plural) holds nav:plan's *grounded implementation plans* (one per item: Context · Approach · Critical files · Verification). The tree now renders the full arc: `thoughts/` (decision) → `plan.md` (status) → `plans/` (grounded-how) → `overview.html` (human projection).

**3. `reconcile` maintains `plans/` alongside `thoughts/`.** It inventories both. A grounded plan whose steps all shipped is stale exactly like an implemented thought → prune; if only some steps shipped, amend to mark which landed. Plans check *sharper* than thoughts: their explicit steps + Verification table grep cleanly against the code. Same verdicts, gates, and fact-vs-decision boundary as ADR-014.

## Why

- **Co-location** — one tree holds the whole planning arc; no second home to remember or let drift.
- **Stays soft** — no hard nav→shape coupling introduced; nav still installs/runs without shape (ADR-012's invariant holds).
- **Reconcile already had the engine** — extending its currency walk to `plans/` is the second consumer of the same machinery (fold, don't fork; N+1, as in ADR-013/014).

## Consequences

- `plugins/nav/skills/plan/SKILL.md`: Stage 3 location logic prefers `blueprints/plans/` when present; description + Discipline note it.
- `plugins/shape/skills/align/references/blueprints-spec.md`: `plans/` added to the layout + bullets + the singular-vs-plural note; seam 1 documents the output direction; seam 2 notes reconcile maintains `plans/`.
- `plugins/shape/skills/reconcile/SKILL.md`: scope widened to `thoughts/` + `plans/` (frontmatter, intro, Step 1, Output, Companion `/nav:plan`).
- `plugins/shape/CLAUDE.md`: reconcile member line + seams 1/2 updated.
- `docs/site/index.html` (gating): nav:plan + reconcile descriptions synced. ADR count 16 → 17.
- No version bump (behavioral/default change; no new skill).

## Notes

- Direction discipline preserved: the *hard* edge stays shape → nav (build orchestrates nav). This adds only a *soft* nav → shape write-preference + a shape-side reconcile scope widening — neither makes either plugin require the other.
