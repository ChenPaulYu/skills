# ADR 054 — relay: decisions are an append-only ledger, not pins in a regenerated snapshot

**Status**: accepted — skills implemented 2026-06-25 (relay `0.3.0`); the live coordination repo's data migration is the last step (see plan)
**Date**: 2026-06-25
**Refines**: [ADR-053](docs/adr/053-relay-thought-stream.md) — keeps "a decision is a thought that got an agreeing review"; changes only **where a decision durably lives**, and names the thought/decision ontology 053 left implicit. Not a revert: no `@`-set, no graduation ceremony, no consensus protocol returns.

## Context

ADR-053 made a decision "just a thought that got an agreeing review," **pinned by `settle` into the regenerated `index.md`** (`## Decisions (pinned)`). Dogfooding surfaced a hole: `settle` **rewrites** `index.md` each run and **archives/prunes** the settled thoughts — so the pinned-decisions list survives only if every `settle` faithfully re-copies every prior decision. The highest-value, longest-lived output (the decisions) was living as bullets in a **disposable projection** — which violates relay's own event-sourcing stance ("don't hand-mutate the projection," committed in `plugins/relay/CLAUDE.md`).

Under the hole sat an unclarified question: **what is a thought, versus a decision?**

## Decision

Two moves: name the ontology, then give decisions an append-only home.

### 1. Thought and decision differ *in kind* — not in size

| | **thought** | **decision** |
|---|---|---|
| nature | an **event / utterance** | a **standing status / conclusion** |
| time | belongs to a moment (who · when · said what) | **no moment — holds until superseded** |
| mutability | **immutable** (it happened) | **supersedable** (a new one overrides) |
| author | single | **jointly produced** (proposal + agreement) |

**The load-bearing line: a decision is not a new artifact — it is a thought that acquired an "agreed" stamp.** The decision record is kept **self-contained**: the *distilled ruling + a one-line why*, not a bare pointer, and not a full copy of the deliberation. `log.md` is the **primary read**; the settled thought **stays in `thoughts/`** (§2) as the raw source — relay never moves a thought.

### 2. Four roles, each with one owner

- **`thoughts/`** — the **immutable append-only log** of the deliberation. Thoughts are **never moved or deleted**; "open vs settled" is computed by `digest`, not stored as a folder. *Not* a graduation target — the durable distillate is the ledger. *(Amended 2026-06-25 — pruning evolved hard-delete → archive/ → no-move; see Resolved.)*
- **`decisions/log.md`** — the append-only **History**: every decision ever, including superseded ones; **only appended, never rewritten**. Each entry is **self-contained** — the distilled ruling + one-line why + provenance (`[<id>] <decision + why> — agreed <date> (by <who>)[, supersedes <id>]`); it reads on its own (`log.md` is the primary read; the thought in `thoughts/` is the raw source). Distillation, not a copy of the deliberation.
- **`decisions/active.md`** — the **current in-force** decisions, **by reference** into `log.md`; regenerable (可丟可重生).
- **progress / "where things stand"** — owned by **`digest`** (computed live), *not* a stored file.

The split is "computed (disposable) vs stored (permanent)": computed = `digest` (current progress **and** open-vs-settled) + `active.md` (current in-force); permanent = `decisions/log.md` (decision history) + `thoughts/` (the immutable deliberation log) + git (deeper backstop).

### 3. Supersession keeps the trail

History is append-only, so overturning a decision is **append a new decision** (marking what it supersedes) + **re-point `active.md`**; the old decision **stays in `log.md`**. Legal analogy: `log.md` is the case-law book (every ruling kept, a new one can overturn an old, both stay in the book); `active.md` is the index of currently-binding precedent. Nothing is deleted, so "we changed our mind" is itself a recorded step.

## Consequences

- **`index.md` dissolves.** Its two ADR-053 sections relocate: `## Decisions (pinned)` → `decisions/log.md` + `active.md`; `## Where things stand` → `digest`. `settle` stops writing a project-root snapshot; instead it **only** (a) **appends a decision** to `log.md` + refreshes `active.md` when a thought gets an agreeing review. It **never moves or deletes a thought** — `thoughts/` is the immutable log and `digest` computes open-vs-settled.
- **Refines a just-committed line.** `plugins/relay/CLAUDE.md` (commit `8ee287e`) says "thoughts are the immutable log; `index.md` is a projection." Restate: the immutable log is **git history + `decisions/log.md`**; **`thoughts/` is disposable working material**; **`active.md` is the projection**.
- **`launch`** scaffolds `decisions/` again (`log.md` + `active.md`) — as a ledger, not the old per-file graduation dir ADR-053 retired.
- **Lands as one commit**: format contract + `settle` / `digest` / `launch` SKILL.md + `plugins/relay/CLAUDE.md`, with a relay version bump and the content repo's `CLAUDE.md` project-structure line.

## Resolved (was open at draft)

- **Thoughts are never moved or deleted** — `thoughts/` is the immutable log; "open vs settled" is `digest`'s computed view. *(Amended 2026-06-25 — pruning evolved hard-delete → archive/ → **no-move**. The no-move endpoint is the purest: thoughts never change, `settle` only appends to the ledger, and the active/settled split is **computed, not stored** — consistent with relay's own "compute, don't store" stance, and it dissolves the "did we archive a not-yet-agreed thought?" hazard. Trade accepted: a flat `thoughts/` grows, and a **dumb file-listing reader can't tell open from settled without computing** — relay assumes **smart readers**, since its awareness mechanism is `digest`. A counterpart's bespoke dashboard must compute open/settled itself; pulling the skill upgrades an *agent*, not a hand-rolled dashboard.)* `log.md` entries are still **self-contained distillations** (§2).
- **Ledger filename = `log.md`** (with `active.md` the in-force view).
- **Where a relay/tooling decision is recorded** — the ADR lives in the **skills repo** (here); an optional **FYI pointer thought** in the content repo gives the counterpart visibility, without miscategorizing tooling under a product project.

## Implementation

- **Skills — done (2026-06-25).** Format contract (`plugins/relay/CLAUDE.md`) + `settle` (append-ledger; thoughts never move) + `digest` (drop `index.md` coupling) + `launch` (scaffold `decisions/`, no `archive/`/`index.md`) updated together; relay bumped `0.2.1 → 0.3.0`; manifests/codex regenerated; validator green. See [the plan](docs/plans/2026-06-25-relay-decision-ledger-impl.md).
- **Live coordination-repo data migration — done (2026-06-25).** Distilled the already-agreed threads into `decisions/log.md` + `active.md`; retired `index.md`; thoughts stay in `thoughts/` (no `archive/`).
