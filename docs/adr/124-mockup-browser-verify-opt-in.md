# ADR 124 — mockup's browser-verify slot becomes opt-in, not automatic

**Status**: accepted — amends `plugins/shape/skills/mockup/SKILL.md`, `references/mockup-protocol.md`, and the shared slot definition in `plugins/shape/CLAUDE.md`
**Date**: 2026-08-24
**Source**: owner ruling in-session ("我希望mockup不用跑測試，不然很消耗token")

## Context

`mockup`'s default protocol dispatched the `browser-verifier` subagent (model: sonnet) to
confirm every render — "Confirm a render once, not per iteration" was framed as a standing
default step, not an exception. In practice this meant a routine mockup — a disposable HTML
file the user was about to open and look at directly — paid for an automated open+screenshot+
verdict pass whose signal the user's own look immediately superseded. The token cost was real
and, for the common case (a static candidate row, not a gesture/handfeel decision), added no
decision-relevant information: the user opening the link already *is* the confirmation.

The slot still has a genuine job: the handfeel/gesture discipline (mockup-protocol.md,
"grounded-replica discipline") explains why a synthetic interaction can silently misreport as
working — a real button-state check needs faithful input, which the user's eyeballing a static
screenshot won't catch. That case is narrow and already self-identifying (it only applies when
the decision is *how a gesture feels*), unlike "confirm any render," which fired every time.

## Decision

1. **The browser-verify slot is opt-in for `mockup`, not a default step.** The default hand-off
   is: write the file, activate it (open locally or serve a URL), hand the user a clickable
   link. No automatic `browser-verifier` dispatch.
2. **Two triggers still warrant invoking it:** the handfeel/gesture case (faithful-input
   verification of a real interaction, per the existing grounded-replica discipline) and an
   explicit user request for a confirm pass. Both are narrow and self-identifying — the
   default stays off unless one applies.
3. **`align`'s use of the same shared slot is unaffected** — this ruling is scoped to `mockup`
   specifically; the slot definition in `plugins/shape/CLAUDE.md` stays shared infrastructure.

## Consequences

- `mockup/SKILL.md` and `references/mockup-protocol.md`: the "browser-verify slot" section now
  states opt-in as the rule, with the two trigger cases named explicitly.
- `plugins/shape/CLAUDE.md`'s shared slot section (the "slot's one live consumer" line, the
  delegate-whenever-mechanical line, and the "Verify economy" bullet) updated to match — a
  stale restatement of "confirms once by default" in the shared doc would silently
  reintroduce the old behavior for a reader who only saw that file.
- No change to `align`'s verify-before-triage pass (ADR-086), which is a different consumer of
  the same slot with its own trigger (compaction pressure, not render confirmation).
