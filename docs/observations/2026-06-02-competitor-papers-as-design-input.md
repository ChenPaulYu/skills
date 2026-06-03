---
date: 2026-06-02
status: raw
---

# Competitor papers as method design input: extract design feedback, not just gap analysis

> Source: Enact paper research session — reading TTM, Codifying Character Logic, and Character-R1 as competitors, then asking "what does their empirical finding imply for my method design?"

## The pattern

Literature review has two uses that are usually conflated:
1. **Gap analysis**: what has already been done vs. what hasn't (covered in [[research-lit-review-gap-analysis]])
2. **Design feedback**: what do competitors' empirical results imply about HOW to build your method?

The second use is rarer and more valuable. The question is not "did they do X?" but "their empirical finding Y — what does that mean for my design decision Z?"

## The move

After classifying a paper's contribution, ask: **"what does this paper's empirical validation tell me about my own method's design?"**

This is most productive when a competitor paper validates a structural choice you're considering but haven't committed to yet.

## Examples from this session

**TTM** (Test-Time-Matching) validated Enact's operation/manner decomposition:
- TTM's three stages: styleless response (cognitive only) → memory-checked → style matching
- This is structurally: operation (what, style-free) → manner (how, style-conditioned)
- TTM showed empirically that separating cognitive content from expressive style WORKS
- Design feedback for Enact: the decomposition is empirically justified; manner has two sub-layers (cognitive vs. expressive)

**Character-R1** informed Enact's manner schema dimensions:
- Character-R1 uses 10 cognitive focus dimensions as verifiable reward labels
- These dimensions map to what Enact's manner output needs to capture
- Design feedback: manner schema dimensions should correspond to the behavioral expression of these cognitive foci; making manner a verifiable structured output (not free-form) is how to build a trainable fidelity signal

**Codifying Character Logic** suggested a perception implementation model:
- Compiles identity into `parse_by_scene(scene)` functions (execute per turn, not inject per turn)
- Design feedback: identity-conditioned perception can be implemented as `identity.interpret(situation)` (identity as operator) rather than `LLM(identity_text + situation_text)` (identity as context)

## Why this is distinct from gap analysis

Gap analysis asks: **"has anyone done X?"** → binary: yes / no
Design feedback asks: **"what did their results prove?"** → design decision: how to build Y

A paper can be "already done" in gap analysis terms AND provide useful design feedback — these are orthogonal. TTM is prior art (it validates the decomposition exists), but it's also design input (it shows the decomposition works and suggests how to structure it).

## When to apply

Most productive when:
- You have design decisions that are currently open (not yet committed to an implementation)
- A competitor paper has empirical validation (not just a proposal) of something structurally similar
- The competitor's approach is at a different layer than yours — so there's no direct competition, but the empirical evidence transfers

Least useful when the competitor paper is too far from your problem to transfer findings.
