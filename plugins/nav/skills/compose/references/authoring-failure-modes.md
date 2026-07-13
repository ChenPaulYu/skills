# Authoring failure-mode vocabulary — prose that reads but doesn't work

> **Source**: mattpocock/skills' `writing-great-skills` skill + its `GLOSSARY.md` (fetched via WebFetch, definitions here are paraphrased, not verbatim quotes) — same lineage as [ADR-001](docs/adr/001-plugin-shape-and-naming.md) ("Following Matt Pocock's `mattpocock/skills`"), borrowed a second time: first for plugin-naming convention, now for the vocabulary of how skill/doc **prose itself** fails. Adopted by [ADR-069](docs/adr/069-adopt-prose-failure-vocabulary-plus-the-tell-column.md).
> **Loaded by**: `/nav:compose` when authoring or restructuring skill prose (on demand, not every invocation — this file is a reference, not the SKILL.md body).

Five failure modes name how an instruction reads fine but stops working. Two more entries name devices that prevent the most common one. Every entry below is one repo-instance case, not an exhaustive audit — several are explicitly flagged as assumptions or single-grep observations, not proof.

## Premature Completion

**Definition**: the model ends the current step early because a later step has already entered its view — the fix is to sharpen the step's Completion Criterion (below), and when the step is inherently fuzzy, split it so later steps stay hidden until their turn.

**Repo instance**: `plugins/nav/skills/plan/SKILL.md`'s Anti-patterns table (L191–201) carries at least three rows that are the same failure mode wearing different clothes — never named as one thing until now: *"I'll skip Stage 2 — I can guess what the user means"* (skip a step), *"I'll execute step 1 while I'm here, the plan is obvious"* (merge review with execution), *"I'll skip Stage 4 — the next step is obvious"* (drop the last step). **Cross-repo corroboration (not a first-hand instance in this repo's own files)**: the sibling project tactus's `CLAUDE.md` notes the same rule "gets skipped easily (forgotten twice on 2026-07-10, caught only when the user pointed it out)" — that rule is exactly this repo's `/nav:do` / `/nav:plan` routing judgment, consumed downstream.

**The tell (derived)**: a sentence that names *both* the verdict and the shortcut in one breath — "I'll skip X, it's obvious" / "while I'm here, let me also do Y" — is premature completion caught in the act.

**Remedy**: sharpen the Completion Criterion (see below) so "done" for this step is a checkable fact, not a feeling; if the step is genuinely ambiguous, split it so the next step stays out of view until this one closes.

## Negation

**Definition**: a prohibition makes the forbidden behavior easier to think about, not harder ("don't think of an elephant"); the fix is to lead with the positive target and reserve bans for hard guardrails only, always paired with a positive replacement action.

**Repo instance**: `plugins/shape/skills/elicit/SKILL.md` (L84–99) and `plugins/nav/skills/plan/SKILL.md` (L191–201) both use a two-column Temptation/Why table — 9–11 dense prohibitions each, textbook Negation-risk shape. Most rows already half-comply: the Why column's tail often carries a positive replacement, e.g. elicit's *"Stand up a fork instead."* / *"Exit on the snap, not the list."* **Concrete gap (verbatim)**: at least two rows only say what's forbidden, never what to do instead — elicit row 94, *"Auto-fire on any uncertainty"* → *"It's summoned. Grilling unbidden is the anti-feature."* (restates the rule, no explicit replacement verb); nav:plan row 196, *"I'll write the plan straight to disk without asking where"* → *"Surprising. The user has a convention; respect it"* ("ask first" is implied, never written as an action).

**The tell (derived)**: reading the Why column and still not being able to name the one alternative action to take — the column explained the ban but left "so what do I do" unanswered.

**Remedy**: a required positive-action clause in every refusal row. **This repo's P1 decision**: merge the third column into one **"Instead — and the tell"** column (the positive replacement action + a one-line observable signal that the temptation is happening) rather than adding a fourth column — applies to new anti-pattern tables and any table touched going forward, not a full sweep of the existing ~34.

## No-Op

**Definition**: an instruction that changes nothing relative to the model's default behavior — weak words like "be thorough" read but don't act; the fix is a harder, more specific word ("relentless" instead of "thorough").

