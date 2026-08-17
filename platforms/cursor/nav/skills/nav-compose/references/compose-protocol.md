# Compose protocol — the full machinery behind structure-as-deep-module

> The implementation layer behind `nav-compose`'s Stance. The SKILL.md body carries the stance,
> the sentence-level craft keystones, and the gated compose/restructure step verbatim; everything
> here is loaded on demand — the full rationale, the 8 rules, the Frame/Report steps, the
> Discipline restatement, and the anti-pattern table. Moved verbatim from the pre-ADR-109 SKILL.md
> body; the machinery is unchanged, only re-homed.

## Why this skill exists

Deep-module discipline applies to **any accreting artifact, not just code** — the docs an agent writes (ADRs, design notes, reports, observations, READMEs, specs) go un-navigable the same way a codebase does: the point buried mid-paragraph, the same decision re-explained in three files, a doc that grew to cover five concerns. `sync` already applies the convention to one artifact (**file-top headers on code files**); `compose` applies the **same eight rules to the whole body of a prose document**.

It is the prose-document sibling of `sync` (ADR-049): `sync` = the interface line atop a code file; `compose` = the structure of a file that *is* prose. Both are interface-first (rule ②) applied to writing. Deep-prose discipline has many consumers across this marketplace (shape's `core`/`plan`, reflect's observations, research's notes, the ADRs themselves), so it is extracted here as the single owner rather than restated per plugin (the N+1 trigger).

## Scope

**Language- and genre-agnostic.** The convention (lead with the point · one owner per fact · group by knowledge · right grain · head-able top) applies to any document type, with the genre's own idiom flexed in (an ADR's Context/Decision/Consequences, a report's buckets, a README's quick-start). Degrades gracefully on an unfamiliar genre to the universal rules + flags what it assumed.

Two modes, both **gated by a diff/draft before applying**:
- **Author** — turn intent / notes / a decision into a new document in deep-module shape.
- **Restructure** — reshape an existing draft into the convention, moving its substance **verbatim** (never paraphrasing or inflating).

This skill **writes/edits the document**. It owns structure, not sentence-craft and not content it doesn't have (see Discipline).

## The 8 rules (the through-line of every nav skill)

1. **Deep modules through information hiding** — a document leads with a simple interface (its point / summary) and hides the detail below; you act on it without reading the body. Red flag — **information leakage**: the same fact (a decision, a number, a definition) restated in ≥2 documents, so one change must touch them all. *In prose, the fix is a link to the owning doc, not a second copy.* Often caused by **temporal decomposition** — see rule ④. **Composition is the second half:** sections compose behind a lead-with-the-point summary into a document, documents behind an index into the tree — each level a simpler door than the sum of its parts; a folder of docs with no index is the prose form of a drawer.
2. **Interface-first at every scale** — *this skill's whole reason for being.* Lead with the conclusion; section headings are the document's interface; a reader drills into a section's body only as needed. The top is `head`-able. *Applies down to the paragraph, too: a paragraph opens with its topic sentence.*
3. **Explicit dependencies** — a document names what it builds on and links its sources, rather than leaning on ambient "as we discussed" / unstated context.
4. **Right grain — neither giant nor fragmented** — a doc covering many unrelated concerns gets split; trivia that needs no doc doesn't get one. **Group by knowledge, not by chronology** — "what I did Monday / Tuesday" is temporal decomposition; organize by concern/topic so each section owns one idea. *At the paragraph scale: one paragraph, one topic. At the word scale: omit needless words — the sentence-level form of a narrow interface (see *Sentence-level craft* in the SKILL.md body for the rest of the distilled keystones).*
5. **Fit the framework** — use the genre's idiom (ADR → Context/Decision/Consequences; report → its buckets; README → quick-start first). Don't fight the document type's conventions. *This is the seam between two orthogonal axes: compose owns the **navigation** axis (gist → detail — lead-with-point, headings-as-interface, head-able) and **delegates the grounding axis** (how a claim is backed — evidence, examples) to the genre's idiom. A consumer asking compose for an evidence→example shape is asking the wrong owner: compose gives navigation, the genre gives grounding.*
6. **Rearrange, don't rewrite** — restructuring an existing draft **moves its substance verbatim** into the better shape; never paraphrase, shorten, or embellish while reshaping.
7. **Below 90% confidence → ask** — about the document's type, audience, or its single point.
8. **Agent-navigability is the audit** — *if you cannot write the document's one-line lead / TL;DR, the document has no clear point yet* — that is the failure signal (it is trying to say too much, or its content isn't decided). Note it; usually the content, not the wording, needs work.

