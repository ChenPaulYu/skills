---
date: 2026-06-15
status: raw
---

# The evidence gate cuts both ways — a roster member added on speculation and never used should be PRUNED, not parked as "planned"

> Source: this session — adding the `orthogonal` lens to `think`, which forced an audit of think's existing `invert` / `second-order` "seed family".

## What prompted it

Adding a new lens (`orthogonal`) raised "where does it sit relative to the planned `invert` / `second-order` seed family?" Checking *why* those two were on the roadmap revealed they were named in [ADR-034](docs/adr/034-think-plugin.md) because they are **famous mental models** — not because there was any evidence the user reaches for them.

## The signal

[ADR-018](docs/adr/018-promotion-gate-is-evidence-not-session-count.md) is usually read as a **promotion** gate: don't *add* a skill without evidence. But it is **symmetric** — it is also a **retention** gate. A roster item added on speculation and left as "planned / seed" doesn't sit neutrally; it **decays into a false roadmap** — listed beside evidenced members, it borrows a standing it never earned, and reads to every future reader as "coming soon, decided" when it is really just a guess.

The audit that distinguishes the two is **mechanical**: grep the evidence base (`docs/observations/`) for actual *usage* of each member, and **separate real use from incidental word-matches**. Here every `invert` hit was the everyday verb ("the hierarchy was inverted", "descend, not invert" — itself about *first-principles*); `second-order` appeared in **zero** observations. Meanwhile `first-principles` had real entries and `orthogonal` had the user's stated frequent use. Verdict: the speculative pair had no more standing than the parked `steelman` / `analogize` → **cut them from every live surface**, don't keep parking them.

## The move

When you touch a roster (a plugin's skills, a "seed family", a planned list), **grep the evidence base for each member and apply the gate in both directions**:
- no evidence + not yet built → it's a *guess*, not a *plan* — **don't list it** as a committed seed (or cut it if already listed).
- real recurring use → promote/build it (e.g. `orthogonal` here).

Keep the historical ADR intact (supersede forward), but scrub the **live** surfaces (manifest · CLAUDE.md · README · site · cross-refs) so the roster reflects evidence, not aspiration. This is [[2026-06-15-capability-placement-object-guardrail-distribution]] applied to *membership over time*: that cascade decides *whether/where* a capability belongs; this decides *whether a listed-but-unused one still earns its slot*.

## Evidence so far

- **Only case (2026-06-15, this marketplace session)**: dropped `invert` / `second-order` from `think` while adding `orthogonal`, after a `docs/observations/` grep audit found zero lens-usage of the dropped pair ([ADR-046](docs/adr/046-think-orthogonal-lens-drop-speculative-seed.md), amending [ADR-034](docs/adr/034-think-plugin.md)).

(One case → stays `raw`. **Trip-wire**: if a second speculative roster item gets pruned by the same grep-the-evidence audit, promote this into an ADR/guardrail — "audit a roster against its evidence in *both* directions; a never-used 'planned' member is debt, not a roadmap.")
