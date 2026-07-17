# ADR 087 — Consultant seat drops the host-advisor rung

**Status**: accepted — amends [ADR-067](067-dispatch-tiers-consultant-seat.md)'s resolution order
**Date**: 2026-07-17
**Source**: owner ruling in-session ("不要依賴 advisor tool"), after the tool's
empirical availability reached ~zero.

## Context

ADR-067 defined the consultant seat as a capability slot with resolution order
① host `advisor` tool → ② strong-model sub-agent → ③ ask the user, and already
warned the first rung was fragile ("assume it may be unavailable mid-session
with no fix"). Field experience since then finished the argument: the tool
failed even on the *first call* of a fresh session — before any of the known
trigger conditions — and one failure locks it out for the whole session. A
first rung that is effectively never available is not a rung; it is a standing
failed-call tax plus a "the consult silently didn't happen" hazard for any
consumer that treats ① as satisfied.

Meanwhile rung ② proved itself in production the same day: multiple
strong-model sub-agent reviews caught real defects (a sync script's re-adoption
hazard, an uneven audit chunking, a wording flaw in a 32-file sweep).

## Decision

1. **The resolution order loses its first rung.** Consultant seat = ① a fresh
   strong-model sub-agent (neutral reviewer / devil's-advocate per ADR-067,
   durable-artifact path injected) → ② ask the user. No skill or doc in this
   marketplace may name the host `advisor` tool as a dependency.
2. **The brief inherits the transcript burden.** The advisor's one real
   advantage was seeing the full transcript for free; a sub-agent sees only
   its brief. The dispatcher therefore owes the brief the key evidence, the
   counter-hypothesis, and its own doubts — ADR-067's "the weaker party picks
   the evidence" mitigation now applies to *every* consult, not just
   escalations.
3. **Reinstating a host consult tool, if one becomes reliable, is a new ADR**,
   not a silent revert — the seat stays named by role either way.

## Consequences

- Root CLAUDE.md's ★ Dispatch tiers bullet is the single owner of the
  resolution order and was updated in this commit; skills reference it by
  pointer and needed no edits.
- ADR-067's principle (role, not tool) is unchanged — this amendment is that
  principle cashing out: the tool changed under the role, and only one line
  moved.