## Step 1 — Frame

Reuse-via-transcript: if an upstream skill (e.g. `shape-elicit`) already converged the content earlier in the session, reuse it as the source — don't re-derive.

Establish three things (rule ⑦ — below 90% on any, ask):
- **Type** — ADR / design doc / report / observation / README / spec / …
- **Audience** — who reads it, and what they need to grasp in the first ten seconds.
- **The single point** — one sentence. If you can't write it, the content isn't decided (rule ⑧) → surface it; the gap routes to `shape-elicit`, not to inventing filler.

## Step 3 — Report

Summarize to chat:

```markdown
## compose — <ISO date>
- Document: <path> — authored / restructured
- Point (lead): <one line>
- Any rule-⑧ signals: <sections whose point wasn't clear → content undecided>
```

If a rule-⑧ signal surfaced (couldn't write a clean lead for a section), name it and route the undecided content to `shape-elicit`. Do NOT commit unless the user asks; if on the default branch, suggest branching first.

## Discipline (do not skip)

- **The diff/draft is the gate.** compose writes to disk; the user sees the document before it lands.
- **Structure, not sentence-craft.** Wording polish is the `writing-clearly-and-concisely` skill's job — note it / hand off; don't absorb it.
- **Never invent content to fill a structure.** An empty section means the point isn't decided (rule ⑧) → `shape-elicit`, not filler.
- **Link, don't duplicate** (rule ①). A fact owned by another doc is referenced, never re-explained.
- **Restructure = verbatim move** (rule ⑥). Reshaping a draft preserves its substance; no paraphrase.
- **Rule ⑦ applies.** Below 90% on type / audience / the point → ask.

## Anti-patterns (refuse these)

| Temptation | Instead — and the tell |
|---|---|
| Skip the diff, just write the file | Show the diff first, unless the user said "just write it" — compose mutates the doc. Tell: about to call the write tool before the user has seen what changes. |
| Bury the point in paragraph 3 | Lead with the point — rule ②, the top is the interface. Tell: a reader has to scroll past scene-setting to find the actual claim. |
| Re-explain a decision that lives in another doc | Link to the owner, don't copy the fact — rule ①. Tell: the same decision's rationale is spelled out here as well as in its source doc. |
| Organize by "what happened when" | Group by concern instead — rule ④, temporal decomposition is the trap. Tell: the section headings are dates or phase names, not topics. |
| Paraphrase a draft while restructuring it | Move the substance verbatim — rule ⑥. Tell: the reorganized version says the same thing in different words instead of the same words in a new place. |
| Invent prose to fill an empty section | Route to `shape-elicit` — rule ⑧, the content isn't decided yet. Tell: about to write a sentence that states a decision nobody has actually made. |
| Pad the doc with puffery / AI-promo vocab (`seamless`, `robust`, `leverage`, `delve`…) or over-format (bullets / bold on everything) | Be specific — say what it actually does; the *living* denylist is owned by `writing-clearly-and-concisely`, point to it rather than copying it. Tell: a sentence would still be true with the adjective deleted. |
| "While I'm here, let me deep line-edit every sentence" | Apply only the durable keystones in *Sentence-level craft*; route a deep copyedit to the external `writing-clearly-and-concisely`. Tell: about to touch a sentence whose meaning wasn't in question, only its grammar. |
