# fathom — plugin conventions

> To **fathom** is to deeply understand; the root is the nautical depth unit, measured line by
> line downward — the shape of this plugin's five-level ladder.

## Five verbs, one shared state (ADR-116)

| Verb | Owns the moment | Writes |
| --- | --- | --- |
| `index` | "index this repo" · "is it trustworthy?" — grounding without teaching | `index.md` |
| `guide` | "walk me through it" · "where were we?" — the teaching climb | cursor · `understanding.md` · artifacts |
| `quiz` | "test me" — spaced retention, may fire days later | `understanding.md` |
| `dive` | "keep digging at X" — one thread, no ladder movement | `index.md` · `understanding.md` |
| `compile` | "生成 horizon/地圖" · "重編一下" — turn the study into its artifacts, any time | `studies/<name>/atlas/*.json` |

**Files, not call order, are the connective tissue** — which is why the flow is free. `index.md`
records how deep the repository is; `understanding.md` records how deep the learner is; `progress.md` is
the cursor. Every verb runs standalone because the state is on disk.

`guide` covers the run-it-all case through the marketplace's **reuse-via-transcript** pattern: if
`index.md` is missing or stale it performs the indexing inline rather than sending the user to
another door first.

**Keep the near-neighbours distinct** — this split only pays if the boundaries hold: `dwell`
(inside `guide`) is bound to the level just taught; `dive` is unbounded and advances nothing.
`gate` (inside `guide`) is a level's exit; `quiz` is retention checking independent of progression.
Adding a verb needs evidence that no existing door can carry the moment — `compile` cleared that
bar 2026-08-14/15: a compile fires outside every door's moment (post-dive enrich, stale-study
return, a bare "生成 horizon" with no teaching in flight) and its atlas half was validated across
four studies before landing.

## The artifact layer (three products, one compiler door)

Each study level births its own artifact — **different products, never one mega-fixture**:
**horizon** (Repository) · **tides** (System/State) · **atlas** (Behavior/Code), each with its own
schema and shell. All three are compiled by `/fathom:compile`, which reads the study's recorded
gate to decide what may exist. Binding each artifact to its birth gate inside `index`/`guide` was
tried and rejected — that conflates *when an artifact may first exist* (data, `birth-gates.md`)
with *when someone wants it compiled* (any time); those doors keep a one-line offer pointing at
`compile` and own no machinery.

Everything the compiler needs ships with that door (first consumer owns): `skills/compile/` —
`references/` (compile-loop: two-pass loop + hard rules · birth-gates: what may exist at
which gate · one protocol+brief pair per artifact), `scripts/` (scanner, structural gate),
`assets/` (schemas + shells; deployed copies are instances, assets are canonical). Only **atlas**
is graduated today; horizon/tides stay lab-side until their fixture-ization pilots pass in etudes.

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
