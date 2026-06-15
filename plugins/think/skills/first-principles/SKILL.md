---
name: first-principles
description: "Reason a question or decision from first principles. Name the conventional answer and assumptions, strip away convention, identify irreducible axioms, rebuild the answer from axioms, and highlight the divergence (the payload). Forces structure: discarded assumptions, axioms, rebuilt conclusion, divergence. Fires on \"reason this from first principles\", \"strip the assumptions\", \"why do we do X this way\", \"is this convention or necessity\", \"rebuild from scratch\", \"challenge assumptions behind X\", \"first-principles this\". Analysis only; reasons in-chat (no file artifact) and offers to route it (/shape:elicit, /shape:mockup, /nav:plan). Invokable as /think:first-principles."
---

# First-principles — strip a question to its axioms, rebuild from them

Take a question, belief, or decision and **reason it from the ground up** — not from "how it's done" or "what's analogous", but from the irreducible truths that survive when every inherited assumption is removed. The point is not to restate the conventional answer in fancier words; it's to **rebuild the answer from axioms** and see *where that rebuilt answer diverges from convention* — because that gap is where first-principles reasoning earns its keep (and where most "we've always done it this way" lives).

## Why this skill exists

Most reasoning runs on **analogy and convention** — "competitors price per-seat, so we price per-seat", "everyone uses a queue here, so we use a queue". That's fast and usually fine, but it silently inherits assumptions that may not hold for *your* problem. The model's default "think about it" inherits them too — it reasons fluently *from* the convention rather than *underneath* it. first-principles forces the underneath: name what's assumed, cut to what's actually true, and rebuild. The value isn't a smarter-sounding answer; it's a **fixed structure that exposes the assumptions** so they can be challenged — the part default reasoning skips.

## Core — the forced structure (this IS the skill)

> **Core: name the conventional answer + the assumptions it inherits → strip to the irreducible axioms → rebuild the answer from the axioms alone → surface the divergence. The output is always those five parts, in order. If you can't separate an axiom from an assumption, you haven't stripped far enough.**

The discipline that makes it real (not relabelled convention):

- **Every assumption gets the test: "true, or just usually done?"** An assumption is anything that holds because of habit, analogy, market norm, or "that's how X works" — it could be otherwise. An axiom is what *can't* be otherwise here: a physical limit, a mathematical fact, a definition, or a verified constraint of *this* problem. If your "axiom" still smuggles in a convention, cut again.
- **Rebuild ignores the conventional path.** Reason UP from the axioms as if you'd never seen the standard answer. Don't reverse-engineer the axioms to land back on convention — that's motivated reasoning, the most common failure here.
- **Ground the axioms.** An axiom claimed as physical/factual must be checkable; verify it where you can, and mark *uncertain* where you can't. A fabricated premise produces a confident wrong answer.

## The walk

1. **State the question sharply.** One sentence — the decision/belief under examination ("should onboarding be a wizard?", "do we need a separate cache service?", "is per-seat the right pricing?").
2. **Name the conventional answer + its inherited assumptions.** What's the default move, and *why* — list the analogies / norms / habits it rests on, explicitly. ("Per-seat, because SaaS prices per-seat and sales can forecast it" → assumptions: value scales with users · buyers expect per-seat · seats are countable.)
3. **Strip to axioms.** Remove each assumption that's "because that's how it's done." What irreducible truths remain about *this* problem? (e.g. "the cost we incur scales with compute, not users" · "the buyer is one team with a fixed budget" — facts, not norms.)
4. **Rebuild from the axioms alone.** Reason up to an answer using only what survived. (e.g. "if cost scales with compute and the buyer has a fixed budget, usage-based pricing tracks value and cost better than per-seat.")
5. **Surface the divergence.** Where does the rebuilt answer differ from convention? That gap is the finding — name it plainly, and its consequence. **If there's no divergence, say so** ("convention is already first-principles-sound here") — that's a valid, useful result, not a failure.

## The output — the five-part structure, always

The output is the **structured reasoning itself, in the conversation** — its shape IS the value (graspable at a glance):

- **Question** — the one-sentence target.
- **Conventional answer + inherited assumptions** — the default + the named assumptions it rests on (each flagged *convention* / *analogy* / *habit*).
- **Axioms** — the irreducible truths that survived, each grounded (verified / definitional / *uncertain*).
- **Rebuilt conclusion** — the answer derived from axioms alone.
- **Divergence** — where rebuilt ≠ conventional, and what that implies (or "none — convention holds, here's why").

Lightweight by default: the analysis stays **in-chat** — think writes **no file**. Never write source or make the decision. To persist it, route to shape (below).

## After the analysis — offer to route it (don't decide, don't auto-run)

first-principles *reasons*; it does not decide or build. Once the note is up, *offer* — never auto-call — the next step, via `AskUserQuestion` (offer-next-action, ADR-007/015):

