# ADR 081 — Dispatch proposal gate + return self-report + user override precedence

**Status**: accepted
**Date**: 2026-07-14
**Extends**: [ADR-067](067-dispatch-tiers-consultant-seat.md) (dispatch tiers + consultant seat) — same principle (judgment seat vs cheap hand), now with a visibility mechanism around the dispatch act itself.
**Borrows**: [ADR-040](040-parallel-build-scheduling-policy.md)'s proposal-gate batch pattern (propose once, the user's nod starts the batch) — reapplied here to dispatch-tier choice, not scheduling.
**Mirrors**: [ADR-071](071-contracts-vs-conventions-tolerant-reader.md)'s tolerant-reader self-report (which tier a *read* came from) — this ADR is the write/execution-side symmetric case (which tier a piece of *work* was executed by).
**Cites**: [`docs/observations/2026-07-14-knowledge-is-not-cue-walked-steps-fire.md`](../observations/2026-07-14-knowledge-is-not-cue-walked-steps-fire.md) — the reporting line this ADR requires must live in a walked step of the dispatcher's protocol, not a footer or reference note, or it will not fire.
**Source**: Paul-ratified 2026-07-14, same-session ruling — not re-decided here.

## Context

ADR-067 established the dispatch-tiers principle — judgment stays on the session model, reconnaissance/execution can go to a cheap hand, downgrading is safe exactly when a strong-seat checkpoint reviews the output. What it left open: dispatch was **invisible**. Paul's complaint, stated directly: he couldn't tell whether a weaker model had actually done a piece of work, or the session model had done all of it itself. There was no signal to anchor trust in either direction — not before dispatch (no chance to weigh in on the tier choice) and not after (no record in the report or the commit message).

Two design options were considered for making dispatch visible up front.

**Rejected: name skills per tier** (e.g. a `nav:do-sonnet` variant alongside `nav:do`). This fails on two independent grounds already settled elsewhere in this repo: it violates ADR-067's own naming law — "a seat is named by **role**, never pinned to a tool or model name, so swapping either changes nothing but this line" — baking a model name into a skill name re-creates exactly the fragility ADR-067's fork 5 rejected. It also fails the **N+1 problem**: every dispatch-shaped skill would need a tier-suffixed twin, doubling the roster for a concern that is orthogonal to what the skill *does*. The tier is a **choice made at dispatch time**, not a property of the skill being dispatched.

**Adopted: a proposal gate before dispatch, a self-report after.** This borrows two patterns already proven in this repo rather than inventing a third: ADR-040's batch proposal gate (propose the schedule once, the user's nod starts the whole batch — never per-item) and ADR-071's tolerant-reader self-report (state which tier the read came from, so the reader can calibrate trust). Applying the same two moves to the write/execution side closes the visibility gap without adding a new skill or a new naming axis.

## Decision

Three additions to the ★ Dispatch tiers convention (root `CLAUDE.md`), all extending ADR-067 in place — no second dispatch bullet (rule ① single owner):

1. **Pre-dispatch proposal gate.** Before dispatching work to a cheaper seat, the dispatcher surfaces an `AskUserQuestion`-style proposal naming: what will be dispatched (the work list), to which tier, and what stays with the judgment seat. **One ask per batch** — never per-agent, exactly ADR-040's rule ("the user's nod starts the batch," not a nod per item). Options must include a **downgrade valve**: "don't ask again for this line of work," which drops that line to self-report-only (no more pre-dispatch asks) — this is the anti-nagging escape hatch; without it the gate becomes friction that trains the user to rubber-stamp, which defeats its own purpose.

2. **Return self-report.** Any turn whose work was dispatched carries a fixed line in its report:
   ```
   ⚙ 派工:執行=<tier> ×N|判斷+驗收=session model
   ```
   and the commit message (when the turn produces a commit) carries: `Executed by a <tier> hand, judgment-seat reviewed (ADR-067)`. **No dispatch → no line** — absence of the signal is itself the signal (all session-model, nothing to disclose). This is the direct mirror of ADR-071's tolerant-reader rule: that ADR made a *reader* self-report which tier it consumed from; this makes a *dispatcher* self-report which tier it delegated to. Same law, opposite data direction.

3. **User override precedence.** The user's tier designation always beats the default dispatch table (ADR-067 fork 5's "the default is a convention, not a lock," now given an explicit precedence rule). Scope follows the user's own wording: "this task," "this line of work," or "today" bound the override to that scope, read literally, not expanded. A **persistent** override (one that should survive past the current session) is recorded as a written `CLAUDE.md` rule — never a remembered fact in conversation state, which evaporates at session boundary and silently reverts to the default with no signal that it reverted.

### Why the report line must be a walked step, not a footer

The observation cited above (`docs/observations/2026-07-14-knowledge-is-not-cue-walked-steps-fire.md`) documents four independent same-day cases where a rule stated in a reference section or a footer never fired, because the trigger it relied on was the agent's own self-assessment rather than an observable signal, or the action wasn't bound into the same sentence as the trigger. The self-report line in point 2 is exactly this failure mode's setup if handled carelessly: "mention which tier did the work" as advice in a reference doc would predictably not fire, for the same reason the frame lenses' plain-language footer didn't fire until it became a walked, mechanically-checkable final step (ADR-077). The fix is the same shape here: **the reporting line is not a suggestion appended to this convention — it is a required step in whatever protocol did the dispatching**, checkable the same way ADR-077's landing step is checkable (a fixed line either appears or it doesn't, not a judgment call about whether the report "felt complete").

## What already complies

`shape:build`'s Scheduling section (ADR-040) already runs a proposal-gate shape for its own concern (schedule approval) — "the user's nod starts the batch," one ask per batch, never per-item. It is not retrofitted by this ADR; its *existing* batch-approval gate is the same pattern this ADR generalizes to dispatch-tier choice, and is cited here as prior art already living in a walked step, not as a change target. Any skill that dispatches sub-agents (recon fan-out, batched execution) inherits this ADR's proposal-gate + self-report requirement the same way it already inherits ADR-067's tier default — via the single root convention, not a per-skill restatement.

## Consequences

- Root `CLAUDE.md`'s ★ Dispatch tiers bullet gains one compact sub-passage: the proposal-gate rule (one ask per batch + downgrade valve), the self-report line format + commit-message clause, and the override-precedence rule — pointing here for full rationale rather than restating it.
- No `SKILL.md` is edited by this ADR — the convention lands at the root-CLAUDE.md layer only. A skill that dispatches (e.g. `nav:plan` Stage 4, `shape:build` Scheduling, `nav:audit` Mode-3 fan-out — the three ADR-067 already named) inherits this by reference; bringing each skill's own prose current with the new gate/report/override language is left as follow-up, not blocking this convention from landing, consistent with how ADR-067 itself landed the root convention first and pointed at instance sites rather than rewriting all three in the same commit.
- `docs/site/index.html`: ADR count 80 → 81, rev bumped, one CHANGED entry naming this addition.
- **Not decided here**: the exact `AskUserQuestion` option wording for the downgrade valve (left to the dispatcher's judgment per call, same as ADR-067 fork 5's un-quantified escalation threshold); whether the self-report line's tier name should be validated against the root CLAUDE.md tier table mechanically (the same open drift-risk ADR-067 flagged for `model: sonnet` frontmatter values, still unresolved here).
