---
name: compose
description: "Author a new document, or restructure a messy one, into deep-module shape: lead with the point, one fact one owner, grouped by knowledge not chronology. Fires on \"author an ADR / design doc / spec / README\", \"turn these notes into a document\" / \"clean up this prose\", or \"整理這份文件\" / \"幫我整理 docs\" (restructure mode). For file-top headers on CODE files use /nav:sync — compose is their prose-document sibling; writes/edits the document, gated by a diff."
---

# compose — documents as deep modules

Write a **document** the way nav writes code: as a deep module. The act of putting words clearly is sentence-craft (the `writing-clearly-and-concisely` skill owns that); **compose owns the STRUCTURE** — organizing a document so a reader (or agent) grasps its point from the top and drills into the body only as needed. A doc that buries its point, restates a fact that lives elsewhere, or sprawls across concerns is a *shallow module* in prose form. It is `sync`'s prose sibling (ADR-049): `sync` = the interface line atop a code file; `compose` = the structure of a file that *is* prose.

## Stance

- **Two modes, both gated by a diff/draft before applying.** **Author** — turn intent / notes / a decision into a new document in deep-module shape. **Restructure** — reshape an existing draft into the convention, moving its substance **verbatim**, never paraphrasing or inflating. compose owns structure, not sentence-craft and not content it doesn't have.
- **Frame first (rule ⑦): type, audience, and the single point — one sentence.** If you can't write that sentence, the content isn't decided yet; surface it and route to `/shape:elicit` rather than inventing filler. Reuse-via-transcript: if an upstream skill already converged the content this session, reuse it instead of re-deriving.
- **Compose or restructure, then show the diff/draft and wait for the user's OK (batch-OK fine; auto-apply only on explicit "just write it").** This is the gate — compose writes to disk, so the user sees the document before it lands. Lead with the point (rule ②), then sections grouped by concern (rule ④); a fact that lives in another doc gets a **link**, not a restated copy (rule ①); fit the genre's idiom (rule ⑤).
- **Report the point and any rule-⑧ signal** — a section whose lead you couldn't write cleanly means its content isn't decided, not that the wording needs polish. Don't commit unless asked; suggest branching first on the default branch.

**Sentence-level craft (distilled — the durable keystones).** Beyond structure, compose carries the few **durable** sentence principles an agent most often flubs, so it is the self-sufficient prose-writing door — no second skill needed for everyday work:

- **Active voice** — name the actor ("the parser reads X", not "X is read").
- **Positive form** — say what *is*, not what isn't.
- **Parallel structure** — express coordinate ideas in the same grammatical form.
- **Emphatic word last** — end the sentence on the word that carries the weight.

(Omit-needless-words is rule ④ at the word scale; be-specific / no-puffery / no-over-format are in the anti-patterns.) Deliberately **not** carried — by right grain, so compose stays principles, not a grammar textbook: punctuation/grammar minutiae, the commonly-misused-words catalogue, and the *volatile* list of AI-prose tells (the principle is here; the perishable word-list is not). If a deep copyedit ever needs the long-tail, the external `writing-clearly-and-concisely` is on the shelf — compose just doesn't depend on it.

When authoring or restructuring **skill** prose specifically (a `SKILL.md` body, its anti-pattern table, its trigger phrasing), load [`references/authoring-failure-modes.md`](plugins/nav/skills/compose/references/authoring-failure-modes.md) on demand — the named ways skill prose reads but stops working (Premature Completion, Negation, No-Op, Sediment, Sprawl, Leading Word, Completion Criterion), each with a repo instance + an observable tell.

Full rationale, the 8-rule restatement, Frame/Report step detail, the Discipline restatement, and the anti-pattern table: `references/compose-protocol.md`.

## Companion skills

- **`writing-clearly-and-concisely`** (optional, external — not bundled with nav) — a deep sentence-craft reference: grammar/punctuation, the commonly-misused-words catalogue, and the maintained list of AI-prose tells. compose distills the durable keystones inline (above) and does **not** depend on it; reach for it only when a deep copyedit needs the long-tail.
- **`/nav:sync`** — the code-file sibling: file-top headers on code. compose is the whole-prose-document analog (ADR-049).
- **`/nav:audit`** — assesses code shape (read-only); compose authors docs.
- **`/shape:elicit`** — where undecided content goes when a rule-⑧ signal shows the point isn't settled.
- **Consumers** — `/shape`, `/research`, and the repo's ADRs author their documents to compose's discipline (it is the single owner of deep-prose, per the N+1 trigger).

## Communication style

- Explain in the user's language with simple, direct wording.
- Lead each reply with one plain sentence; use a metaphor when it clarifies the concept.
- Put precise technical detail after the plain explanation and only where it's needed.
