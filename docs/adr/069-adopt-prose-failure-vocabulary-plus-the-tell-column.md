# ADR 069 — Adopt prose-failure vocabulary + the-tell column

**Status**: accepted
**Date**: 2026-07-13
**Source**: `blueprints/thoughts/2026-07-13-authoring-vocabulary-prose-failure-modes.md` (W2, fable-rethink batch)

## Context

`mattpocock/skills`' `writing-great-skills` skill names a small vocabulary for how *prose itself* fails to do its job, independent of whether the facts in it are correct: Premature Completion (ending a step early because a later one already entered view), Negation (a ban that makes the forbidden thing easier to think about), No-Op (an instruction that changes nothing versus default behavior), Sediment (stale lines kept out of reluctance to delete), Sprawl (length itself is the failure), and Leading Word (a compact pretrained term standing in for repeated prose). This repo's origin ADR ([ADR-001](docs/adr/001-plugin-shape-and-naming.md)) already records borrowing from `mattpocock/skills` once, for plugin-naming convention; the source thought documents that this repo has independently hit — and independently half-fixed — several of these same failure modes across different skills, without a shared name to recognize them as one thing. That's rule ①'s naming-level variant: not the same fact copied, but the same *pattern* reinvented under different names each time it's noticed.

The source thought's own inventory has 5 named failure modes (Premature Completion, Negation, No-Op, Sediment, Sprawl) plus one named rhetorical device (Leading Word) plus one remedy device named only inline, as Premature Completion's antidote (Completion Criterion) — 7 terms total, each grounded in a specific repo instance or explicitly flagged as a single-observation assumption where the evidence is thin (No-Op's zero-hit grep, Sprawl's unresolved 500-line-vs-13-line tension).

## Decision

1. **New owner file** `plugins/nav/skills/compose/references/authoring-failure-modes.md` — the single owner of all 7 terms' definitions, repo instances, and remedies. Loaded on demand by `/nav:compose` when authoring or restructuring skill prose, not carried in every turn.
2. **Root `CLAUDE.md` gets a one-line-per-term index** ("★ Prose failure vocabulary") — each term's name + a one-sentence plain definition, no repo-instance detail, ending in a link to the owner file. This is rule ① applied to the vocabulary itself: exactly one place expands the definitions.
3. **New fourth column concept — but merged, not appended.** The source thought identifies Negation's real gap as missing "what to do instead" text, not a missing column count. Decision: anti-pattern tables merge their existing "Why to refuse" column's tail into one named **"Instead — and the tell"** column — a positive replacement action, plus a one-line observable signal that the temptation is happening. **Scope**: new anti-pattern tables adopt this shape going forward, and any existing table gets it when it's next touched for another reason — this ADR does **not** mandate a sweep of the ~34 skills' existing tables (tracked as optional future work, same status as the site-map ADR-count / plugin-roster gaps root `CLAUDE.md` already flags as ungated).
4. **The tell, as a required fourth element per term.** The source thought never used this word — each term gets an explicit, observable "how do you know this is happening right now" signal, derived from the definition where the source didn't supply one and marked `(derived)` in the owner file so a reader can tell borrowed-and-paraphrased apart from newly-derived.
5. **Not adopted from the plan draft**: an eighth term, "Duplication", appeared in this ADR's originating execution plan's parenthetical list but has zero grounding in the source thought (`grep`-verified: the string never appears there, nor does any equivalent named failure mode). Per this repo's content-provenance discipline (source-grounded content over invented content), it is omitted here rather than defined from memory. If a genuine "same fact stated twice" failure mode is wanted, that's a fresh instance of rule ① itself and deserves its own grounding pass, not a name filled in blind.

## Why

- A shared vocabulary is what turns "we happened to fix this one" into "we now recognize this pattern on sight" — the whole point of naming a failure mode is cross-recognition across unrelated files, which this repo currently lacks for these five-plus-two ideas even though several are already half-handled ambiently.
- Merging into one "Instead — and the tell" column (rather than appending a fourth) keeps anti-pattern tables at their current width — right grain (rule ④) applies to tables the same way it applies to files; a table that grows a column every time a new authoring lens arrives is heading toward its own Sprawl.
- Marking derived tells `(derived)` rather than silently blending them with the source's own claims keeps the owner file honest about what's paraphrased-from-mattpocock versus newly-synthesized for this repo — the same evidentiary discipline `research:provenance` applies to citations, applied here to a vocabulary file.
- Declining to invent "Duplication" is this ADR practicing Completion Criterion on itself: better to under-deliver a term than assert a definition with no source behind it.

## Consequences

- `plugins/nav/skills/compose/references/authoring-failure-modes.md`: new file, the single owner.
- Root `CLAUDE.md`: new "★ Prose failure vocabulary" bullet in Authoring conventions, one line per term + a link.
- `plugins/nav/skills/compose/SKILL.md`: one line pointing to the reference file, loaded on demand when authoring/restructuring skill prose.
- `blueprints/thoughts/2026-07-13-authoring-vocabulary-prose-failure-modes.md`'s status line updated to record graduation to this ADR.
- **Not decided here**: whether to sweep the existing ~34 skills' anti-pattern tables onto the merged "Instead — and the tell" column, and whether the 500-line-vs-13-line Sprawl-threshold tension warrants a stricter bar for single-behavior skills — both explicitly left open by the source thought, for Paul to decide separately.
