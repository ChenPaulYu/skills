# ADR 123 — Consultant seat drops the sub-agent rung; stuck calls go straight to the user

**Status**: accepted — supersedes [ADR-087](087-consultant-seat-drops-advisor-rung.md) and [ADR-089](089-consultant-seat-no-self-escalation.md); amends [ADR-067](067-dispatch-tiers-consultant-seat.md)'s resolution order
**Date**: 2026-08-24
**Source**: owner ruling in-session ("把高階模型的對抗審查這件事情從我們的 skill 拿掉，只留下高階模型規劃，spawn sub-agent 去做事"; when asked what should catch a stuck judgment call instead, ruled "直接問你" — ask the user directly, no replacement escalation layer)

## Context

ADR-067 introduced the consultant seat: a stuck judgment call escalates through a
resolution order, originally ① host `advisor` tool → ② strong-model sub-agent
(neutral reviewer / devil's-advocate) → ③ ask the user. ADR-087 dropped rung ①
(the advisor tool's availability collapsed to ~zero) and promoted the sub-agent
rung to first. ADR-089 then patched a failure mode of that promoted rung: a
stuck sub-agent review recursed into review-of-the-review four levels deep
before anyone noticed, burning 57.6k tokens with no one calling a stop.

Two ADRs in a row (087, 089) were needed to keep the sub-agent-review rung
working — each patched a new failure the previous shape produced. The owner's
2026-08-24 ruling reads that pattern as the rung itself being the wrong shape,
not a tuning problem: a "high-tier model reviews the plan" step invites
exactly the recursion ADR-089 had to forbid by fiat, and every such review is
itself an un-reviewed judgment call — nothing checks the checker except
another checker, turtles down. Removing the rung removes the class of
failure, not just this instance.

## Decision

1. **The consultant seat's resolution order collapses to one step: ask the
   user.** No sub-agent rung stands between a stuck judgment call and the
   person who can resolve it. `CLAUDE.md`'s ★ Dispatch tiers bullet is the
   single owner of this and was updated in this commit.
2. **This narrows only the judgment-review rung, not dispatch tiers as a
   whole.** Reconnaissance and disciplined execution still default to the
   cheap hand (`model: sonnet`), per ADR-088's task-tier taxonomy — that
   ratification is unaffected. What's gone is the idea of a *second model
   instance reviewing the first's judgment*; judgment (planning, review,
   unblocking a stuck call) now stays with the session model end to end,
   with no escalation rung except the user.
3. **ADR-087 and ADR-089 are superseded, not deleted.** Their record of why
   the advisor tool and the recursion guard existed stays as history; neither
   rung they governed is live any more.
4. **Reinstating any sub-agent consultant rung is a new ADR**, not a silent
   revert, and should name what failure mode it's solving that "ask the
   user" doesn't already solve for free.

## Consequences

- `CLAUDE.md`'s ★ Dispatch tiers bullet: the consultant-seat paragraph now
  reads "ask the user" as the entire resolution order. The old
  fresh-subagent-reviewer language, its brief-injection requirement, and the
  no-self-escalation clause are removed as moot — there's no sub-agent step
  left to inject a brief into or forbid from re-escalating.
- The same-day ruling reaches beyond this repo: the user's personal
  `~/.claude/CLAUDE.md` Supervisor section and `dotcanon/core/preferences.md`'s
  planning/execution split carried the same subagent-review policy and were
  updated to match in the same pass (outside this repo, not tracked here).
- Cost-scaled dispatch gating (ADR-114) and the task-tier taxonomy (ADR-088)
  are both about *execution* dispatch and are unaffected — only the
  judgment-review escalation path changed.