**Repo instance (assumption — single grep, not exhaustive)**: a search across every `plugins/*/skills/*/SKILL.md` for common weak words ("be thorough", "be careful", "as appropriate", "carefully") returned zero hits. Worth recording either way: it may mean rule ④'s (right-grain) discipline already crowds out No-Op as a side effect, or it may just mean this search vocabulary wasn't broad enough to hit a real case yet. **Not** grounds to claim immunity.

**The tell (derived)**: removing the sentence and re-reading the instruction — if nothing about the expected behavior changes, the sentence was a No-Op.

**Remedy**: replace the weak word with a specific, checkable one, or delete the sentence.

## Sediment

**Definition**: lines that accumulate over successive edits because no one wants to be the one who deletes them — stale, no-longer-relevant text kept out of reluctance rather than need.

**Repo instance (already solved, canonical case)**: [ADR-009](docs/adr/009-consolidate-11-rules-to-8.md) opens with *"The eleven rules grew by accretion and, on review, mixed three different kinds of statement under one flat list"* — a textbook Sediment case this repo already walked all the way through the fix for (spotted three different kinds of statement tangled together, merged the isomorphic rules, cut 11 rules to 8). This ADR can be cited directly as the canonical Sediment example.

**The tell (derived)**: nobody in the room can say what would break if the line were deleted — that's the signal it's sediment, not load.

**Remedy**: periodic review with permission to delete; ADR-009 is the worked example of the full fix.

## Sprawl

**Definition**: length itself is the failure, even when every individual line is "necessary" — the fix is progressive disclosure or splitting; Pocock's own grilling skill runs about 13 lines.

**Repo instance (assumption — open tension, not settled)**: root `CLAUDE.md` already has a numeric threshold — *"A `SKILL.md` or CLAUDE.md past ~500 lines, or enumerating many distinct responsibilities, gets split"*. The longest file today, `plugins/nav/skills/audit/SKILL.md`, sits at 280 lines — well under that bar; `research/dissect` (229), `nav/plan` (219), `nav/refactor` (206) follow. But Pocock's demonstrated single-behavior skill is roughly an order of magnitude shorter than this repo's 500-line bar. Two readings both hold and this file doesn't pick one: (a) the 500-line bar is calibrated for repo-maintenance documents, not single-behavior skills; (b) this repo's skills are inherently heavier (multi-mode, language-agnostic, cross-stack judgment) and deserve a different bar. **Left to Paul** whether a stricter bar is warranted for single-behavior skills.

**The tell (derived)**: summarizing what a skill does takes more than one or two sentences, or the summary needs an "and also" — that's sprawl, independent of line count.

**Remedy**: progressive disclosure (push detail into `references/`, loaded on demand) or split by responsibility.

## Leading Word

**Definition**: a compact term the model already understands from pretraining ("tight loop", "red-green", "tracer bullet") used in place of repeated prose — cheaper on tokens and anchors behavior more consistently than re-describing the same idea each time.

**Repo instance (already in use, just not named as one technique until now)**: this repo already reuses several such terms verbatim rather than re-describing them in prose each time — *"summoned, not automatic"* (`plugins/reflect/CLAUDE.md`, `shape:elicit`, and others, reused verbatim), *"one fact one owner"* (`plugins/relay/CLAUDE.md` cites `/nav:compose`'s discipline by this phrase rather than re-defining it), *"right grain"* (the standing name for rule ④'s whole paragraph), *"stop on the snap"* (elicit's convergence-exit criterion), *"inject → check"* (the sub-agent hand-off protocol, one term standing in for the whole bracket). This document only makes explicit that these are all instances of the same rhetorical device, worth reusing deliberately rather than re-prosing each time.

**The tell (derived)**: the same concept gets a fresh paragraph of prose every time it's mentioned somewhere new, instead of the same short handle.

**Remedy**: once a concept has a name, reuse the name; don't re-describe it in prose at each new site.

## Completion Criterion

**Definition**: the direct remedy for Premature Completion — a precise, checkable definition of what "done" means for a step, tight enough that no two different stopping points could both plausibly claim it.

**Repo instance**: this reference document is itself the working example — it was written under `blueprints/plans/2026-07-13-sonnet-exec-batch.md`'s Done-criteria gate (per-phase, checked line by line before the phase counts as finished), so the writing process itself rehearses the term it defines.

**The tell (derived)**: two people (or two runs of the same agent) could each stop at a different point and both honestly say "done" — that gap is the missing criterion made visible.

**Remedy**: write the criterion as a binary, checkable fact ("file X exists and contains Y", not "mostly covers the topic"); if the step can't be made binary, split it.
