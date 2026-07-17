---
date: 2026-06-01
status: raw
---

# When a change is motivated by a belief about the system, verify the belief against the code first — it's often false

## What prompted it

A long design session on a music-canvas app (Crate). Twice, the user asked for a change driven not by a preference but by a **belief about how the system behaves** — and both times the belief was wrong, so the right move was *not* to implement the request but to go check the belief in the code first.

1. **"Make derived clips cascade-delete with the concept they were derived from."** Drilling into *why* surfaced the real motivation: *"I'm worried that if everything points at the track's audioUrl, deleting the track leaves the audio resident in memory → perf degrades."* Instead of designing the cascade change, I grepped the audio layer: each card's waveform is a wavesurfer instance torn down on unmount (the renderer's cleanup destroys the instance, freeing the decoded buffer); playback is one shared `new Audio()` that only holds the currently-playing src. **No leak.** The entire motivation evaporated. We kept the existing model and recorded "considered + rejected, assumption false" rather than shipping a model change built on a phantom.

2. **"The right-click menu lands far from the cursor — investigate what's actually happening."** I had a *guess* from earlier ("it's the same portal bug as the other menu"), but the user said *investigate*. Driving the live app + measuring: at default zoom the offset was exactly +45px = the header-bar height; the cause was `position:fixed` resolving against a CSS-`transform`ed ancestor (the pan/zoom canvas wrapper becomes the containing block), not the viewport. The guess was directionally right but the *precise* mechanism (and that it compounds with pan/scale) only came from measuring, which is what made the one-line fix obviously correct.

## The signal

The user's *stated request* and the *real driver* often diverge, and the real driver is frequently a **factual claim about the system** ("X causes a leak", "the menu is offset because Y"). Acting on the request directly skips the cheapest, highest-leverage step: **confirm the claim in the code/runtime before designing around it.** In both cases ~2 minutes of grounding either killed the change entirely (case 1) or pinned the fix exactly (case 2).

This is rule ⑦ (below 90% → ask) + nav's "ground, don't guess" — but pointed at a specific, recurring trigger: **a change whose justification is an empirical belief.** The discipline isn't "ask the user to clarify"; it's "go read the code and tell them whether their belief holds." Often the most valuable output is *"that won't happen, here's why — so we don't need the change."*

## What it could become

**Resolved (2026-06-01): not a new skill, not a standalone gate — it folds INTO elicit's `drill` (move 2).** A discussion-with-Paul converged this: verifying a premise isn't a *pre-check* before drilling, it **is** part of the drill — when you descend toward the principle and hit a premise being used as bedrock, you leave the conversation and hit reality (grep / run / dogfood) to verify it; the result decides the next dig. See the 2026-06-01 additions in [[2026-05-29-thought-mode-how-paul-converges]] ("drill 的完整定義" + the premise-typing rule: ① program-behavior → grep now · ② usage-behavior → ship+dogfood, don't reason in imagination · ③ logical-necessity → reason but show the chain; **iron rule: an unverified ① premise forbids drilling further**). This observation is the evidence base for that upgrade; both stay `raw` until a 2nd/3rd sighting earns promoting elicit's SKILL.

## Evidence so far

Two clean instances in one session (perf-leak assumption; menu-offset mechanism). Both changed the outcome materially (one cancelled the work, one made the fix certain). Watch for a third before promoting past "good to know".
