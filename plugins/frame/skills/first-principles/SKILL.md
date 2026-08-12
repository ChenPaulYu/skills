---
name: first-principles
description: "Reason a question from first principles: name the conventional answer and its assumptions, strip to irreducible axioms, rebuild, then surface where it DIVERGES from convention. Fires on \"reason this from first principles\", \"strip the assumptions\", \"is this convention or necessity\", \"從第一性原理想\". In-chat, offers to route (/shape:elicit, /shape:mockup, /nav:do, /nav:plan)."
---

# First-principles — strip a question to its axioms, rebuild from them

Take a question, belief, or decision and **reason it from the ground up** — not from "how it's done" or "what's analogous", but from the irreducible truths that survive when every inherited assumption is removed. Most reasoning runs on **analogy and convention** ("competitors price per-seat, so we price per-seat") — fast, usually fine, but it silently inherits assumptions that may not hold for *your* problem, and the model's default "think about it" inherits them too. The point is not to restate the conventional answer in fancier words; it's to **rebuild the answer from axioms** and see *where that rebuilt answer diverges from convention* — that gap is where first-principles reasoning earns its keep.

## Stance

- **Core: name the conventional answer + the assumptions it inherits → strip to the irreducible axioms → rebuild the answer from the axioms alone → surface the divergence.** The output is always those five parts, in order. If you can't separate an axiom from an assumption, you haven't stripped far enough. Every assumption gets the test **"true, or just usually done?"** — an assumption holds because of habit/analogy/market norm and could be otherwise; an axiom is a physical limit, mathematical fact, definition, or verified constraint of *this* problem. Rebuild ignores the conventional path — reason UP from the axioms as if you'd never seen the standard answer; don't reverse-engineer axioms to land back on convention (motivated reasoning, the most common failure). Ground the axioms: an axiom claimed physical/factual must be checkable — verify where you can, mark *uncertain* where you can't.
- **The forced output, always in-chat** (no file artifact — frame writes none; never write source or make the decision): **Question** — the one-sentence target. **Conventional answer + inherited assumptions** — the default + the named assumptions it rests on (each flagged *convention* / *analogy* / *habit*). **Axioms** — the irreducible truths that survived, each grounded (verified / definitional / *uncertain*). **Rebuilt conclusion** — the answer derived from axioms alone. **Divergence** — where rebuilt ≠ conventional, and what that implies (or "none — convention holds, here's why"). Full step-by-step walk + a worked example: `references/protocol.md`.
- **Land it in plain words.** Close with one conclusion sentence in zero jargon — banned anywhere in this landing — the conclusion, the analogy, AND its break-note alike: "axiom", "公理", "first principles" itself (need the concept? say it plainly: "this is structurally unavoidable, not just habit"). Pair it with one analogy, chosen deliberately (borrow `frame:analogize`'s discipline **by protocol, never a call**: weigh it against the alternatives in your head, pick on fit, and — if it's checkable — name in half a sentence where it breaks). The five-part scaffold above stays intact for anyone verifying the reasoning; this step only adds the translation on top of it, never replaces it. Walked, not optional — the analysis isn't done until it's landed.
- **After the analysis — offer to route it, never decide or auto-run.** first-principles *reasons*; it does not decide or build. Once the note is up, *offer* — never auto-call — via `AskUserQuestion` (offer-next-action, ADR-007/015/057): `/shape:elicit` (converge the divergence into a decision *with the user*) · `/shape:mockup` (render the rebuilt option, when decided by seeing it) · `/nav:do` (execute a small, decided fix — a one-sentence, one-file change you can hold in your head) · `/nav:plan` (ground a bigger/ambiguous rebuilt answer). `/nav:do` vs `/nav:plan` — reuse `do`'s own scoping question: can the fix be stated in one sentence and held in your head? Yes → `do`. Spans many files or still needs decisions → `plan`. (ADR-057) **Guarded + one-shot:** compose from what the analysis actually found, always include a "just leave the note, I'll take it from here" opt-out, don't re-offer after the pick. An offer, not a call — skills don't invoke each other.
- **When it fires.** Summoned on a "reason this from the ground up / challenge the assumptions" request — not auto-fired because a hard question appeared. **vs `/shape:elicit` (the line to hold):** elicit draws the answer **out of you** by a grounded grill — *you* hold it, elicit is maieutic. first-principles **derives** an answer from the problem's base truths — the agent applies the frame. elicit extracts; first-principles derives. They pair: run first-principles to get a grounded divergence, then `/shape:elicit` to converge it into a decision *with you*. **vs `/frame:orthogonal`:** first-principles decomposes **down** to axioms and rebuilds up (depth); `orthogonal` factors **sideways** into mutually-independent axes (separation). **NOT for auditing an external document's argument** — just ask for a referee-style review; first-principles reasons about *your problem* from scratch, no source text to audit.

Worked example + anti-pattern table: `references/protocol.md`.

## After the analysis — offer to route it (don't decide, don't auto-run)

first-principles *reasons*; it does not decide or build. Once the note is up, *offer* — never auto-call — the next step, via `AskUserQuestion` (offer-next-action, ADR-007/015/057):

- **Converge it into a decision** → `/shape:elicit` (the divergence is a strong input to the grill — but the *decision* is still drawn out with you, not asserted here).
- **Render the rebuilt option** → `/shape:mockup` (when the divergence is something you'd decide by seeing it).
- **Execute a small, decided fix** → `/nav:do` (when the rebuilt conclusion is a one-sentence, one-file code change you can hold in your head — e.g. "swap the type-erasing assertion for an exhaustive lookup").
- **Ground it into code** → `/nav:plan` (when the rebuilt answer is bigger or ambiguous enough to need a written, reviewed plan).

`/nav:do` vs `/nav:plan` — reuse `do`'s own scoping question: can the fix be stated in one sentence and held in your head? Yes → `do`. Spans many files or still needs decisions → `plan`. (ADR-057)

**Guarded + one-shot:** compose from what the analysis actually found, always include a "just leave the note, I'll take it from here" opt-out, don't re-offer after the pick. An offer, not a call — skills don't invoke each other.

## Companion skills

- **`/shape:elicit`** — converge the divergence into a decision *with the user* (first-principles derives the input; elicit draws out the call). The pairing partner.
- **`/shape:mockup`** — render the rebuilt option when it's decided by seeing it.
- **`/nav:do`** — execute the rebuilt answer directly when it's a small, decided, one-sentence code fix (ADR-057) — the common shape for a root-cause finding that turns out to be "swap this mechanism," not a redesign.
- **`/nav:plan`** — ground the rebuilt answer into a code-level plan once settled (bigger/ambiguous work `/nav:do` doesn't fit).
- **`/frame:orthogonal`** — the separation lens (factor sideways into mutually-independent axes); first-principles is the depth lens. The two decomposition moves.

## Communication style

- Explain in the user's language with simple, direct wording.
- Lead each reply with one plain sentence; use a metaphor when it clarifies the concept.
- Put precise technical detail after the plain explanation and only where it's needed.
