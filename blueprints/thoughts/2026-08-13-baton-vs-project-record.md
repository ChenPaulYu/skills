# The session baton and the project record are two objects — two doors, not one

> 2026-08-13 · **Status: in force** · `align` owns the project's durable record; `catchup`/`park` own the ephemeral session baton. Different objects, cadences, and costs — so they stay separate doors. `retrace` belongs to neither.

## The call

**`/shape:align`** maintains the **project's durable record** — the `blueprints/` tree and `plan.md`, verified against the code. **`/reflect:catchup`** and **`/reflect:park`** maintain the **session baton** — the ephemeral cursor (`HANDOFF.md`) handed from one agent session to the next. These are not two modes of one verb. They stay two doors.

The one seam that is real: **align may clear a consumed or stale `HANDOFF.md`** during its compaction pass, because a rotten handoff note is a record that lies, and align's whole job is making the record tell the truth about now. (`catchup` already clears the note it read; align covers the note nobody came back for.)

`retrace` sits in neither category — it reconstructs the *causality of a past arc*, not current state and not a baton. It remains the odd member of `reflect`, on the watch-list clock to 2026-11.

## How it shows up in the system

- Merging them would force a mode switch at the top of the merged body ("is this a handoff or a project pass?"), and **a body that opens by deciding its mode was two skills** — the same criterion used the same week to refuse merging all of `shape` into one verb.
- The scenarios diverge sharply. **park's moment**: mid-task, nothing shipped, board unchanged, you want to drop a note and leave — running a full tree sweep there is absurd. **catchup's moment**: possibly a project with no `blueprints/` tree at all, wanting "where was I" without the board being rewritten.
- Cost and cadence differ by an order of magnitude: align is heavy and episodic (fires on compaction pressure); the baton pair is light and fires on every exit/entry.

## What was rejected or deferred

- **Rejected: fold `catchup` into `align` as its "no tree" degraded mode.** The ADR-071 tolerant-reader law does say verbs degrade when a convention structure is absent — but degrading is about *tolerating a missing artifact*, not about absorbing a different object. Wrong law for this case.
- **Rejected: fold `park` into `align` as a "write the cursor" mode.** Both write current state for a future reader, but to different artifacts, for different readers, at opposite cadences.
- **Rejected the argument that killed them, too:** the measurement "9 catchup runs, 7 of them cold (no prior park)" was used to claim the read/write pair is fictional. It is not evidence about the pair's validity — it measures whether `park` is *adopted*, which is a different question. Using adoption data to refute a categorisation was the error.
- **Rejected: relocate `retrace` now** (to `fathom`, whose charter explicitly forbids a second verb without evidence; or to `shape`, where it fits no worse and no better). Deferred to the November checkpoint — choosing a home for an unused 4-week-old skill is guessing.
- **Superseded framing:** the earlier first-principles pass axis'd these three on *recoverable vs unrecoverable information*. That axis is true but does not route — the object (project record vs session baton) does.

## Evidence.

The scenario test above (park mid-task with an unchanged board) is decisive without needing usage data. Supporting measurements from the 2026-08-12 transcript audit (944 sessions): `align` 7 fires with natural-language triggers (「重新整理一下我們需要什麼」·「下一步你想要做什麼呢」), `catchup` 10 fires, `park` 6, `retrace` 0. The merged-verb criterion ("a body that opens by deciding its mode was two skills") is from [ADR-110](docs/adr/110-shape-slims-to-eight.md) / [ADR-112](docs/adr/112-one-board-verb-two-tiers.md).
