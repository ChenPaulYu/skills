---
date: 2026-06-06
status: raw
---

# Reviewing a paper converges by claim↔evidence audit + self-attack — and the self-attack is the kernel

> Source: one long session writing an ISMIR referee report for a diffusion sound-morphing paper (#370), at `06-notes/ismir2026-reviews/notes/370-{smorph,review-draft}.md`. The review went through ~30 rounds and landed at *Weak Accept, conditional on re-scoping*. This is the **assessment** counterpart to [[2026-06-03-paper-analysis-gap-claim-mechanism-evidence]] (which captures *dissecting* a paper — Gap/Claim/Mechanism/Evidence — i.e. understanding what it argues). Dissect = "what does it claim?"; this = "does the evidence hold, and what survives an adversary?". **Candidate skill** `research:critique` (a referee verb to sit beside `dissect` + `map`). Not promoted: `raw`, one session.

## What happened — the moves that repeated

Across every claim and every RQ, the same handful of analytical moves recurred:

1. **Pull the verbatim claim** from the abstract / contributions (e.g. "structural decomposition improves structural adherence **and** timbral progression without sacrificing quality").
2. **Map each claim to the table that should support it**, and read the actual numbers — surfacing the gap **"what's validated ≠ what's claimed."**
3. **Ladder attribution** — when there's an ablation chain (CoA → smorph_i → smorph_e), locate *which step* the gain comes from. Here the big jump was at "+structure conditioning" (near-tautological, and borrowed from a cited prior work), while the *proposed* step ("+decoupling") actually *lowered* the headline metric.
4. **Metric scrutiny** — does the headline composite drop the axis the method loses on? (It reported Struct×Smoothness and omitted the magnitude axis FLAM Δ, on which the method fell below baselines.)
5. **Novelty bounding** — decompose the method into prior components (Eq.4 = multi-prompt CFG ⊕ hierarchical CFG ⊕ a Sketch2Sound-style backbone) to size the true delta.
6. **Severity + fairness calibration** — major/minor, and credit the authors' honesty ("commendably transparent").

## The kernel — self-adversarial verification (the part worth a skill)

The single move that made the review *defensible* was **attacking each finding before shipping it** — recompute with a different metric, try the most charitable reading of the claim, or check whether the paper actually does the thing you're about to say it doesn't. Findings that didn't survive were **cut, with the reason logged**. In this session the self-attack killed or downgraded five candidate criticisms:

- "Missing MorphFader baseline" → cut (not load-bearing).
- "They should position Eq.4 vs its components" → cut (the paper *does*, in §3.1).
- "FLAM circularity is acute" → downgraded to a narrow caveat (it misses the FLAM-free headline metric and partly cancels in the head-to-head).
- "Headline metric is rigged to hide a loss" → softened (recompute showed a magnitude-inclusive composite *still* favours the method on RQ1 — so it's a transparency ask, not a reversed conclusion).
- "The ablation beats the proposed method everywhere" → withdrawn (true on one dataset, but the proposed step is a legitimate more-expressive operating point on the other).

**Tell that you skipped the self-attack:** a criticism that sounds sharp but flips the moment you recompute one number or read the claim charitably. Notably, in this session most of these were caught only because *the user* pushed ("is smorph_i actually their proposal?", "isn't that composite already the tradeoff?", "do they really not position Eq.4?"). A skill should make the self-attack a **default, proactive pass**, not something the human has to force.

## The principle

> **Reviewing converges by mapping every claim to the evidence that should support it (validated ≠ claimed), then adversarially verifying every criticism *you* raise before it ships — cut what can't survive a recompute or a charitable reading, and keep a cut-log so it doesn't get re-litigated.** The reviewer's credibility comes as much from what they *cut* as from what they keep.

## What it could become — `research:critique`

A referee verb beside `dissect` (understand one) and `map` (landscape many). Best on empirical papers with tables/ablations; degrades gracefully on theory/qualitative (skip number-checks, keep claim↔evidence + self-attack). Shape: a **collaborative phased pipeline with human checkpoints**, because the verdict and voice belong to the reviewer:

- ***Ground (first-class — it *enables* the self-attack)*** → extract verbatim claims + a claim↔table map, AND ground the *attack surfaces* (exact metric formulas · each ablation arm · what is fine-tuned · what each knob does) to *recompute-depth*. You can only refute a finding — recompute it, re-read the claim charitably, check the paper actually fails to do X — on a mechanism you have grounded. So grounding and self-attack are **coupled, not sequential decoration**: shallow grounding → wrong critiques that the self-attack can't even catch. This grounding is **intent-scoped, not "understand the paper"** — reuse `dissect`'s descriptive skeleton, then ground deeper only where you will strike (see [[2026-06-06-grounding-is-intent-relative]]).
- *Audit* (checkpoint) → per-claim validated/not/narrower ledger.
- *Scan* → ladder attribution · metric completeness · tautology check · novelty bounding.
- ***Self-attack (the non-negotiable core)*** → refute each finding; cut non-survivors → **cut-log**.
- *Calibrate* (checkpoint) → severity, fairness, value↔rigor reframe; **user sets the rating**.
- *Draft* (checkpoint) → review in the reviewer's voice + a two-layer artifact (full-evidence analysis note ↔ lean review draft that points back to it).

Non-negotiable feature: **every finding ships with a "I attacked this — survived (evidence) / cut (reason)" stamp.** Without it the skill is just a complaint generator; with it, every line is pre-pressure-tested.

The **two coupled cores** are *Ground* (deep enough to judge) and *Self-attack* (so only the defensible survives) — the second is powered by the first. Everything else is supporting scaffolding. Note: "draft in the reviewer's voice" is **generic voice-matching from examples — a cross-cutting convention, not part of the critique kernel**; and the grounding-front-end Q&A that looked like generic explanation was this *Ground* phase all along.

## Why outward-useful (and why raw)

Not person-specific — any referee report or critical read benefits, and an LLM is *especially* prone to ship plausible-but-fragile criticisms (sharp tokens are cheap; recomputing is the discipline it skips). Connects to [[2026-06-01-verify-the-belief-before-acting-on-it]] — same "verify before acting", applied to your own criticisms. One session so far → `raw` (ADR-018 gate); promote if the claim↔evidence + self-attack loop recurs on the next paper review.
