# fathom — plugin conventions

> To **fathom** is to deeply understand; the root is the nautical depth unit, measured line by
> line downward — the shape of this plugin's five-level ladder.

## Four verbs, one shared state (ADR-114)

| Verb | Owns the moment | Writes |
| --- | --- | --- |
| `sound` | "index this repo" · "is it trustworthy?" — grounding without teaching | `soundings.md` |
| `guide` | "walk me through it" · "where were we?" — the teaching climb | cursor · `bearings.md` · artifacts |
| `quiz` | "test me" — spaced retention, may fire days later | `bearings.md` |
| `dive` | "keep digging at X" — one thread, no ladder movement | `soundings.md` · `bearings.md` |

**Files, not call order, are the connective tissue** — which is why the flow is free. `soundings.md`
records how deep the repository is; `bearings.md` records how deep the learner is; `_index.md` is
the cursor. Every verb runs standalone because the state is on disk.

`guide` covers the run-it-all case through the marketplace's **reuse-via-transcript** pattern: if
`soundings.md` is missing or stale it performs the sounding inline rather than sending the user to
another door first.

**Keep the near-neighbours distinct** — this split only pays if the boundaries hold: `dwell`
(inside `guide`) is bound to the level just taught; `dive` is unbounded and advances nothing.
`gate` (inside `guide`) is a level's exit; `quiz` is retention checking independent of progression.
Adding a fifth verb needs evidence that no existing door can carry the moment.

## Division lines

- **Object**: a repository the learner does **not** yet hold a working model of — typically a
  foreign upstream pinned at a commit. The learner's own codebase is also valid input (the
  collapse rules fast-pass the levels a maintainer already owns), but continuous maintenance
  work belongs to `nav`.
- **Not** a work-status catchup (`/shape:baton` — where did *today's task* stop), not a
  navigability map (`/nav:sync` — durable headers/map for a repo you maintain), not a
  decision-space survey (`/shape:elicit`'s survey leg — axes for a *decision*, not a system).
- **State**: unlike the nav family (single-shot, read-only toward artifacts), these verbs share a
  persistent study directory — cursor, learner model, anchor index, pinned clone, artifacts. That
  shared state is why this is a standalone plugin and not a nav verb (ADR-111).

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
