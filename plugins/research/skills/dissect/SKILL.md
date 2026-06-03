---
name: dissect
description: Dissect one or more papers, articles, or any argument-carrying documents into a structural skeleton — Gap (what problem?), Claim (proposed fix), Mechanism (how it works), Evidence (proof + benchmarks explained in plain language), Conclusion (what the reader should believe). Accepts a single document or a list — one dissection note per document. Works on academic papers, technical blog posts, competitor analyses, design proposals, RFCs. Use when you want to understand what a document *argues* and whether its evidence holds. Also fires on "break down this paper", "what does this paper claim?", "read this for me", "analyze this paper", "dissect these papers", "read all these for me", "help me understand these papers". For a synthesized landscape view across multiple papers (already done / gap / priority order), use /research:map instead.
---

# research:dissect

Decompose a document's argument into a fixed, comparable skeleton. The unit of analysis is the argument, not the text.

## Why this skill exists

Most document summaries answer "what did they do?" This skill answers "what argument are they making, and is the evidence sufficient?" That reframing makes the output useful for two things at once: understanding the document on its own terms, and locating what it leaves open relative to your own claim.

The output format is fixed so that multiple dissection notes can be laid side by side — across papers, blog posts, competitor analyses — and compared directly.

## The argument anatomy framework

Any document making a claim can be decomposed into five layers:

1. **Gap** — What is missing or broken in the world? Why is it a problem?
   - "What's happening now?" + "Why is this a problem?"
   - Be specific: what is the *failure mode* being addressed?

2. **Claim** — What does this work propose to fix it?
   - One or two sentences. The core thesis.
   - Not the method — the *claim* the method is supposed to prove.

3. **Mechanism** — How does it technically work?
   - The architecture, algorithm, or process that implements the claim.
   - Enough detail to understand the causal chain: "because X, it achieves Y."

4. **Evidence** — What experiments / results support the claim?
   - For each experiment: (a) describe the task in plain language, (b) name the comparison baseline, (c) state the result, (d) explain why this result supports the claim.
   - **Plain language first**: assume the reader doesn't know what a benchmark is — describe it before stating numbers.
   - Flag what the evidence *doesn't* prove: missing ablations, narrow conditions, confounds.

5. **Conclusion** — What does the author want the reader to believe at the end?
   - Not a summary of the paper. The *claim about the world* they want established.
   - Often: "X should be a standard component of Y" or "approach Z is insufficient because..."

## Scope

