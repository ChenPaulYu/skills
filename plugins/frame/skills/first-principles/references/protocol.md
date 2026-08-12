# first-principles — walk-through, worked example, anti-patterns

> Moved verbatim from the pre-ADR-109 SKILL.md body. The SKILL.md Stance carries the operative
> discipline (the forced five-part structure + the plain-language landing gate); everything here
> is the elaborated procedure, loaded on demand.

## The walk

1. **State the question sharply.** One sentence — the decision/belief under examination ("should onboarding be a wizard?", "do we need a separate cache service?", "is per-seat the right pricing?").
2. **Name the conventional answer + its inherited assumptions.** What's the default move, and *why* — list the analogies / norms / habits it rests on, explicitly. ("Per-seat, because SaaS prices per-seat and sales can forecast it" → assumptions: value scales with users · buyers expect per-seat · seats are countable.)
3. **Strip to axioms.** Remove each assumption that's "because that's how it's done." What irreducible truths remain about *this* problem? (e.g. "the cost we incur scales with compute, not users" · "the buyer is one team with a fixed budget" — facts, not norms.)
4. **Rebuild from the axioms alone.** Reason up to an answer using only what survived. (e.g. "if cost scales with compute and the buyer has a fixed budget, usage-based pricing tracks value and cost better than per-seat.")
5. **Surface the divergence.** Where does the rebuilt answer differ from convention? That gap is the finding — name it plainly, and its consequence. **If there's no divergence, say so** ("convention is already first-principles-sound here") — that's a valid, useful result, not a failure.

## Example — the move (domain-neutral)

**Question:** "Should our API gateway have a separate rate-limiter service?"

- **Conventional answer + assumptions:** Yes, a dedicated rate-limiter service. *(analogy: big systems have one · habit: "separation of concerns" · convention: the reference architecture shows one.)*
- **Axioms (grounded):** rate-limiting needs a shared counter with atomic increments *(definitional)* · our traffic is 2k req/s on one region *(verified)* · we already run Redis with atomic ops *(verified)* · a network hop adds ~1ms p50 *(verified)*.
- **Rebuilt conclusion:** A shared atomic counter is the only hard requirement; Redis already provides it in-process to the gateway. At 2k req/s single-region, a separate service adds a hop and an operational unit for no axiom-level benefit.
- **Divergence:** Convention says "separate service"; first principles says "a Redis Lua script in the gateway" until traffic spans regions or services. The separate service is solving a *scale* problem we don't have yet — it's inherited from architectures that do.

The note turns "everyone has a rate-limiter service" into "we need a shared atomic counter, which we already have — defer the service until multi-region."

## Anti-patterns (refuse these)

| Temptation | Instead — and the tell |
|---|---|
| Relabel the conventional answer as "first principles" | Keep stripping until every premise passes *true, or just usually done?* — if an axiom still carries a convention, you didn't strip far enough. Tell: the "irreducible axiom" is itself a common industry practice, not a fact. |
| Reverse-engineer axioms to reach the answer you already wanted | Rebuild *forgetting* the conventional answer and let the axioms lead. Tell: you picked which axioms to list only after knowing where you wanted to land. |
| Assert an axiom you didn't ground | Verify physical/factual axioms and mark the uncertain ones *uncertain* — a fabricated premise yields a confident wrong answer. Tell: you can't point to why the axiom is true, only that the derivation needs it. |
| Skip the divergence (just present a tidy derivation) | State the divergence (rebuilt ≠ convention) explicitly — that comparison is the payload, and "no divergence" is a valid result only if said out loud. Tell: the output reads like a derivation with no sentence comparing it back to convention. |
| Decide or implement here | Reason + route — the decision is `/shape:elicit`, the build is `/nav:plan`. Tell: the reply starts proposing an implementation instead of offering the route. |
| Fire on any hard question in passing | Wait for an explicit "reason from first principles / challenge the assumptions" request. Tell: about to run the full strip-and-rebuild on a question that was just asked in passing. |
| End on a jargon sentence ("the axiom is X, so the rebuilt conclusion is Y") | Close with a plain-words conclusion + analogy as the actual last word. Tell: the final sentence needs "axiom" or "first principles" to parse. |
