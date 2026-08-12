---
name: analogize
description: "Build a deliberately stress-tested analogy for an already-understood concept, then name where it breaks down. Fires on ELI5 / plain-language / metaphor requests: \"explain like I'm five\", \"give me the plain-language version\", \"用比喻解釋\", \"打個比方\". In-chat, writes no file. Distinct from /frame:first-principles (derives an answer FROM axioms; this re-expresses one already held) and /shape:elicit (draws an answer OUT of the user; this puts one INTO their head)."
---

# analogize — a stress-tested analogy, not the first one that comes to mind

Take a concept the agent already understands and make it **land** for the user — by deliberately building an analogy, checking it against the real structure of the thing, and being honest about where it stops working. Reaching for a metaphor is cheap and the model does it constantly — but a reflexive first-idea metaphor is usually the most *available* one, not the most *accurate* one: it either quietly misleads (the reader believes something false about the real thing) or gets stretched past where it holds. The point is **not** "add a metaphor" (the default does that reflexively, ambiently, on every reply); it's to treat the analogy itself as a claim worth checking before handing it over.

## Stance

- **Core discipline: generate 2–3 candidates from different source domains → map structure, not surface (does each part of the source map to a real part of the target, in the same relationships?) → pick on fit, not on which arrived first → name where it breaks → do the comparison silently** (it's your discipline, not the deliverable — don't narrate "I considered three analogies" unless asked to show alternatives; the delivered output is clean). Full numbered walk-through + two worked examples: `references/protocol.md`.
- **The forced output, always this shape:** one plain sentence (the answer in the plainest words available, no jargon, before anything else) → the analogy spelled out (concrete enough that the mapping is checkable) → precise/technical detail only as needed, layered after, connected back to the analogy's own terms → where it breaks (one short, honest line — omit only if you genuinely checked and it holds throughout, never skip by default).
- **Grounding.** The analogy must map onto the *real* structure of the target concept — not a hand-wavy impression of it. If the concept lives in code/a spec/a document the user is asking about, check the actual mechanism before building the mapping; an ungrounded analogy that merely *sounds* plausible is the failure mode this skill exists to prevent.
- **Boundary — summoned, not the ambient default.** Plain-language, metaphor-leaning replies are already a standing style default for every response. `analogize` is the **heavier, explicitly-requested** version for a specific concept that isn't landing: multiple candidates compared, the mapping actually checked, the breakage named. Reach for it when the user asks a second time, asks explicitly for simple/metaphor terms, or a concept is clearly not landing through the default style alone.
- **vs its neighbours.** `/frame:first-principles` *derives* an answer from axioms the agent didn't have yet; analogize *re-expresses* an answer the agent already has — derivation vs translation. `/frame:orthogonal` / `/frame:dialectic` take a problem apart or put it on trial for whoever is reasoning; analogize transports existing insight into the user's head, no new insight about the problem. `/shape:elicit` draws the answer *out of* the user (maieutic); analogize puts an answer *into* the user (pedagogic) — opposite direction of transfer. `/shape:mockup` renders a candidate to help *decide* something; analogize explains something already settled, nothing being decided.

Anti-pattern table: `references/protocol.md`.

## Companion skills

- **`/frame:first-principles`** — the derivation lens; analogize is the translation lens. Different direction, same family.
- **`/shape:elicit`** — the extraction direction (answer comes from the user); analogize is the delivery direction (answer goes to the user).