**Domain-agnostic.** The framework applies identically to:
- Academic papers (Gap = research gap; Evidence = benchmark experiments)
- Technical blog posts (Gap = engineering problem; Evidence = benchmarks or production metrics)
- Competitor analyses (Gap = market/product problem they identified; Evidence = their empirical results)
- Design proposals / RFCs (Gap = current system's limitation; Evidence = prototype results or user studies)
- Startup pitch decks (Gap = market problem; Evidence = traction, cohorts, interviews)

The labels are the same; the contents adapt to the source type.

## Protocol

### Step 1 — Detect mode and receive input

**Single-document mode**: user provides one document (file path, URL, or pasted text).
**Batch mode**: user provides a list of documents (paths, URLs, or a folder of PDFs).

In batch mode, announce the list upfront: "I'll dissect N documents and produce one note per document." Process them sequentially — finish one dissection before starting the next.

Accept documents in whatever form is provided:
- A file path (PDF, markdown, text)
- A URL
- Pasted text
- A folder path (read all PDFs/markdown files inside, sorted by name)

Read each document fully before dissecting it. Do not skim.

### Step 2 — Ask for the user's claim (optional but recommended)

Before dissecting, ask once: **"What is your own claim, in one sentence? I'll add an 'Implications for your claim' section to each note."**

Ask only once even in batch mode — the same claim frames all documents. If the user doesn't have one, skip the implications section in all notes.

### Step 3 — Dissect each document

For each document, work through all five layers in order. Rules:

- **Gap**: be specific about the failure mode. "Existing methods are insufficient" is not a gap. "CoT agents cannot verify their own reasoning outputs and cannot acquire new information after generation" is a gap.
- **Claim**: one or two sentences. If the paper has multiple claims, pick the central one and note the others.
- **Mechanism**: focus on the structural change, not the implementation details. "Inserts a Thought step before each Action in the same forward pass" is mechanism. "Uses GPT-4 with temperature 0.7" is not.
- **Evidence**: for every experiment —
  1. Name the task. Describe it in 1-2 plain sentences (what does the agent have to do? Why is it relevant to the claim?).
  2. Name the comparison baseline.
  3. State the result (numbers).
  4. Explain why this result supports the claim (not just "higher is better" — *why* does this gap matter for the claim?).
- **Conclusion**: what do they want you to believe at the end? This is often stated explicitly in the paper's last paragraph.

### Step 4 — Implications for your claim (if claim provided)

For each document, add a final section:

> **Implications for [user's claim]**
>
> - What this paper's Conclusion leaves open that your claim addresses.
> - Whether their Evidence contradicts, supports, or is orthogonal to your claim.
> - Whether their Mechanism overlaps with yours — and if so, how yours differs.

This section is the bridge from "understanding the paper" to "positioning your paper."

### Step 5 — Output

**Single-document mode**: produce one dissection note. Suggest `notes/<paper-shortname>.md` as the save path. Do not write without confirmation.

**Batch mode**: produce one note per document. Suggest `notes/<paper-shortname>.md` for each. Confirm save location once (apply to all, unless the user wants to specify per document). After all notes are saved, print a one-line summary table:

```
| Paper | Saved to | Status |
|-------|----------|--------|
| ReAct | notes/react.md | ✓ |
| Reflexion | notes/reflexion.md | ✓ |
...
```

> **Tip**: if you want a synthesized landscape view across all these documents — what's already proven, what gap remains, which papers are highest priority for related work — run `/research:map` with the same document set and your claim.

## Output format

```markdown
# <Title> — <one-line subtitle>

<Author(s)>, <Venue/Source>, <Date/arXiv ID if applicable>

---

## 1. Gap

**What's happening now?**
<one or two specific failure modes being addressed>

**Why is this a problem?**
<the consequence of the failure mode — what breaks, fails, or is impossible>

---

## 2. Claim

<1-2 sentences: the central thesis>

---

## 3. Mechanism

<structural description of the approach. Avoid implementation detail. Focus on: what changes in the system, and why that change addresses the Gap>

---

## 4. Evidence

### <Task name>

**What is this task?**
<1-2 plain-language sentences describing the task and why it's relevant>

**Comparison:** <baseline(s)>

**Result:** <numbers>

**Why this supports the claim:** <explanation>

[repeat for each experiment]

---

## 5. Conclusion

<What the authors want the reader to believe. The claim about the world, not a summary.>

---

## Implications for [your claim]

<What this paper leaves open. Whether its Evidence supports or contradicts yours. Whether its Mechanism overlaps and how yours differs.>

*(Leave blank if no claim was provided.)*
```

## Discipline

- **Plain language first.** Never state a benchmark name without describing the task. A reader who doesn't know the field should be able to follow the Evidence section without looking anything up.
- **Cite the paper's actual words for Conclusion.** The authors usually state their conclusion explicitly. Quote or closely paraphrase — don't invent one.
- **Flag what the evidence doesn't prove.** If a claim is ambitious but the evidence is narrow, say so. "The authors claim X, but the experiments only test Y — whether X holds beyond Y is unproven" is a more useful dissection than accepting the claim at face value.
- **Don't conflate Mechanism with Evidence.** Mechanism = how it works. Evidence = proof that it works. These are separate.
- **Rule ⑦ applies.** Below 90% confidence on any layer — especially Mechanism or the Implications section — say "uncertain" rather than asserting.
