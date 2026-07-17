# ADR 089 — Consultant seat: no self-escalation

**Status**: accepted — amends [ADR-067](067-dispatch-tiers-consultant-seat.md)'s resolution order
**Date**: 2026-07-17
**Source**: owner-reported runaway nesting in a live session, diagnosed and fixed
in the same sitting.

## Context

ADR-067 defined the consultant seat as a capability slot the judgment seat
reaches for when a call is stuck below confidence, resolved (post-[ADR-087](087-consultant-seat-drops-advisor-rung.md))
as: dispatch a fresh strong-model sub-agent as reviewer or devil's-advocate →
else ask the user. Neither ADR said what a sub-agent *dispatched into* that
seat should do if its own review then gets stuck. Nothing stopped it from
reading the same rule — CLAUDE.md is loaded into a dispatched sub-agent's
context same as the top-level session's — and applying it to itself.

That's exactly what happened. A judgment call escalated to a reviewer
sub-agent; the reviewer's own verdict wasn't confident, so it dispatched
*another* strong-model sub-agent to review its review; that one repeated the
pattern again. The observed chain reached four levels deep (task →
"adversarial review of X" → "adversarial review of [the prior] review" →
"adversarial check of review verdicts") with the deepest agent still running
after 2.5 minutes and 57.6k tokens, none of it requested by name — the
resolution order fired once, correctly, and then kept firing on itself with
no exit condition.

The failure shares its shape with the host `advisor` tool's original flaw
(ADR-087): a mechanism that behaves correctly in isolation compounds when
nothing marks "you are already the escalation, not the original call."

## Decision

1. **A sub-agent dispatched into the consultant seat does not itself
   re-invoke the resolution order.** When its own review is uncertain, it
   returns that uncertainty — verdict + confidence — to whoever dispatched
   it. It does not call `Agent` to spawn a further reviewer of its own
   output.
2. **Escalation is capped at one hop from the original judgment seat.** Only
   the seat that first got stuck decides whether a second consult round is
   warranted, and if so runs it explicitly (a fresh dispatch, not a delegated
   one) rather than letting it happen implicitly inside the first reviewer's
   turn.
3. **This is a role-boundary, not a capability removal.** The reviewer
   sub-agent keeps whatever tools it needs to do the review itself (reading
   files, running checks); the boundary is specifically on re-invoking *this*
   resolution order on *its own* stuck-ness.

## Consequences

- Root CLAUDE.md's ★ Dispatch tiers bullet carries the no-self-escalation
  clause inline, pointing here — single owner, same pattern as ADR-087.
- Skills that reference the Dispatch tiers bullet by pointer need no edits —
  same reasoning as ADR-087's consequences.
- Verified empirically the same session: a sub-agent briefed with the amended
  rule and put in a deliberately stuck two-option review returned a verdict +
  confidence to its dispatcher instead of spawning a nested reviewer.
