---
date: 2026-07-01
status: raw
---

# compose has "lead with the point" but not "define before use" — a doc also needs concept-dependency ordering + a vocabulary primer when it leads with a concrete artifact

> Source: this session — restructuring a dense research design doc for readability; the user liked the "progressive disclosure + 前因後果" flow and asked where it belongs in the skills.

## What prompted it

Restructured a sprawling design doc into four layers (core concepts → concrete artifact → design rationale → application). The load-bearing fix was **not** "lead with the point" — the doc already led every section with its point. The fix was **causal / dependency ordering**: the core metaphor (the method the whole doc tests) sat buried mid-document while every later section referenced it, and the concrete artifact placed up front (a pipeline) used vocabulary defined only later. Moving the method to the top **and** adding a short "core concepts" primer *before* the concrete artifact is what made it legible.

## The signal

`nav:compose` owns **top-level** interface-first — rule ② "lead with the point", rule ④ "group by knowledge not chronology", rule ③ "explicit dependencies" (but rule ③ means *link your external sources*, not order internal sections). It does **not** name **intra-document dependency ordering**: sequence sections so a term/concept is defined *before* the sections that consume it. Two concrete sub-moves compose currently doesn't prompt:

- **Define-before-use.** Scan for any section that uses a term defined only later → move the definition earlier, or the reader can't go top-to-bottom. "Every section leads with its point" can still read badly if section 2's point uses section 4's vocabulary.
- **Concrete-first ⇒ vocabulary primer.** When a doc opens with a concrete artifact (pipeline / diagram / worked example) for progressive-disclosure reasons, that artifact *uses* vocabulary; front-load a short concept primer so it's readable, instead of forcing the reader to jump forward for definitions.

The reframe: **"lead with the point" (top-level) and "define before use" (section-to-section) are different axes.** compose has the first; the second is the "前因後果" a reader feels the absence of — and it isn't in the text.

## Evidence so far

- **Only case (2026-07-01, restructuring a research design doc)**: reordering to method-first + a core-concept primer before the pipeline was *the* readability lever (not lead-with-point, which was already satisfied). A first-time-reader critique then found the remaining friction was entirely "uses a term defined later" — inconsistent notation introduced in one section and re-notated in another, and a "the essence is X" statement placed *after* the section that already relied on X.

(One case → stays `raw`. Trip-wire: next time a compose restructure's main lever is section-reordering-for-dependency rather than lead-with-point — or a consumer asks "why is my doc still hard to follow when every section leads with its point?" — promote and fold into `plugins/nav/skills/compose/SKILL.md` as a Step-2 sub-rule / an extension of rule ③ from external-sources to internal-ordering. Candidate refinement, not an ADR yet.)
