---
date: 2026-06-02
status: raw
---

# Layer taxonomy: classify papers by contribution level to find where the field's gaps actually are

> Source: Enact paper research session — reading 10+ papers on agent runtimes and character agents.
> The layer taxonomy turned "all these papers are related work" into a precise competitive map, and revealed that the claimed level of a paper is often not its actual level.

## The pattern

When mapping a research field, classify each paper's contribution by **layer**:

For agent systems, the layers are:
- **Runtime**: the loop structure itself changed (what phases exist, how they're connected)
- **Prompt**: what's put into the context window changed (injection point, format, frequency)
- **Memory schema**: how identity/knowledge is structured and stored
- **Memory mechanism**: how memories are retrieved or updated

The classification reveals:
1. Where the field's attention is actually concentrated
2. Where the genuine gaps are (layers nobody has touched)
3. Which papers are misclassified — claiming a higher level than they actually operate at

## The key move: verify the claimed level

Papers often claim to be "runtime" or "architectural" when they're actually "prompt" or "mechanism."
The verification question: **does the loop phase structure change, or does the content in the context window change?**

Examples from this session:
- **RAR** claimed to be runtime (identity injected during reasoning). But: the Thought→Act→Obs loop structure is unchanged. C_R is natural language text placed in context per step. That's aggressive prompt injection, not runtime redesign.
- **ID-RAG** looked like runtime (identity dynamically intervenes per step). But: it's ReAct + RAG — the loop doesn't change, only what gets retrieved into working memory. That's memory mechanism, not runtime.
- **ReflAct** IS runtime: it replaces the thought generation instruction itself, changing what the "thought" phase produces structurally.

The criterion: if you removed the contribution, would the loop phase structure be different? If no → it's prompt or mechanism, not runtime.

## The gap it reveals

After classifying all papers, the layer map showed:
- Runtime (character agent domain): **zero papers** had done identity conditioning at runtime level
- Prompt: crowded (most character agent papers)
- Memory schema/mechanism: crowded (MDRP, SPeCtrum, ID-RAG, etc.)

This made the novelty claim clean: not "we do runtime better than X" but "we are the first to do runtime-level identity conditioning in character agents."

## Application to other fields

The specific layers (runtime / prompt / schema / mechanism) are agent-system-specific, but the pattern is general:

1. Choose 3-4 layers that carve the contribution space for your field
2. Classify every paper into one or more layers (be honest — don't accept the paper's self-description)
3. Verify claimed layers with a simple falsification question: "if you removed this contribution, what specifically changes?"
4. Read the layer map for gaps

The layer taxonomy is most valuable when combined with the first-principles positioning check ([[first-principles-positioning-check]]): the taxonomy shows where the field is, the positioning check verifies where your paper actually sits.
