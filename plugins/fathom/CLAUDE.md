# fathom — plugin conventions

> To **fathom** is to deeply understand; the root is the nautical depth unit, measured line by
> line downward — the shape of this plugin's five-level ladder.

## One door

The plugin has exactly one skill: `repo`. Starting a new study and resuming an old one are the
same door — the opening move reads the study cursor (or finds none) and branches. Do not add a
second verb without evidence that a workflow cannot enter through `repo`.

## Division lines

- **Object**: a repository the learner does **not** yet hold a working model of — typically a
  foreign upstream pinned at a commit. The learner's own codebase is also valid input (the
  collapse rules fast-pass the levels a maintainer already owns), but continuous maintenance
  work belongs to `nav`.
- **Not** a work-status catchup (`/shape:baton` — where did *today's task* stop), not a
  navigability map (`/nav:sync` — durable headers/map for a repo you maintain), not a
  decision-space survey (`/shape:elicit`'s survey leg — axes for a *decision*, not a system).
- **State**: unlike the nav family (single-shot, read-only toward artifacts), `repo` owns a
  persistent study directory — cursor, pinned clone, visual artifacts. That cursor is why this
  is a standalone plugin and not a nav verb (ADR-111).

## Provenance labelling (inherited from `retrace`, ADR-113)

Every causal or rationale claim `repo` makes about *why* the system became what it is is labelled
by how it is known: **Recorded** (a record states the reason — a commit body, an ADR, a
comment), **Inferred** (a bounded interpretation of source, diff, or test-sequence evidence — say
what the inference rests on), or **Unknown** (the available evidence cannot support the claim —
say so rather than fill the gap). Never let "implemented" imply "decided," "verified" imply
"committed," or "current code" imply "original intent" — what shipped and why it was chosen are
different claims with different evidence, and collapsing them is exactly the failure this rule
blocks. Applies at every level of the ladder, most acutely at System and Behavior, where the
temptation to read intent off the code alone is strongest.

## Relationship to the etudes lab

The method's evidence base — evaluation rubric, baseline/delayed-recall probes, case iterations,
graduation thresholds — lives in the `etudes` workspace, not here. This plugin executes the
rhythm that survived two studies; it does not carry the lab's instruments. To change the method:
produce evidence in etudes first, then release a new fathom version. The skill's closing move
(one-line friction note) is the return channel.

## Portability standard

Written for Paul first, but to a portable bar: no dependency on private conventions — the skill
needs only a git URL, a commit, and a learning question. If it survives a third, materially
different study, it may move to its own repository.
