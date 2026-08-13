# ADR 113 — The baton joins blueprints: `catchup` + `park` merge into `shape:baton`, `retrace` retires, `reflect` dissolves

**Status**: accepted
**Date**: 2026-08-13
**Source**: ratified by Paul 2026-08-13, across a grill he steered and twice corrected the dispatcher in — 「align 不能取代 catchup 跟 park」…「我還是覺得 catchup, park 應該被整合到 shape，而且甚至他們應該是單獨一個 skill」…「我想要 handoff 這套也加入 blueprints 那一套」…「我感覺以這個角度來看，我們對 retrace 的需求可能更偏向 fathom」. Name chosen by Paul: `baton`.
**Precedent**: [ADR-112](docs/adr/112-one-board-verb-two-tiers.md) (the merge criterion, and align's scope) · [ADR-071](docs/adr/071-contracts-vs-conventions-tolerant-reader.md) (tolerant reader) · [ADR-070](docs/adr/070-reflect-park-write-side-of-cursor.md) (park's birth) · [ADR-085](docs/adr/085-reflect-catchup-clears-consumed-cursor.md) (single-use cursor) · [ADR-111](docs/adr/111-retire-nav-tour-fathom-succeeds.md) (fathom).

## Context

A proposal to fold `reflect:catchup` into `/shape:align` was raised and **refuted by Paul using this marketplace's own criterion**: the merged body would have to open by deciding *"is this a handoff or a project pass?"*, and a body that opens by deciding its mode was two skills. The dispatcher's framing (an axis of *recoverable vs unrecoverable information*) was true but did not route; Paul's did — **the object differs**.

| | object | cadence | cost |
|---|---|---|---|
| `align` | the project's **durable record** | episodic, on compaction pressure | heavy: whole-tree sweep, per-item verification |
| the baton | the **ephemeral session cursor** | every exit and entry | light: read a note, or write one |

The scenarios settle it without usage data. **Passing** happens mid-task, nothing shipped, board unchanged — running a tree sweep there is absurd. **Taking** may happen in a project with no blueprints tree at all, wanting "where was I" without the board being rewritten.

One measurement was also **misread and is corrected here**: "9 catchup runs, 7 of them cold (no prior park)" had been used to argue the read/write pair was fictional. It measures whether `park` is *adopted*; it says nothing about whether the pair is the right unit. Adoption data cannot refute a categorisation.

So `reflect`'s grouping was not wrong — its **membership** was.

## Decision

### 1. `catchup` + `park` become one skill: `/shape:baton`

If they are one artifact's read and write, they are **one verb over one file**, not two doors. `park`'s own spec already said its five sections are "the exact mirror of `catchup`'s Step 2 questions" — same format, same file, same decision-level-not-code-level discipline. **Shared stance; only the direction differs**, and the direction is fixed by the moment (arriving vs leaving), not by a mode the body must decide. Precedent for one door over two entrances already exists twice: `fathom:repo` (new study and resume share a door) and `nav:sync` (headers continuous, map periodic — [ADR-108](docs/adr/108-retire-research-fold-map-into-sync.md)).

**Named `baton` by Paul.** It is the only candidate where both directions read naturally — you *take* a baton or *pass* it — and it is the vocabulary he already used for the thing. It breaks the bare-verb naming convention as a noun, following the exception `fathom:repo` established: the convention serves discoverability, and a live metaphor serves it better than a bland verb.

### 2. The baton joins the `blueprints/` convention

The artifact moves from a root `HANDOFF.md` to **`blueprints/baton.md`** — the tree's *ephemeral* tier. The tree now holds the record of the work at every durability:

```
blueprints/
  thoughts/     ← decisions, permanent, Status-tagged (ADR-112)
  plans/        ← the grounded how
  plan.md       ← current status, the board
  baton.md      ← the session cursor, ephemeral, overwritten
```

This also resolves what was otherwise a stretch: a session-baton verb sitting in `shape` looked like an outsider, until the artifact joined the family it belongs to. **shape owns the record of the work at every durability**; that is now a clean sentence.

**Tolerant reader, per ADR-071**: no blueprints tree → root `HANDOFF.md` as the fallback, and the location is self-reported. **Never scaffold a tree just to pass a baton** — the pass happens at the moment you are leaving, which is the worst possible moment to demand setup. `catchup`'s any-repo property is preserved deliberately.

### 3. `retrace` retires; `reflect` dissolves

Paul's read — the need `retrace` serves is closer to `fathom` — matches what an independent first-principles pass had already found: retrace's near neighbours are fathom's (teach a model → gate on user correction → emit an artifact), not catchup's. **fathom's object is "a system you do not yet hold a model of", and your own project after enough time is exactly that**; retrace is its temporal face (how it became this) to fathom's spatial one (what it is).

It is **retired rather than relocated**, for a reason worth stating: fathom is one day old with zero fires, and moving an unused skill next to another unused skill is not finding it a home — it is moving the question to the next room. fathom's charter also forbids a second verb without evidence.

**The transferable residue is preserved at zero cost**: retrace's *provenance-labelling* discipline — every causal claim marked **Recorded / Inferred / Unknown**, and never letting "implemented" imply "decided", "verified" imply "committed", or "current code" imply "original intent" — lands in `plugins/fathom/CLAUDE.md` as a rule of the family that now owns this object.

With `catchup`/`park` merged out and `retrace` retired, `reflect` has no members. **The plugin is deleted.** Marketplace: **6 plugins → 5**, **27 skills → 25**.

## What is honestly lost

- **`retrace`'s six-field causal stages and its user-corrected interactive artifact.** Genuinely designed, never fired, and now unbuilt. Re-entry condition: a *measured* recurrence of the "why did this become this way" question — the first probe, deliberately left unrun here, is a transcript sweep for that question shape. If it appears, it returns inside `fathom`, not as a standalone verb.
- **`reflect` as a name for the reflexive concern.** It was a real idea — the one family facing the work container rather than an artifact in the world. It dies because its members turned out to belong to two other families, not because reflexivity is a bad thought.
- **A root-level `HANDOFF.md`'s visibility.** It was the first thing you saw on `ls`; inside `blueprints/` it is one directory in. Accepted: the reader is an agent that knows the convention, and a shared repo's root is not the place for a personal cursor.

## Consequences

- **New**: `plugins/shape/skills/baton/` — SKILL.md (stance + gates) + `references/protocol.md` (both directions' machinery, moved **verbatim** from catchup and park). Gates preserved intact: the write-gate before overwriting · overwrite-never-append · fresh SHA at write time · name-rejected-paths (its measured A/B basis) · the three-tier trust report · the consumed-cursor delete (no gate — deleting consumed state) · summoned-only.
- **Deleted**: `plugins/reflect/` entirely (`catchup`, `park`, `retrace`, its CLAUDE.md and manifests); its `marketplace.json` entry.
- `plugins/shape/.claude-plugin/plugin.json` 0.17.1 → **0.18.0**; shape roster 6 → **7** (`align` · `baton` · `dogfood` · `elicit` · `migrate` · `mockup` · `probe`).
- `blueprints-spec.md` gains the `baton.md` tier; `align`'s rotten-cursor bullet repoints from root `HANDOFF.md` to the new location; `migrate` gains ledger entry **M3** (root `HANDOFF.md` → `blueprints/baton.md`).
- `plugins/fathom/CLAUDE.md` gains the provenance-labelling rule.
- Every `/reflect:*` cross-reference across `nav`, `shape`, `relay`, `fathom`, the root `CLAUDE.md`, README and the site map repointed or removed; Codex layer and mirrors regenerated; validator green at 25 skills.
