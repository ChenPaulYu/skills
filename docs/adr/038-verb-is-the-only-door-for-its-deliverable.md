# ADR 038 — the verb is the only door for its deliverable: ambient practice of a verb's craft does not substitute for firing the verb

**Status**: accepted
**Date**: 2026-06-11
**Plugin**: marketplace-level convention (lands in both `nav/CLAUDE.md` and `shape/CLAUDE.md`)
**Extends**: [ADR-028](docs/adr/028-shape-converge-offers-nav-execution-verb.md) (wired the execution offer into the converge verbs)
**Origin**: [`docs/observations/2026-06-11-suppression-moves-up-ambient-converge-bypasses-the-wired-seam.md`](docs/observations/2026-06-11-suppression-moves-up-ambient-converge-bypasses-the-wired-seam.md) — **second sighting** of ambient-suppresses-the-verb (first: 2026-06-03 → ADR-028), recurring *after* the ADR-028 fix, one level up the stack. Promoted on the second-sighting gate, at the user's explicit request.

## Context

ADR-028 fixed the converge→execute seam by wiring offers **inside the converge verbs**: after a `mockup`/`elicit` pick, the verb offers `/nav:do`·`/nav:plan`·`/shape:align`. The second sighting shows the fix is structurally correct but **only reachable through a door the agent may stop walking through**: in a two-day session the agent's *mockup-making practice itself went ambient* (hand-built interactive mockups without firing `/shape:mockup`), so a pick landed("我喜歡 B,1")and the agent flowed into a multi-file behaviour-changing build — no `do`, no plan-vs-do, no align — because the offers live in skill text that never loaded. Inside invoked verbs the protocol held (`dogfood`/`elicit` offers fired correctly); outside them, nothing existed to fire.

Compounding (recorded in the observation): harness-level autonomy bias leans against `AskUserQuestion` gates in bare conversation, and in-session momentum (repeated instant ratifications) self-strengthens flow-into-build. The first sighting's lesson was 乙≠甲 for *execution* (awareness doesn't substitute for the check bracket); this sighting generalizes it: **the suppression climbs to whatever layer has gone ambient** — execution verb first, converge verb next.

## Decision

**A marketplace-level convention clause, landed in both plugin `CLAUDE.md` files:**

> **The verb is the only door for its deliverable.** If you are about to hand-produce something a verb encodes — a comparison mockup (`/shape:mockup`), a converge volley (`/shape:elicit`), a decided behaviour-changing change (`/nav:do`), a structural move (`/nav:refactor`) — **fire the verb instead of hand-rolling the artifact.** The artifact is not the deliverable; the *protocol around it* is (the post-pick offers, the check bracket, the gated diffs). Hand-rolling produces the artifact and silently drops the protocol. Having done the craft ambiently many times is the *risk signal*, not a waiver — fluency is exactly when the door gets skipped.

Two boundaries, for restraint:

1. **This is a routing rule for the agent, not a hook.** A harness-level hook (phrase-match on post-pick build language) was considered and **deferred**: zh/en phrase matching is brittle, and the family's design language is summoned-not-ambient — a third sighting that defeats this clause is the evidence a hook needs.
2. **It does not make verbs auto-fire.** Summoned stays summoned (`elicit`'s anti-feature note stands). The clause governs the case where the agent is *already producing the deliverable* — at that point the verb is not an optional ceremony but the thing itself.

## Notes

- Testbed corollary (from the same observation): in a project that doubles as a skills test environment, do **not** patch this with project-local behavioral memory — it makes skill efficacy unmeasurable. Fix at the skill layer; keep a testbed-guard memory instead.
