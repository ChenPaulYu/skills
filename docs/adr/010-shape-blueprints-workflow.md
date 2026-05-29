# ADR 010 — shape's blueprints workflow: `align` + `reconcile` + the blueprints convention

**Status**: accepted
**Date**: 2026-05-29
**Plugin**: `shape`
**Builds on**: the shape charter (`plugins/shape/CLAUDE.md`), the `mockup` skill, and the marketplace conventions in [ADR-005](docs/adr/005-marketplace-plus-plugin-restructure.md). Mirrors the nav family logic of [ADR-003](docs/adr/003-five-skills-not-four-or-six.md).

## Context

`shape` shipped with one skill (`mockup`) and a charter gesturing at a `thought → spec → plan` pipeline, with `spec` as a convention and `plan` as a "reuse" of planning-with-files. That left the **output side undefined**: where do converged decisions *land*, and how do they stay legible to both a human and an agent over time?

A real pre-build doc reorg (on a sibling project) exercised the whole missing piece end-to-end: deleting outdated docs, consolidating scattered design notes, and producing a two-view plan — a lean `plan.md` for the agent and an interactive `overview.html` board for the human. The recurring pains it surfaced:

- **Agent-written markdown plans are dense and unread by humans; HTML boards are nice but humans then click into the raw md and hit the same wall.** The fix that worked: one current state, two renders — the human reads a click-to-reveal board, the agent reads structured markdown — and *both* obey progressive disclosure.
- **A pre-build "plan" verb collides conceptually with `nav:plan`.** They are different verbs and must not share a name.
- **Cleaning stale docs is destructive and judgment-heavy** — a careless `mv`+`rm` during the reorg destroyed untracked notes. It needs its own gated discipline.

## Decision

Define shape's output layer as a **convention** plus **two new skills**, named by verb (mirroring nav's family):

### `blueprints/` = convention (not a skill)

The artifact container the verbs read/write:

```
blueprints/
  thoughts/      committed design decisions (agent-facing, progressively disclosed)
  mockups/       git-ignored disposable HTML (owned by mockup)
  plan.md        lean status index (agent-facing)
  overview.html  human-facing projection (click-to-reveal, bilingual)
```

Layout, `plan.md` shape, `overview.html` contract, and the **one-state-two-renders** pipeline live in `plugins/shape/skills/align/references/blueprints-spec.md`, with a generic `overview-template.html`.

### `align` = the **project** verb (built)

Read `thoughts/` + the real state of the work → decide now/next/later *with the user* → write `plan.md` + regenerate `overview.html`. The pre-build mirror of `/nav:map` (map projects existing code; align projects planned work). Scaffolds `blueprints/` on first run.

### `reconcile` = the **keep-honest** verb (built)

Judge which `thoughts/` docs are stale via three signals — **code/`head -12` headers · self-declaration · date** — then prune/consolidate *with the user*. Check is read-only; cleaning is write-gated with hard safety rules. The pre-build mirror of `/nav:audit` + the careful side of `/nav:refactor`.

The resulting family: **converge** (`mockup` ✓, `elicit` next) · **project** (`align` ✓) · **reconcile** (`reconcile` ✓) · **orchestrate** (`doctor`, deferred).

## Why these specific calls

- **`blueprints` is a convention, not a skill.** It's a noun (a container), not a verb (an action). Skills are verbs; the original instinct ("spec = convention") was right. A "blueprints skill" was an over-reach corrected in design.
- **No `align`/`reconcile` name overlap with `nav:plan`.** `align` *triages forward* into a status board; `nav:plan` *grounds one item down* into a codebase-level implementation plan. `blueprints/` is the hand-off artifact between them — adjacent verbs, not overlapping. A `shape:plan` skill was explicitly rejected for this collision.
- **No `init` skill.** Scaffolding `blueprints/` is `mkdir -p` + two template files; a dedicated skill for that is structure-theatre (nav rule ④). It folds into `align`'s first run (ask location once, create idempotently). Superpowers has no init for the same reason.
- **`reconcile` includes cleanup, not just a check.** The user needs the docs *cleaned*, not only flagged. But cleanup is destructive → the skill carries explicit safety rules: verify tracked/untracked, never `mv`-then-`rm`, diff before delete, per-file confirmation. They derive from the data-loss incident during the reorg that motivated this ADR.
- **Progressive disclosure is required in every produced artifact**, so an *agent* scans fast — not only the human. The agent's render of progressive disclosure is markdown structure (a `head -12`-able header + TL;DR, sections that lead with their point); the human's is the click-to-reveal board. Same interface-first principle as nav's file headers (rule ②), two media.

## The two seams with `nav` (record both; don't blur)

1. **`blueprints/` is the hand-off artifact to `/nav:plan`** — shape converges intent into blueprints; nav:plan grounds a thought/spec into code.
2. **`reconcile` consumes `/nav:headers`** — `head -12` headers make "is this implemented?" cheap, which is reconcile's strongest staleness signal.

## Naming journey (recorded so the rationale survives)

The project verb was tried as `roadmap` (rejected: implies a big up-front plan, not recurring alignment) before landing on **`align`** ("align on what's next", recurring, collaborative). The converge-verbal skill was tried as `thought-ground` → `thought`/`think`/`grill`/`forge`/`distill` before landing on **`elicit`** (draws the decision out; collaborative, positive — not the one-sided "interrogation" feel of `grill`). `elicit` is charter/unbuilt; it's the next skill.

## Consequences

- `shape` jumps from 1 to 3 built skills (`mockup`, `align`, `reconcile`); `plugin.json` + `marketplace.json` bumped `0.0.1 → 0.1.0`.
- The charter's confusing "`spec` = convention / `plan` = reuse" members are replaced by the verb-grouped family + the `blueprints/` convention; `planning-with-files` becomes an internal dependency of `align`, not a member slot.
- `docs/site/index.html` (gating) must register `align` + `reconcile` and the updated shape anatomy in the immediately following change-set.
- `elicit` and `doctor` remain charter/unbuilt; they crystallize as they prove out (capture-before-crystallize), same as nav:doctor landed last.

## Notes

- Two new skills introduced in one ADR (not one ADR each) because they're a single coherent addition — the blueprints output layer — sharing one rationale, exactly as ADR-003 defined a whole skill set at once.
- The data-loss safety rules in `reconcile` are a first-class part of this decision, not an afterthought: a cleanup skill without them is more dangerous than no skill.
