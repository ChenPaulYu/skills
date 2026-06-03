# ADR 028 — shape's converge verbs offer `/nav:do` (the execution verb) after a pick, not only `/shape:align`

**Status**: accepted
**Date**: 2026-06-03
**Plugin**: `shape` (a `shape → nav` hand-off seam)
**Extends**: [ADR-007](docs/adr/007-offer-next-action-pattern.md) (offer-next-action via `AskUserQuestion`), [ADR-015](docs/adr/015-converge-verbs-offer-align.md) (which extended it so `elicit`/`mockup` offer `/shape:align` after landing a thought).
**Relates to**: [ADR-023](docs/adr/023-nav-do-execution-verb.md) (`/nav:do`, the execution verb), [ADR-008](docs/adr/008-inject-check-at-handoff.md) (the inject↔check bracket `do` carries).
**Origin**: [`docs/observations/2026-06-03-ambient-discipline-suppresses-firing-the-verb.md`](docs/observations/2026-06-03-ambient-discipline-suppresses-firing-the-verb.md) — a real Crate session where the agent flowed from a `mockup` pick straight into a behaviour-changing build ("make it functional") **without** invoking `/nav:do`, running on the always-on `CLAUDE.md` discipline (awareness 乙) but dropping `do`'s enforced check (甲); the explicit check, run only once the user invoked the verb, caught a real N+1 + an incomplete verify gate. **Crystallized on a single sighting at the user's explicit request** (ahead of the normal second-sighting promote gate — the observation records this).

## Context

ADR-015 wired one next-step after a converged pick: **track it** — `elicit`/`mockup` offer `/shape:align` to triage the decision into `plan.md`. But a pick has a *second*, equally-natural next step the offer never named: **build it**. "I just decided what this is — now make it real."

Empirically (the origin observation), the agent takes that build step by *flowing into it*, not by routing to a verb. "make it functional" carries no trigger that points at `/nav:do` (unlike "make a mockup" → `/shape:mockup`), and the deep-module discipline already feels "on" because it is ambient in the global `CLAUDE.md`. So the agent builds on **ambient hope** — it keeps the continuous awareness (乙) but skips `do`'s enforced *check* bracket (甲), and the closing gates (N+1 sweep · header hygiene · unconditional verify) are exactly what silently slips.

The converge→execute seam had a planning exit (align) but **no execution exit**. That missing exit is why the execution verb didn't fire.

## Decision

**shape's converge verbs offer the execution route after a pick — alongside the existing track (align) route.** Two changes:

1. **`mockup` (primary) and `elicit` (secondary) add an execution branch to their post-pick `AskUserQuestion`.** When the pick is a concrete, decided, *behaviour-changing* build, offer it, routed by scope:
   - small · decided · holdable-in-head → **`/nav:do`** (its check bracket is the point);
   - bigger / ambiguous / wants a written plan → **`/nav:plan`**;
   - driving multiple `plan.md` items → **`/shape:build`**.
   This sits next to the existing **`/shape:align`** (track-it) branch and the **"leave it"** opt-out. Same invariants as ADR-015: an **offer, never a call** (skills don't invoke each other); **guarded + one-shot** (don't re-offer across a rapid series); skip when there's nothing concrete to build.

2. **`/nav:do`'s trigger `description` catches the post-converge phrasing** — "make it functional", "now build it", "wire it up for real", "make this real" — so even without the offer, the handoff routes to the verb instead of past it.

The point is not to force execution (it stays an offer) but to **name the execution verb at the seam**, so the agent routes through `do`'s check instead of building on ambient hope.

## Consequences

- The converge→execute seam now has both exits (track · build); the agent that just picked a small feature is pointed at `/nav:do`'s enforced check, not left to flow past it.
- Symmetric with ADR-015 (which named the *planning* next-verb); this names the *execution* next-verb. Together `elicit`/`mockup` offer the full fork: render-decidable → `mockup` · track → `align` · build → `do`/`plan`/`build`.
- No new always-on behaviour: still an offer, still one-shot, still skippable. The cost is three short branches in two SKILL.md files + a trigger-phrase widening.
- Registry updated: `nav/CLAUDE.md`'s offer-next-action list now records that `mockup`/`elicit` offer the execution route.
- **Deferred:** `elicit`'s execution edge is weaker than `mockup`'s (elicit lands a *principle*, not a concrete build) — wired lightly; if it proves noisy, narrow it to `mockup` only.
