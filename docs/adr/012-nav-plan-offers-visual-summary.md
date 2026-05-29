# ADR 012 — `nav:plan` offers a visual summary; hard vs soft cross-plugin dependencies

**Status**: accepted
**Date**: 2026-05-29
**Resolves**: the open follow-up left in [ADR-011](docs/adr/011-shape-build-and-browser-verify-slot.md) ("should a standalone `/nav:plan` offer a visual summary?").

## Context

`build` (ADR-011) summarizes each grounded item as a diagram (via the mockup protocol) before implementing. The question was whether a **standalone** `/nav:plan` — run outside `build` — should also offer that visual summary. ADR-011 left it open, worried it would make `nav` depend on `shape` and break the "shape → nav, never reverse" layering stated when `build` landed.

On review, that worry rested on an **overstatement**: `nav:plan` *already* references `shape:mockup` — Stage 2 hands visual/interaction ambiguity to it, and its Companion-skills section names it "the one cross-family edge". So a `nav → shape` reference is not new, and "nav stays shape-independent" was too absolute.

## Decision

**1. `nav:plan` Stage 4 gains a guarded "Render a visual summary (→ `/shape:mockup`)" option.** It's added to the existing `AskUserQuestion` offer-next-action (ADR-007) — an *ask*, never auto. **Guarded:** offered only when the plan carries visual/structural decisions **and** `shape:mockup` is available; omitted otherwise (a broken option is worse than none).

**2. The cross-plugin dependency rule is refined into two tiers** (replacing the over-absolute "never reverse"):

- **Hard dependency** (import / call / breaks-without-it) — **one-way only: shape → nav.** `nav` must run fully standalone; it never *depends* on shape. `build` calling `/nav:plan` + `/nav:refactor` is a hard shape→nav dep, correct.
- **Soft recommendation** (a guarded *offer* / hand-off that simply degrades if the target is absent) — **may go nav → shape.** These already exist (nav:plan Stage 2 → shape:mockup) and are fine, because they don't make nav *require* shape.

## Why

- It's not a new breach — nav:plan already had the soft edge; this extends it consistently.
- The value is real: a visual summary of a plan is decidable at a glance and doubles as a verify target, available even when not running the full `build` loop.
- The two-tier rule is the honest invariant: what must stay one-way is *hard coupling* (so each plugin installs/runs alone), not *recommendations*. The user affirmed the ask-don't-auto framing.

## Consequences

- `plugins/nav/skills/plan/SKILL.md` Stage 4 documents the guarded option.
- `plugins/shape/CLAUDE.md` restates the seam rule as hard-one-way / soft-either-way (was "never reverse").
- `docs/site/index.html` (gating) softens the "never reverse" wording (master-map how-to-read, shape anatomy callout, shape node desc); the `shape → nav` master edge stays (it marks the *hard* direction). ADR count 11 → 12.
- `nav` still has **no hard** dependency on shape — uninstalling shape only removes a guarded offer, nothing breaks.

## Notes

- This does not add a `nav → shape` edge to the master graph: that edge denotes *hard* dependency, which remains shape → nav only. Soft recommendations are documented, not drawn.
