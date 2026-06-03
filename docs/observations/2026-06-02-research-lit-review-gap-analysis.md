---
date: 2026-06-02
status: raw
---

# Research lit review: frame the read around YOUR claim, not the papers

> Source: Enact paper research session — reading 9 core papers + BDI papers + web search to map prior art. The pattern that made the output useful was giving the subagent the specific claim to evaluate against, not asking for summaries.

## The case

Reading 9 PDFs to map the prior art landscape for a research paper (Enact — identity-conditioned agent runtime). Two approaches were available:

**Approach A (naive):** "Read these papers and summarize them."
Result: would have produced per-paper abstracts with no connection to the research gap.

**Approach B (used):** "Read these papers. The paper being written claims X. For each paper, tell me what they propose, what they leave undone, and whether they overlap with claim X. Then synthesize: already done / not yet done."

Result: produced a precise gap analysis — two unoccupied gaps identified across 9 papers (identity-conditioned perception, manner as structured output), and a clear related-work priority order.

## The move

The useful unit is not "what does this paper say" but "what does this paper do vs. leave undone, given your specific claim."

This requires injecting the claim into the read prompt, not just asking for summaries. The claim becomes the frame through which every paper is evaluated.

Concretely:
1. State the specific claim you're making (1-2 sentences, precise)
2. Ask the agent to evaluate each paper against that claim: overlap? gap? prior art?
3. Ask for a synthesis in two sections: **Already done** (cite as prior art) / **Not yet done** (the gap your paper fills)

## On tooling: subagent for PDF batch reads

PDF batch read via subagent (Agent tool) is the right tool for reading 5+ papers:
- Protects main context window (each paper can be 10-15 pages)
- Agent can read in parallel across papers
- Returns a structured synthesis directly

Running in background (`run_in_background: true`) allows other work to continue while the read happens. Works well when the synthesis question is clear upfront.

## The failure mode to avoid

Asking "find papers related to X" without specifying the claim precisely. This yields a topic-based survey (papers about roleplay, papers about persona) rather than a gap analysis. The gap analysis is only possible when the specific claim is injected.

## Candidate skill: `research`

This pattern is the core of a `research` skill:
- Input: a specific claim + a set of PDFs (or keywords for web search)
- Output: prior art landscape (already done / gap), related work priority order, open questions surfaced
- Sub-steps: PDF batch read via subagent → gap analysis against claim → open questions → save to raws/
