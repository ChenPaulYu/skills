---
date: 2026-06-03
status: raw
---

# Argument anatomy: Gap → Claim → Mechanism → Evidence

> Source: Enact paper research session — developing a structured template for deep-reading baselines and related-work papers, using ReAct as the first worked example.

## The framework

Decompose any paper (or argument) into five layers:

1. **Gap** — What's missing or broken in the world? Why is it a problem?
2. **Claim** — What does this work propose to fix it?
3. **Mechanism** — How does it technically work?
4. **Evidence** — What experiments / results support the claim? (include task description, comparison baseline, result, explanation of why it proves the claim)
5. **Conclusion** — What do they want the reader to believe at the end?

The output should be written for a reader who doesn't already know the domain — benchmarks get a short description ("a task where the agent must...") before the numbers, so results are self-interpreting.

## Why this is useful

Most paper summaries answer "what did they do?" This framework answers "what argument are they making, and is the evidence sufficient?"

The unit of analysis is the **argument**, not the paper. That reframing makes the output useful for two things simultaneously:
- Understanding the paper on its own terms
- Evaluating whether the conclusion holds — and what it leaves open

The second use is what makes literature review productive: you're not cataloguing papers, you're mapping what has been argued and proven, so you can see what hasn't been argued yet.

## The "already done / gap" connection

This framework is the single-paper input to the claim-framed landscape analysis described in [[research-lit-review-gap-analysis]]. The landscape analysis synthesises across papers; this framework is how you produce something worth synthesising.

Concretely: once you have Gap/Claim/Mechanism/Evidence for each paper, you can lay them side by side and ask:
- Do they address the same gap?
- Does their Conclusion leave something unproven?
- Is there a gap in their gaps — something none of them even attempt?

That last question is where your own claim lives.

## Worked example: ReAct

- **Gap**: CoT agents can reason but not act; Act agents can act but not plan. Neither can update their world model mid-task.
- **Claim**: Interleave reasoning (Thought) and acting (Action) in the same forward pass.
- **Mechanism**: Observation → Thought → Action → Observation loop, all in one token sequence.
- **Evidence**: ALFWorld 71% vs Act-only 45%; WebShop 40% vs 30%; HotpotQA + FEVER: ReAct > CoT on fact-dependent tasks.
- **Conclusion**: Thought should be a structural component of the agent runtime, not a post-hoc output format.

## Candidate skill

`research:read` — deep-read a single paper or document using argument anatomy. Input: the document + the specific claim you're evaluating it against. Output: structured Gap/Claim/Mechanism/Evidence + "what does this leave open for my claim?"
