---
name: map
description: Build a claim-framed landscape across multiple papers or documents — what has already been argued and proven, what gap remains, and which papers are highest priority for related work. Requires your own claim (1-2 sentences) as the lens. Output is one synthesized landscape note, not N individual skeletons. Use when you have a set of sources and want to know where your claim sits in the prior art. Also fires on "map the literature", "what's already been done on X", "where does my claim fit", "build a related work landscape", "survey these papers against my claim", "what prior art covers my claim", "find the gap in these papers". For individual paper dissection (one skeleton per document), use /research:dissect instead.
---

# research:map

Build a synthesized landscape across multiple sources, framed by your claim. The output is not N summaries — it is one structured view that shows what has been argued, what has been proven, and where your claim lives relative to all of it.

## Why this skill exists

Reading N papers and asking "what did each one do?" produces a reading list. Reading N papers and asking "given my specific claim, what has each one already done or left undone?" produces a gap analysis.

The difference is the claim. Without it, you get topic proximity. With it, you get prior-art positioning — the landscape as it looks from where *you* are standing.

This skill is the multi-paper complement to `/research:dissect`. dissect produces independent skeletons (one per document); map synthesizes across them to answer the question that matters for writing: **"has anyone made this claim, and if not, why not?"**

## The claim-framed landscape protocol

### Step 1 — Receive the claim

Ask for the user's claim before doing anything else:

**"What is your claim, in 1-2 sentences? This is the lens through which every paper will be evaluated."**

Do not proceed without a claim. The claim is not optional — it is the frame. Without it, the output is a survey, not a gap analysis.

If the user is unsure of their claim, redirect to `/shape:elicit` to converge it first, then return.

### Step 2 — Receive the document set

Accept:
- A list of file paths (PDFs, markdown, text files)
- A list of URLs
- A folder path (read all PDFs/markdown files inside)
- A mix of the above

Check whether dissection notes already exist in `notes/` for any of these documents. If a `notes/<shortname>.md` exists that was produced by `/research:dissect`, reuse it — do not re-read the full document. Announce which notes were reused.

For documents without existing notes, read the full document before evaluating.

### Step 3 — Evaluate each document against the claim

For each document, produce a compact internal evaluation (not the full dissection skeleton — that is dissect's job):

- **What they claim**: one sentence.
- **What they prove**: one sentence summarizing the evidence.
- **Relation to your claim**: one of four labels —
  - `prior art` — they directly address the same problem; your claim must differentiate
  - `adjacent` — they address a related problem; cite as context, not competition
  - `design input` — their empirical findings constrain or validate design choices in your approach
  - `orthogonal` — same domain, different problem; cite minimally or not at all
- **What they leave open**: one sentence — what their Conclusion does not prove that your claim needs.

### Step 4 — Synthesize the landscape

Group documents by their relation label. Within each group, sort by relevance to your claim (most directly relevant first).

Produce three synthesis sections:

**Already done** (prior art + adjacent)
What has been argued and proven in this space. Include: the claim, the mechanism, and the key evidence in one sentence each. Flag any paper whose claim overlaps significantly with yours — these are papers you *must* differentiate against.

**The gap** (what none of them address)
Synthesize what remains unargued and unproven, given the full set. Be specific: not "no one studied X" but "no paper has tested whether identity causally conditions reasoning, as opposed to conditioning output style." This gap is the home of your claim.

**Design input** (optional, only if relevant)
Papers whose empirical results constrain how your method should be built — not prior art, but evidence that transfers to your design decisions.

### Step 5 — Related-work priority order

Produce a priority list for citing in your paper:

- **Must-differentiate** — papers whose claim overlaps most with yours. Your related work section must explain why yours is different.
- **Must-cite as foundation** — papers whose work your claim builds on.
- **Should-cite as context** — adjacent papers that help readers situate your work.
- **May-cite** — papers with useful design input or partial overlap.

### Step 6 — Output

Produce one landscape note. Suggest `notes/landscape.md` as the default save path (or `notes/<topic>-landscape.md` if the topic is clear). Do not write without confirmation.

## Output format

```markdown
# Landscape — <topic or claim shorthand>

**Your claim**: <user's claim, verbatim>
**Documents surveyed**: <N> (list them with shortnames)
**Dissection notes reused**: <list, or "none">

---

## Already done

### Prior art (directly addresses the same problem)
- **<Paper shortname>** — claims: <one sentence>. proves: <one sentence>. ⚠ Must differentiate: <what overlaps with your claim>.
- ...

### Adjacent (related problem, not competition)
- **<Paper shortname>** — claims: <one sentence>. context value: <why cite it>.
- ...

---

## The gap

<2-4 sentences: what none of these papers argue or prove, stated precisely. This is the unoccupied ground your claim fills.>

---

## Design input (optional)

- **<Paper shortname>** — their finding: <one sentence>. implication for your method: <one sentence>.
- ...

---

## Related-work priority order

| Priority | Paper | Reason |
|---|---|---|
| Must-differentiate | <name> | <one-line reason> |
| Must-cite as foundation | <name> | <one-line reason> |
| Should-cite as context | <name> | <one-line reason> |
| May-cite | <name> | <one-line reason> |

---

## Open questions surfaced

<Any questions about your own claim that reading this landscape raised — gaps in your argument, design decisions not yet settled, baselines you may have missed.>
```

## Discipline

- **Claim first, always.** Do not produce a survey if no claim is given. The gap is only visible relative to the claim.
- **Reuse dissection notes.** If `notes/<shortname>.md` exists, read it rather than re-reading the PDF. Announce the reuse.
- **The gap must be specific.** "No one studied X" is not a gap. "No paper has proposed Y as a mechanism for Z, only as a post-hoc framing" is a gap.
- **Must-differentiate is not a compliment.** A paper in that tier is a threat to your claim's novelty. Surface it honestly — the reviewer will.
- **Open questions are signal, not failure.** If reading the landscape surfaces an unanswered question about your own claim, record it. That is the output working correctly.
- **Rule ⑦ applies.** Below 90% confidence on a relation label or gap characterization, flag it: "(uncertain — re-read section X before accepting this)".
