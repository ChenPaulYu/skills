---
name: graft
description: "Design by grafting a mature model onto a new problem: map every primitive, then classify each as fit / break / adapt — the adapt list is the payload. Fires on \"reason this through X logic\", \"map this onto <mature model>\", \"is our design just <known system> renamed\", \"借用...的架構\". The disciplined middle between first-principles (invent from axioms) and lazy analogy (copy unchanged). In-chat, offers to route (/shape:elicit, /shape:mockup, /nav:plan)."
---

# Graft — borrow a mature model's structure, then adapt it to your domain

Take a novel system you're designing and **graft a mature model onto it** — not to copy that model, and not to invent from nothing, but to borrow a proven *structure* and let it **adapt** to your domain. You map every primitive of the mature model (git, a state machine, a market, an immune system, a type system…) onto your problem, then read each mapping three ways. The point is **not** the parts that fit — those are free and carry no design identity; it's the parts where the borrowed structure had to **change shape** to survive in your domain. That **adapt** list is where your design becomes *yours* rather than a reskin of the donor.

## Why this skill exists

Designing feature-by-feature, you only ever consider the primitives you happen to reach for — the gaps are the ones you never named. Borrowing a mature model that *rhymes* with your problem and forcing a 1:1 mapping of **all** its primitives makes the gaps unavoidable: it's a completeness checklist your piecemeal reasoning lacks. The model's default "reason about it" doesn't force the exhaustive map, and worse, casual analogy stops at the *fits* ("it's like git") — which is exactly the reskinning trap. graft forces the structure that earns its keep: the **adapt** column (each primitive reshaped for the domain) and the **break** column (each primitive with no home), not the comfortable fits.

It is nearly the **inverse of `first-principles`**: where first-principles strips every borrowed convention to reach axioms (borrow none), graft deliberately imports a complete convention as scaffolding (borrow all) — *then forces adaptation*, which is the line between graft and lazy analogy.

## Core — the forced structure (this IS the skill)

> **Core: pick a donor whose STRUCTURE resonates (not surface) → map EVERY primitive of the donor onto the target → read each mapping as fit / break / adapt → the payload is the ADAPT list (what each primitive became) plus the BREAKs (what it forced you to design fresh). If your output is mostly fits, you reskinned a donor — re-graft or admit the analogy is shallow.**

The discipline that makes it real (not lazy analogy):

