# ADR 047 — `think` gains `dialectic`: put a claim on trial (steelman both sides → deciding experiment)

**Status**: accepted
**Date**: 2026-06-16
**Amends**: [ADR-034](034-think-plugin.md) (the think charter — its roster gains a third lens) · [ADR-046](046-think-orthogonal-lens-drop-speculative-seed.md) (the parked `steelman` candidate it named now graduates, reframed)
**Builds on**: [ADR-018](018-promotion-gate-is-evidence-not-session-count.md) (promote by evidence) · [ADR-045](045-think-is-lightweight-in-chat.md) (lenses reason in-chat) · [ADR-013](013-diagnosis-folds-into-elicit.md) (same-engine → don't fork razor)

## Context

A recurring, evidenced need: the user works on **paradigm-class questions with no standard answer** — *"is identity a thing you store or a thing you run?"*, *"is this a new primitive or an old one renamed?"*, *"is this approach a real innovation or just a longer prompt?"*. For these, idea quality is decided by one ability: **holding the supporter's and the attacker's view at full strength simultaneously**, then naming what would settle it. The user reaches for a fixed move repeatedly — a table: **Claim · Steelman · Devil's Advocate · Missing Evidence · Killer Experiment** — and reports it "very useful," with named recurring uses across several of their projects. That is exactly the standing ADR-018 requires (evidence of real recurring use, not a famous-model guess).

ADR-034 and ADR-046 both **parked `steelman`** as a thin candidate ("stay parked until they prove a distinct forced structure"). It has now proven one — but the proven move is *broader* than the one-sided `steelman`: it steelmans **both** sides and **adjudicates** with an experiment. So it graduates under a name that fits the whole move.

Two questions, per the think charter:

1. **Does it clear the value-guardrail** (forces a structure the default skips)? **Yes.** The default "weigh it up" gives lukewarm pros/cons, strawmans the opposition by reflex, and names no decider. dialectic forces three things the default omits: (a) **symmetric maximal charity** — the *attack* is steelmanned too, built until it worries you; (b) each side as an **explicit inference chain with every arrow tested** (cause vs correlation / coincidence / missing variable); (c) a **Killer Experiment** that turns philosophy into a testable claim. Without these it's ceremony; with them it's a structure the model won't produce unprompted.

2. **Is it distinct from existing skills** — especially `/research:critique` and `/think:first-principles`? **Yes** — see the boundary table below.

## Decision

1. **Add `dialectic` as the third built lens.** Forced structure: **Claim → Steelman → Devil's Advocate → Missing Evidence → Killer Experiment**, plus a **three-way verdict**. In-chat, no artifact ([ADR-045](045-think-is-lightweight-in-chat.md)).
2. **The verdict is three-way, not pass/fail** — the design's load-bearing decision. For a claim no one has tested, "no evidence" is **not** a refutation; it is an **unsettled, owned bet**. The three buckets: **refuted** (chain snaps, or contradicted by *existing* evidence — dies), **unsettled-owned-bet** (coherent, uncontradicted, deciding experiment unrun — the *expected* result for frontier work), **supported**. The move dialectic performs is one conversion: a *hidden, fatal assumption* → *a visible, owned bet*. The sin it guards against is not having an unproven assumption (frontier work always does) but **mistaking it for a fact**. Awareness covers genuine unknowns only — it cannot excuse a broken chain or existing counter-evidence.
3. **Name it `dialectic`, not `steelman`.** The move is two-sided (thesis + strongest antithesis) and ends in adjudication — `steelman` names only the constructive half. The description pins the one inaccuracy risk: here the resolution is a **deciding experiment**, not classical dialectic's *synthesis*.
4. **Fold two sub-techniques in as disciplines, not new rows/skills** (rule ① — no leakage):
   - The **arrow-chain / link-validity** check (is A→B cause, or correlation / coincidence / missing variable?) becomes the rigor of the Steelman & Devil's Advocate rows — a steelman with a snapped arrow is a strawman in disguise. Not a separate lens; if standalone single-chain auditing later shows recurring use, *that* is the evidence to spin out a fourth lens — by evidence, not now.
   - The **hidden-assumption ladder** is **already `first-principles`** — dialectic does not re-do it. first-principles surfaces the deepest assumption; that assumption *becomes* dialectic's Missing Evidence. A hand-off, not a copy.
   - The **Toulmin claim/evidence accounting** ("evidence does not support the claim → claim too big, evidence too small") is **already owned**: `/research:critique` for external docs, and inside dialectic it falls out of honestly filling Missing Evidence. Not a new row.

## `dialectic` vs its neighbours

| | `dialectic` | `/research:critique` | `/think:first-principles` |
|---|---|---|---|
| object | **your own forming claim** | an **external document** | a question / belief |
| evidence | the decider **doesn't exist yet** (you design it) | audits the evidence **already there** (validated ≠ claimed) | n/a — reduces to axioms |
| move | trial: steelman both → adjudicate | referee an argument vs its data | reduce → rebuild |
| output | Claim · Steelman · Devil's · Missing Evidence · Killer Experiment + 3-way verdict | analysis note + review draft | assumptions · axioms · rebuilt · divergence |

The trio framing: `first-principles` decomposes a problem **down**, `orthogonal` factors it **sideways** — both take a problem *apart*. `dialectic` does not decompose; it puts a *claim* **on trial**. Same family (a named frame forcing a structure the default skips, in-chat, feeds shape one-way), distinct operation.

## Consequences

- `think` roster: **3 built lenses** (`first-principles` · `orthogonal` · `dialectic`); no "planned" members listed. `think` v0.2.0 → **0.3.0**.
- `dialectic` is invoked as `/think:dialectic`. New `plugins/think/skills/dialectic/SKILL.md`; `plugin.json` + `CLAUDE.md` roster reframed (two-take-apart + one-on-trial); the through-line's stale "negate / project-forward" (the dropped seed's procedures) corrected to the real three.
- Generated artifacts: Codex mirror gains `think-dialectic` (23 → 24 skills); `AGENTS.md` + cursor projection + marketplace version regenerated by `build-codex.mjs` / `build-manifests.mjs`; validator must stay green.
- Gating surfaces (repo-root CLAUDE.md roster gate): `README.md` (plugin table + think skills list) + `docs/site/index.html` (think node/blurb 2 → 3 lenses, a `/think:dialectic` command card, header skill count, rev bump + FIXED) both updated in this commit. ADR count 46 → 47.
