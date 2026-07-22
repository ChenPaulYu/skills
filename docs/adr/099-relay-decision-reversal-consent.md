# ADR 099 — Relay routes decision reversal/amendment through assignee-consent, never through ACK

**Status**: accepted
**Date**: 2026-07-22
**Refines**: [ADR-091](docs/adr/091-relay-awareness-review-task-evidence.md), [ADR-092](docs/adr/092-relay-native-lifecycle-completion.md)

## Context

A live incident exposed a gap in Relay's decision lifecycle. A decision that had originally been agreed by both collaborators was, in practice, reversed unilaterally — the reversal was never put back through the same joint process that produced the original agreement. The reversal was announced through an `[ACK]`-style Discussion naming the counterpart. But ADR-091 already ratified, and ADR-097 reaffirms, that `👀` attests **awareness only** — never comprehension, acceptance, or consent. An Announcement's receipt tells you the counterpart saw the notice; it tells you nothing about whether they agreed to it. The reversal therefore shipped with no consent record at all — just an awareness receipt standing in for one, and silence (no objection posted) doing the rest of the work by default.

This is the same overloaded-ACK failure ADR-091 was written to prevent, in a new guise: instead of one `👀` being asked to prove installation or review, it was asked to prove agreement. The lifecycle matrix (ADR-092) already gives an ordinary decision a native, assignee-authored completion signal — `Outcome:` + `Decision:` on a Decision Issue — but nothing in Relay's router or settle authority explicitly required a *reversal* of an already-agreed decision to go through that same path rather than degrading to a lighter-weight Announcement just because a decision already existed once.

## Decision

**Reversing or materially amending a previously agreed decision routes as a Decision Issue assigned to the counterpart.** Their authored `Outcome:` resolution on that Issue is the consent record — the same native completion signal ADR-092 already defined for making a decision in the first place, now stated explicitly to also govern *changing* one. An Announcement may accompany the Decision Issue for visibility (so the counterpart isn't surprised by a silent Issue appearing), but it never substitutes for it: the Announcement's `👀`, if any, still only ever attests that the notice was seen, never that its content was agreed to.

This is not a new object type or a new obligation class. It is ADR-092's existing Decision Issue path, restated as the mandatory route for reversal/amendment specifically, closing the gap where "a decision already exists" was implicitly read as license to treat changing it as lighter-weight than making it.

## Relation to ADR-091 and ADR-092

- **ADR-091** already drew the line between awareness (`👀`), exact review (a requested PR verdict), and evidenced work (an assigned Issue) as three separate signals that must never stand in for one another. This ADR adds a fourth confusion to that same list: awareness standing in for **consent**. The fix is the same shape as ADR-091's — route the thing that's actually being asked for (agreement) to the object shape that actually produces it (an assignee's authored `Outcome:`), rather than letting the cheapest available signal (`👀`) absorb a heavier claim by default.
- **ADR-092** already made a Decision Issue's `Outcome:` + `Decision:` the native completion signal for a decision. This ADR does not change that signal — it extends *which decisions* must use it: not only the original agreement, but any later reversal or material amendment of it.

## Rejected

**Reading tacit consent from `👀` plus silence.** The alternative — treat a reversal as accepted once the counterpart has reacted `👀` and posted no objection within some window — was considered and rejected as exactly the overloaded-ACK fallacy this ADR exists to close. Silence is not consent, and a reaction that ADR-091 already defines as awareness-only cannot be reinterpreted as agreement just because nothing louder followed it. Treating non-objection as agreement also inverts the burden: it makes staying silent the cheapest way to be recorded as having agreed, which is backwards for anything materially changing a prior joint decision.

## Consequences

- `plugins/relay/skills/report/SKILL.md`'s decision route gains one sentence: reversing/amending an already-agreed decision routes the same way as making one — a Decision Issue assigned to the counterpart — and an accompanying Announcement never substitutes.
- `plugins/relay/skills/settle/SKILL.md`'s authority-validation step gains one clause: the same Decision Issue authority rule governs a reversal/amendment, not only an original decision.
- `plugins/relay/CLAUDE.md` gains a short paragraph next to the existing "accepted decision is not automatically effective" note, stating the reversal rule and naming ADR-091's awareness-only `👀` as insufficient consent.
- `docs/design/relay.md`'s Authority model line gains one clause naming the same rule.
- No reducer, schema, or obligation-contract change: `digest` already surfaces a Decision Issue's assignee obligation and `SETTLE settle-decision` action identically regardless of whether the decision is new or a reversal — nothing about the reducer's shape needed to change. `compute-state.test.mjs` stays at 69/69, untouched.
- No new GitHub object type, label, or daily verb. The daily verb set stays `launch · report · digest · reply · brief · settle` plus explicit-only `migrate`.
