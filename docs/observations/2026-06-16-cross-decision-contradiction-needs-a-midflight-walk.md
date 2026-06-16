---
date: 2026-06-16
status: raw
---

# Decisions converged in separate elicit/mockup turns quietly contradict each other — and nothing in the shape loop catches it until a "walk the whole flow, hunt logic holes" pass (reconcile's cross-decision check is post-ship, too late)

> Source: TrackMate testbed — a long history-model convergence where two separately-decided pieces silently conflicted, found only when the user asked "any clear logic holes here?"

## What prompted it

Across one session, several pieces were converged in separate `/shape:elicit` + `/shape:mockup` turns: "commit is deliberate" (one turn) and "every applied decision is a restorable checkpoint" (an earlier mockup's premise). Each turn was locally sound. Neither turn noticed they **contradict** — deliberate (sparse) commits can't make *every* decision restorable. It only surfaced when the user pointed at the assembled flow and asked "明確邏輯漏洞嗎?" — a deliberate walk of the whole model hunting for holes. The contradiction was real and forced a resolution (undo-vs-restore split at the commit seal).

## The signal

**Per-decision convergence has no consistency check across decisions.** `elicit`/`mockup` each converge *one* thing well; they don't (and shouldn't) re-validate every prior decision. So two locally-sound decisions can assemble into a globally-inconsistent model, invisibly. `/shape:reconcile` *has* a cross-decision-contradiction check — but it runs on `decisions.md` (shipped, graduated) and on a sweep cadence, i.e. **post-ship**. There is no **mid-flight** gate that walks the in-flight `thoughts/` together and hunts contradictions *before* they're built.

The missing move: after a cluster of related elicit/mockup turns, a deliberate "assemble the flow end-to-end and look for where two decisions fight" pass — diagnostic-mode elicit pointed at the *set*, not one doc. Here it was triggered by the user; the gap is that nothing in the loop *prompts* it.

## Evidence so far

- **Only case (2026-06-16, TrackMate)**: "deliberate commit" × "every decision restorable" contradiction; surfaced by a user-initiated hole-hunt ("any logic holes?"), not by any skill. Resolution (undo before the seal / restore after) only became reachable once the contradiction was named.

(One case → stays `raw`. Promote when a second multi-elicit campaign ships a contradiction that a mid-flight walk would have caught — evidence that the gap is structural, not a one-off. Candidate fix: a guarded offer, after N related thoughts land, to run a cross-thought consistency walk. Relates to `/shape:reconcile`'s cross-decision check and [[2026-06-15-core-inbound-link-blocks-reconcile-prune]]; distinct in that those are post-ship/decisions.md, this is in-flight/thoughts.)
