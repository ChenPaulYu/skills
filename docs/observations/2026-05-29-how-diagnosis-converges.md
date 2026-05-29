---
date: 2026-05-29
status: raw
---

# How diagnosis converges — root-causing a flaw is elicit pointed backward

> Grounding for `elicit`'s **diagnostic mode** (the backward-object case), the way [[2026-05-29-thought-mode-how-paul-converges]] grounds elicit's forward case. Source: a real Crate session diagnosing why "drag to derive" didn't work. The rhythm is **identical** to the thought-mode transcripts — same convergence engine, object reversed (why-is-this-wrong instead of what-should-this-be). That identity is why diagnosis folded into elicit instead of becoming a parallel skill (see [[../adr/013-diagnosis-folds-into-elicit]]).

## The case (de-Crate'd in the SKILL; kept real here)

The user tried to drag three things to "derive" them — a committed region, a region-note, a Concept card's @moment chip. **None dragged.** Diagnosis converged like this:

1. **Symptom grounded against what was ACTUALLY built, not the design doc.** The agent matched the three failed attempts to the real implementation: the drag-grip was bound only to "committed + selected region"; but (a) the thing reached for was a *working* time-selection (uncommitted → no grip), (b) the note was Derive B (unbuilt), (c) the chip was Promote-to-Clip (deferred). → **"the three places you reached are exactly the ones I didn't build."** Root cause = the gap between the user's mental model and the real code.
2. **The user supplied the piercing insight; the agent ground-confirmed it.** User: "drag conflicts with select." Agent confirmed by enumerating drag's overload on the timeline (drag strip = select · drag lane = create region · drag body = move · drag edge = resize) → "adding 'drag to derive' must collide."
3. **The flaw reframed from local to structural.** Not "the grip is misplaced" (local) but "**drag is a saturated dimension**" (structural). The reframe *was* the diagnosis — "you can't do this cleanly within the existing drag flow."
4. **Converge the fix by changing dimension — with candidates + a mockup.** Agent offered: leave-card-boundary / visible button / right-click. A `shape:mockup` compared "right-click vs visible button"; user picked **right-click context menu**: zero drag conflict · reuses a shipped right-click pattern · unifies all four sources into a `useDerive` seed · testable.
5. **One-line residue + hand the rebuild to a sub-agent.** Summary: "derive wanted drag, but drag is saturated by select/move → change dimension to right-click; conflict gone, four sources unify." The rebuild (retire the grip, open the derive door, wire four right-click entries) went to a sub-agent.

## The 3 moves that specialize elicit for a flaw

(The other elicit moves — react-not-author, friction, short volleys, exit-on-snap — are unchanged.)

1. **Ground the symptom against the real implementation** (find the mental-model-vs-reality gap), not against the spec's words.
2. **Forks = candidate causes traced against the code**, narrowed by grounded elimination; the user often gives the pierce, you confirm it.
3. **Drill until local-bug reframes into structural-cause.** The reframe is the diagnosis.

Then it flows the same as forward elicit → one-line cause + fix-direction → `shape:mockup` (if visual) → `shape:build`/sub-agent (rebuild). **Read-only diagnosis; the fix is a downstream verb.**

## One line

> Diagnosis is elicit pointed backward: stand up grounded candidate *causes*, let the user pierce, drill until the bug reframes from a local slip into a structural one, compress to a line — then hand the fix off. Same engine, reversed object.

## Evidence / status

- `raw` — one transcript (the drag-to-derive diagnosis), plus the structural match to the thought-mode rhythm. Repeat sightings of the same diagnostic rhythm → promote to `repeated`.
