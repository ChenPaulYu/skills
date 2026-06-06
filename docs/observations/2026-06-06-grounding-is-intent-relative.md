---
date: 2026-06-06
status: raw
---

# Grounding is intent-relative — it has no intent of its own, so it can never be its own skill

> Surfaced while scoping a candidate `research:critique` skill (see [[2026-06-06-adversarial-paper-critique-self-attack-is-the-kernel]]). The question was "the *deep mechanism grounding* we did before critiquing — does it belong to `dissect` or `critique`?" The answer turned out to be more fundamental than the skill itself, and to generalize across the whole marketplace. Not promoted: `raw`, one session — but it's a candidate *convention* (how grounding phases are written in every skill), not a skill of its own.

## The question

Reviewing a paper required understanding its mechanism *deeply* — deep enough to recompute a metric, to know why a guidance scale was forced low, to realize an existing noise sweep already traced a trade-off curve. That depth felt like it deserved a home. Is it part of `dissect` (understand the paper) or part of `critique` (assess it)?

## The answer — neither owns it; intent sets the grain

Both `dissect` and `critique` ground the *same* paper, but they do **different grounding**, because the **intent** decides *what* gets grounded and *how deep*:

- **`dissect`** grounds to **restate** → breadth: the mechanism skeleton, the overall argument. Shallow-but-wide.
- **`critique`** grounds to **attack** → depth, but only on the *attack surfaces*: the exact metric formulas, each ablation arm, what is fine-tuned, what each knob does. It deliberately grounds things `dissect` has no reason to touch — because those are where it will strike.

So it is **not** "the same grounding with two labels." The intent *changes the grounding into a different thing*. Same move generalizes beyond papers:

- Same codebase: `nav:audit` grounds it for "is this modular?"; `nav:plan` grounds it for "can it carry this spec?" — different things looked at, different depth.

## The consequence (the load-bearing bit)

> **Grounding has no intent of its own — it is always "grounding *for* X." Detach it from an intent and there is no basis for *what to ground* or *how deep*, so it degenerates into aimless explanation. Therefore grounding can never be a standalone skill; it lives *inside* an intent-bearing skill, shaped by that skill's goal.**

This resolves two scoping questions at once:

1. **Attack-grade grounding belongs to `critique`, not `dissect`** — because the *attack* intent sets the grain. `critique` can *reuse* `dissect`'s descriptive skeleton, then ground deeper exactly where it will strike (reuse direction: critique → consumes → dissect).
2. **The "conceptual Q&A" front-end of a review session is not a separate skill** — it is `critique`'s grounding phase. It only looked like generic explanation; in fact each question was grounding a specific surface the critique would later test.

Practical upshot for writing skills: a grounding phase should never be written as "understand the artifact." Write it as **"ground *these* surfaces (the ones the skill's verb will act on) to the depth that verb needs"** — so grounding stays demand-driven by intent instead of sprawling.

## Why it matters / why raw

It's the same insight as [[2026-06-05-measured-paints-intent-decides]] one level up: the *measured ground* can be shared, but **intent decides what you ground and what you do with it**. Connects the `dissect` / `critique` pair and the `nav:audit` / `nav:plan` pair under one rule. One session so far → `raw`; promote toward a marketplace-wide *convention* ("grounding phases are intent-scoped, not 'understand X'") if it keeps explaining scoping calls across families (ADR-018 gate).