- **Donor by structural resonance, not familiarity.** Don't graft git just because you know git; graft it because the target genuinely has *states + transitions + history + branching*. Name the resonance explicitly — if you can't, the donor is wrong (or there isn't one, and this is a `first-principles` problem instead).
- **The map must be EXHAUSTIVE.** List *every* donor primitive, including the awkward ones (git's detached-HEAD, rebase, conflict). The completeness is the forcing function; a partial map just re-finds the primitives you'd have reached for anyway.
- **Decide the breaks on the TARGET's terms — never let the donor's answer leak in.** Where the analogy breaks, the donor offers no valid answer; designing there by reflex-copying the donor is the lazy-analogy failure. The donor surfaced the question; your domain answers it.
- **Adapt is the payload, fit is the cheap seat.** A `fit` is "adopt unchanged" — low identity. An `adapt` is "the structure survives but the domain reshaped it" — that reshape is the design. Rank them; lead with adapt + break.

## The walk

1. **State the target sharply.** One sentence — the novel system + the design question ("a version model for a creative tool", "how should this agent's memory work").
2. **Pick the donor + name why it rhymes.** The mature model whose *structure* (not surface) matches, and the resonance in one line ("git — because the song moves through committed states with branches and history"). Ground it: if the resonance is only cosmetic, stop → this is a `first-principles` problem.
3. **Map every primitive.** A table: each donor primitive → its image in the target. Force completeness — include the primitives you'd rather skip; those are where the surprises live.
4. **Read each mapping — fit / break / adapt.** Per row: does it adopt unchanged (**fit**), have no image so you design fresh (**break**), or borrow-but-reshape for the domain (**adapt**)? Mark each.
5. **Land the graft.** The payload, ranked: the **adapt** list (what each reshaped primitive became — your design's identity) + the **break** list (what the donor forced you to invent). Fits noted briefly as "free". If it's almost all fits → say so plainly: the graft is shallow (a reskin), or the donor was wrong.
6. **Land it in plain words.** Close with one conclusion sentence with zero jargon — banned anywhere in this landing — the conclusion, the analogy, AND its break-note alike: "graft", "primitive", "donor" (need the concept? say it plainly: "borrowed structure that had to change shape to survive here") — plus one analogy, chosen deliberately (borrow `frame:analogize`'s discipline **by protocol, never a call**: weigh it against alternatives in your head, pick on fit, and — if checkable — name in half a sentence where it breaks). The target · donor + resonance · map · reading · payload above stay intact for anyone verifying; this step only adds the translation on top. Walked, not optional — the analysis isn't done until it's landed.

## The output — the five-part structure, always

The output is the structured graft itself, **in the conversation** — its shape IS the value:

- **Target** — the one-sentence system + question.
- **Donor + resonance** — the mature model borrowed, and the structural (not surface) reason it rhymes.
- **The map** — every donor primitive → its target image (the exhaustive table).
- **The reading** — each mapping tagged fit / break / adapt.
- **The graft (payload)** — the adapt list (reshaped primitives = the design's identity) + the breaks (designed fresh); fits flagged as free. If mostly fits: name the shallowness.
- **Land it in plain words** — walked, not optional: one zero-jargon conclusion sentence + one deliberately-chosen analogy, always the last thing said (banned terms: "graft", "primitive", "donor"; see The walk step 6).

Lightweight by default: the analysis stays **in-chat** — graft writes **no file**. Never write source or make the decision. To persist it, route to shape (below).

## Grounding

Map the **real** donor and the **real** target — anchor each primitive in a concrete instance ("git's `detached HEAD` → in our tool that would be a working state pointing at an old version with no forward line; we forbid it because the song is a shared truth, so restore is forward-only"). An ungrounded graft invents tidy correspondences that don't survive contact with real cases. Read enough of the donor (and the target's existing code/docs) to make the map concrete before asserting it.

## vs the siblings — the sharpest lines

- **vs `first-principles` (the inverse):** first-principles **borrows nothing** — it strips convention to axioms and rebuilds. graft **borrows everything** — it imports a whole model and adapts. Reach for first-principles when you suspect convention is hiding a simpler truth; reach for graft when a mature model *rhymes* and you want its structure as a completeness checklist. They are two ends of one spectrum (borrow-none ↔ borrow-all); lazy analogy is the failure mode off graft's end (borrow-all, *don't* adapt).
- **vs `orthogonal`:** orthogonal decomposes the target's *own* tangle into independent axes (internal, no donor). graft overlays an *external* model (a donor). Different objects — orthogonal factors what's there; graft imports a structure to test against.
- **vs `dialectic`:** dialectic puts a *claim* on trial (steelman vs attack); graft builds a *design* by transplant-and-adapt. dialectic judges; graft generates.

## After the analysis — offer to route it (don't decide, don't auto-run)

graft *reasons*; it does not decide or build. Once the graft is up, *offer* — never auto-call — the next step, via `AskUserQuestion` (offer-next-action, ADR-007/015):

- **Converge an adaptation into a decision** → `/shape:elicit` (the adapt/break points are strong grill inputs — but the call is drawn out *with* you, not asserted here).
- **Render an adapted structure** → `/shape:mockup` (when an adaptation is decided by seeing it).
- **Ground the grafted design into code** → `/nav:plan` (when the adapted model is settled enough to build).

**Guarded + one-shot:** compose from what the graft surfaced, always include a "just leave the analysis, I'll take it from here" opt-out, don't re-offer after the pick. An offer, not a call — skills don't invoke each other.

## When it fires

**Summoned on a "borrow a mature model and walk it against this" request** — "reason this through git logic", "what would X look like as a Y", "map this onto <known system>", "is our design just <known thing> renamed", "borrow the Z model and see what breaks". Not auto-fired because an analogy floated by. If there's no mature model that structurally rhymes, it's a `first-principles` problem, not a graft.

## Anti-patterns (refuse these)

| Temptation | Why to refuse |
|---|---|
| Stop at the fits ("it's basically git") | Fits are free and carry no design identity. The payload is the **adapt** + **break** columns — reskinning a donor isn't grafting. |
| Pick the donor you know, not the one that rhymes | Familiarity ≠ structural resonance. Name the resonance; if it's only surface, this is `first-principles`, not graft. |
| Partial map (only the primitives you'd reach for) | The completeness is the forcing function — the skipped primitives are exactly where the surprises hide. Map them all. |
| Let the donor's answer fill a break | The donor surfaced the gap; your **domain** answers it. Reflex-copying the donor across a break is the lazy-analogy failure. |
| Force a graft where no model rhymes | If nothing structurally matches, a forced donor invents fake correspondences — reach for `first-principles` instead. |
| Decide or implement here | graft reasons + routes. The decision is `/shape:elicit`; the build is `/nav:plan`. |
| End on a jargon sentence ("the adapt list is the payload, fits are free") | That's the graft without the landing — the plain-words conclusion + analogy has to be the actual last word, not the five-part structure alone. |

## Output

- **The five-part structure, in-chat** (no file artifact): Target · Donor + resonance · The map · The reading (fit/break/adapt) · The graft (adapt list + breaks). To persist, route to shape.
- **Plain-language landing, always last:** one zero-jargon conclusion sentence + one deliberately-chosen analogy (ADR-077).
- A guarded, one-shot **offer** to route the insight — `/shape:elicit` (converge) · `/shape:mockup` (render) · `/nav:plan` (ground) — never an auto-call.

## Companion skills

- **`/frame:first-principles`** — the inverse lens (borrow none, strip to axioms); graft borrows all and adapts. The two ends of the borrow-spectrum.
- **`/frame:orthogonal`** — factors the target's own tangle into independent axes (no donor); graft overlays an external model.
- **`/frame:dialectic`** — puts a claim on trial; graft builds a design by transplant-and-adapt.
- **`/shape:elicit`** — converge an adaptation into a decision *with the user*.
- **`/shape:mockup`** — render an adapted structure when it's decided by seeing it.
- **`/nav:plan`** — ground the grafted design into a code plan once settled.

## Communication Style
- Always explain concepts using simple, direct, and plain language (請用簡單、白話的語言解釋).
- Use analogies and metaphors frequently to explain complex programming or design concepts (請多使用易懂的比喻來解釋複雜的程式或設計概念).
- Use Traditional Chinese (Taiwanese phrasing) for all user-facing explanations.
- Avoid academic jargon and unnecessary verbosity.
- Keep explanations concise and actionable.
