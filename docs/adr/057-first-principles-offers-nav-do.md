# ADR 057 — first-principles offers /nav:do for small, decided fixes

**Status**: accepted
**Date**: 2026-07-01
**Extends**: ADR-007 (offer-next-action via `AskUserQuestion`), ADR-015 (elicit/mockup → align offer)
**Touches**: `/think:first-principles`

## Context

`first-principles`'s routing offer lists three destinations for a rebuilt conclusion:
`/shape:elicit` (converge), `/shape:mockup` (render), `/nav:plan` (ground into a written
plan). All three assume the next step is either a decision still being made, or a change
big/ambiguous enough to deserve a plan artifact. Neither is true for the common case where
first-principles derives a **small, already-decided, code-level fix** — e.g. "the surface
bug is two missing i18n entries; the root cause is a type-erasing `as` assertion defeating
the compiler's exhaustiveness check; the fix is a `Record<Tool, Key>` swap." That fix is a
one-sentence `/nav:do`, not a `/nav:plan`-worthy epic — but `do` isn't an offered option, so
the routing degrades to unstructured chat text instead of a one-click hand-off (the exact
friction ADR-007 exists to remove).

A repo-wide check (`nav:do`, `nav:audit`, `first-principles` all read in full) found no
existing coverage of this specific gap: `nav:do`'s check gates (header · N+1 · verify) don't
ask whether a fix addresses a root mechanism or a symptom; `nav:audit`'s rule ① (information
leakage) is adjacent but about duplication, not about a language feature (`as`, `any`,
`// @ts-ignore`, unchecked casts) silently defeating a would-be compile-time check;
`/shape:elicit`'s backward-root-cause mode is a conversational grill for *undecided* causes,
not a routing destination for an *already-derived* one.

## Decision

`first-principles` offers **`/nav:do`** as a fourth routing option, alongside `/nav:plan`,
using `do`'s own scoping question to pick between them: *"can the rebuilt fix be stated in
one sentence and held in your head, or does it span many files / need further decisions?"*
One sentence → `/nav:do`. Bigger/ambiguous → `/nav:plan` (unchanged).

| Rebuilt conclusion shape | Route |
|---|---|
| Still needs a decision drawn out of the user | `/shape:elicit` (unchanged) |
| Decided by seeing it | `/shape:mockup` (unchanged) |
| Small, decided, one-sentence code change | **`/nav:do`** (new) |
| Big/ambiguous enough to need a written plan | `/nav:plan` (unchanged) |

Guarded + one-shot, per ADR-007: offer only, never auto-call; include the existing
"just leave the note" opt-out; don't re-offer after a pick.

## Why

- **Grounded in a real session** — first-principles derived a root-cause fix that was
  correctly `/nav:do`-shaped (one file, one sentence, no plan needed), but the routing
  offer had no slot for it, so the hand-off degraded to prose instead of a click.
- **Same shape as ADR-015** — extends an existing verb's offer to a new destination,
  no new skill, no version bump (behavioral addition to an existing skill).
- **Mirrors `nav:do`'s own scoping line** — reuses `do`'s existing "one sentence, held
  in your head" test rather than inventing a new threshold.
- **Keeps the plan/do split intact** — `/nav:plan` stays for big/ambiguous work; this
  only fills the small-fix gap next to it, it doesn't blur the two.

## Consequences

- `plugins/think/skills/first-principles/SKILL.md`: frontmatter description, the "offer
  to route" step, the `Output` section, and the `Companion skills` list all gain `/nav:do`,
  with the one-sentence/many-files test distinguishing it from `/nav:plan`.
- `docs/site/index.html`: the `/think:first-principles` node's EN/ZH blurb gains
  `/nav:do` alongside the existing route list; audit-block rev bumped + a FIXED entry added.
- `README.md`: no change (skill roster unchanged, only routing behavior).
- No version bump — behavioral addition to an existing skill (ADR-015 precedent).

## Notes

- One-directional for now: `nav:do`'s own "inject" phase does not gain a reciprocal
  "was this actually root-caused, or just patched?" prompt. That's a plausible companion
  change but wasn't observed failing in the session that motivated this ADR (`do` was
  never invoked directly) — deferred until a concrete case grounds it, per this repo's own
  grounding discipline.
- Also considered folding this into `nav:audit`'s rule ① (information leakage) as a new
  "defeated safety-net" check (a `as`/`any`/`// @ts-ignore` that silently drops a
  compile-time guarantee). Rejected for this ADR: audit is read-only shape assessment, not
  a routing destination for an already-derived fix, and the check itself is a different
  ADR's decision if it's wanted — noted here so it isn't lost.
