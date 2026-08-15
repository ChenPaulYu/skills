# The calibration probe — shared ground

> Plugin-level because **two doors need it**: `guide` (it sets the teaching route) and `compile`
> (its artifacts are learner-facing material). Lifted here 2026-08-15 on the N+1 rule, after a
> compile authored a repo dashboard from the agent's *inference* of the learner instead of the
> learner's words — the exact failure this protocol exists to prevent.

## The trigger

**Before building anything learner-facing, calibrate.** An artifact — a dashboard, a state board,
a map, a tour — is teaching material, and material authored without a learner model is authored
for nobody. This binds any door that produces such a thing, not only the teaching door.

## Two axes, probed separately, synthesized once

Ask 2–3 open questions on each. Open, not multiple-choice where it can be helped — a narration
exposes a model, a checkbox confirms a guess.

**Ability — background knowledge.** Adjacent frameworks used hands-on; concepts owned by
experience. **Never ask "how well do you know this repo"** — a stranger's answer is uselessly
"not at all". This axis sets **how** to teach: which terms to skip because they are owned, which
to avoid entirely, the contrast anchor (diff against what they actually built), the chunk size.

**Intent — what they are here for.** The goal, any immediate task, what they are curious about.
This axis sets **what order**: which seam to enter first, which behavior becomes the first control
path, which chapters compress to a mention.

**The synthesis is the route** (or, for a compile, the emphasis): a learner who owns an adjacent
system but has never met this repo's X wants X first and their own system as the contrast anchor —
not an even tour of all modules.

## The narration probe — the highest-value question

One open question asking them to **narrate their current model** of the thing about to be taught
("when you do X, what do you think happens between then and Y?"). Its answer is the raw material
for the learner model's **Corrected** table, which is the only legitimate source of 「常見誤解」
annotations in any artifact. Skip it and every misconception note in every artifact is invented.

## Record it in the learner's own words

Both axes and the narration land in `<study>/understanding.md` under **Learner angle** and the
four buckets (Confirmed / Corrected / Open / Never tested). Core rule, non-negotiable:

> What the learner holds comes from **their own recorded words**, never from your model of them.

Side channels — their notes elsewhere, another project's files, your memory of past sessions — are
context for *forming better questions*, never a substitute for asking. An artifact compiled from
inference must say so in its report and in its provenance.

## Shelf life

Intent drifts; ability does not, much. Re-read the angle at every level entry, and let a moved
goal move the route. A calibration older than the work it is steering is a re-probe candidate.
