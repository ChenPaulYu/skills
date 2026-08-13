# A grill must be able to pause and hand the user something to read

> 2026-08-13 · **Status: in force** · elicit gains a fourth escape hatch: when the user cannot answer without knowledge they don't have, stop asking, hand over 2–3 verified primary sources, and park the volley — rather than keep forking or summarise the sources yourself.

## The call

`/shape:elicit`'s Gatekeeper had three stalls (fuzzy-but-known → keep grilling · missing terrain → run the survey leg · unmeasured fact → offer probe). A fourth exists and was unhandled: **the user needs input from outside that nobody in the room has.** Paul: 「有時候你問我很多問題，我在沒有新的知識 input 的情況下是打不出來的，我會希望你能先幫我補足某些知識，讓我去看某些文章或原文再來接著討論」.

The move: name the *one* missing thing, find **2–3 real primary sources** (verified to exist — a fabricated reading list costs more than the gap), one line each on why it bears on *this* fork, then **park the volley explicitly**, writing down what has converged so far so resuming doesn't restart from zero.

## How it shows up in the system

- A new bullet in elicit's escape-hatch list, alongside the mockup / survey-leg / probe hatches. Tells: 「我打不出來」·「我沒看過」·「這我不熟」, or answers visibly degrading into guesses.
- Parking uses machinery that already exists — a partial `thoughts/` doc with a `Status:` line (ADR-112), or `/shape:baton` (ADR-113). No new artifact.
- The boundary that keeps it from colliding with the survey leg: **survey maps terrain the agent can supply** from the repo and domain knowledge; **this hatch fires when the missing thing lives outside and the user wants it first-hand.**

## What was rejected or deferred

- **Rejected: fold this into the survey leg.** Survey's deliverable is the agent-produced diff between the user's stated understanding and the full map. This hatch's deliverable is *source material the user reads himself*. Different producer, different consumer, different durability.
- **Rejected: summarise the sources and continue the volley.** That is the tempting version and it defeats the purpose — a decision leaning on agent-chewed knowledge collapses at the next fork. Consistent with the position already ratified elsewhere in this marketplace: `fathom`'s deliverable is the model in the learner's head, not a document.
- **Rejected: a longer reading list.** Two or three, tied to the specific fork. A syllabus is a way of not answering.
- **Deferred: whether the sources should be fetched and cached locally** (so the read survives a link rotting). Not decided; no evidence yet that it matters.

## Evidence.

Reported directly by Paul mid-session, 2026-08-13, while a grill was in progress. Consistent with two measured findings from the same day: three of ten transcript grills bailed to `mockup` because verbal forking wasn't landing ([`docs/findings/2026-08-12-elicit-vs-grill-me-probe.md`](docs/findings/2026-08-12-elicit-vs-grill-me-probe.md)), and the blind trial-2 winner was the arm that *absorbed* the user's meta-feedback rather than parking it — the same reflex this hatch encodes at the knowledge level.