- **Converge it into a decision** → `/shape:elicit` (the divergence is a strong input to the grill — but the *decision* is still drawn out with you, not asserted here).
- **Render the rebuilt option** → `/shape:mockup` (when the divergence is something you'd decide by seeing it).
- **Ground it into code** → `/nav:plan` (when the rebuilt answer is settled enough to build).

**Guarded + one-shot:** compose from what the analysis actually found, always include a "just leave the note, I'll take it from here" opt-out, don't re-offer after the pick. An offer, not a call — skills don't invoke each other.

## When it fires — and the boundary that matters most

**Summoned on a "reason this from the ground up / challenge the assumptions" request** — not auto-fired because a hard question appeared.

- **vs `/shape:elicit` (the line to hold):** elicit draws the answer **out of you** by a grounded grill — *you* hold it, elicit is maieutic (`react-not-author`). first-principles **derives** an answer from the problem's base truths — the agent applies the frame, the answer comes from the axioms, not from your gut. **elicit extracts; first-principles derives.** They pair: run first-principles to get a grounded divergence, then `/shape:elicit` to converge it into a decision *with you*. When the question is really "help me surface what *I* already think", that's elicit, not this.
- **vs `/think:orthogonal`:** first-principles decomposes **down** to axioms and rebuilds up (depth); `orthogonal` factors **sideways** into mutually-independent axes (separation). The two ways to take a problem apart — reach for `orthogonal` when something feels like one messy thing hiding several independent problems.
- **vs `/research:dissect`:** dissect anatomizes an *external document's* argument; first-principles reasons about *your problem* from scratch — no source text.

## Anti-patterns (refuse these)

| Temptation | Why to refuse |
|---|---|
| Relabel the conventional answer as "first principles" | If the axioms still carry a convention, you didn't strip far enough. The test for every premise: *true, or just usually done?* |
| Reverse-engineer axioms to reach the answer you already wanted | Motivated reasoning — the most common failure. Rebuild *forgetting* the conventional answer; let the axioms lead. |
| Assert an axiom you didn't ground | A fabricated premise yields a confident wrong answer. Verify physical/factual axioms; mark the uncertain ones *uncertain*. |
| Skip the divergence (just present a tidy derivation) | The divergence (rebuilt ≠ convention) is the payload. No divergence is a valid result — but say it explicitly. |
| Decide or implement here | first-principles reasons + routes. The decision is `/shape:elicit`; the build is `/nav:plan`. |
| Fire on any hard question in passing | Summoned on a "reason from first principles / challenge the assumptions" request. |

## Example — the move (domain-neutral)

**Question:** "Should our API gateway have a separate rate-limiter service?"

- **Conventional answer + assumptions:** Yes, a dedicated rate-limiter service. *(analogy: big systems have one · habit: "separation of concerns" · convention: the reference architecture shows one.)*
- **Axioms (grounded):** rate-limiting needs a shared counter with atomic increments *(definitional)* · our traffic is 2k req/s on one region *(verified)* · we already run Redis with atomic ops *(verified)* · a network hop adds ~1ms p50 *(verified)*.
- **Rebuilt conclusion:** A shared atomic counter is the only hard requirement; Redis already provides it in-process to the gateway. At 2k req/s single-region, a separate service adds a hop and an operational unit for no axiom-level benefit.
- **Divergence:** Convention says "separate service"; first principles says "a Redis Lua script in the gateway" until traffic spans regions or services. The separate service is solving a *scale* problem we don't have yet — it's inherited from architectures that do.

The note turns "everyone has a rate-limiter service" into "we need a shared atomic counter, which we already have — defer the service until multi-region."

## Output

- **The five-part structure, in-chat** (no file artifact): Question · Conventional answer + assumptions · Axioms (grounded) · Rebuilt conclusion · Divergence. To persist it, route to shape (below).
- A guarded, one-shot **offer** to route the insight — `/shape:elicit` (converge) · `/shape:mockup` (render) · `/nav:plan` (ground) — never an auto-call.

## Companion skills

- **`/shape:elicit`** — converge the divergence into a decision *with the user* (first-principles derives the input; elicit draws out the call). The pairing partner.
- **`/shape:mockup`** — render the rebuilt option when it's decided by seeing it.
- **`/nav:plan`** — ground the rebuilt answer into a code-level plan once settled.
- **`/think:orthogonal`** — the separation lens (factor sideways into mutually-independent axes); first-principles is the depth lens. The two decomposition moves.

## Communication Style
- Always explain concepts using simple, direct, and plain language (請用簡單、白話的語言解釋).
- Use analogies and metaphors frequently to explain complex programming or design concepts (請多使用易懂的比喻來解釋複雜的程式或設計概念).
- Use Traditional Chinese (Taiwanese phrasing) for all user-facing explanations.
- Avoid academic jargon and unnecessary verbosity.
- Keep explanations concise and actionable.
