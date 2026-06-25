# ADR 054 — relay: decisions are an append-only ledger, not pins in a regenerated snapshot

**Status**: proposed (draft)
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

**The load-bearing line: a decision is not a new artifact — it is a thought that acquired an "agreed" stamp.** Its content already lives in the thought + its agreeing review, so the decision record is a **pointer + stamp, never a content copy** (a copy re-introduces the two-owners drift ADR-053 killed).

### 2. Four roles, each with one owner

- **`thoughts/`** — disposable working drafts (the deliberation). Pruned from the working tree once settled; **git history keeps the original**. *Not* the system of record.
- **`decisions/log.md`** — the append-only **History**: every decision ever, including superseded ones; **only appended, never rewritten**. Each entry is a pointer (`[<id>] <decision> — agreed <date> (by <who>)[, supersedes <id>]`) into the thought, not a copy.
- **`decisions/active.md`** — the **current in-force** decisions, **by reference** into `log.md`; regenerable (可丟可重生).
- **progress / "where things stand"** — owned by **`digest`** (computed live), *not* a stored file.

The split is "computed (disposable) vs stored (permanent)": computed = `digest` (current progress) + `active.md` (current in-force); permanent = `decisions/log.md` (decision history) + git (draft history).

### 3. Supersession keeps the trail

History is append-only, so overturning a decision is **append a new decision** (marking what it supersedes) + **re-point `active.md`**; the old decision **stays in `log.md`**. Legal analogy: `log.md` is the case-law book (every ruling kept, a new one can overturn an old, both stay in the book); `active.md` is the index of currently-binding precedent. Nothing is deleted, so "we changed our mind" is itself a recorded step.

## Consequences

- **`index.md` dissolves.** Its two ADR-053 sections relocate: `## Decisions (pinned)` → `decisions/log.md` + `active.md`; `## Where things stand` → `digest`. `settle` stops writing a project-root snapshot; instead it (a) **appends a decision pointer** to `log.md` + refreshes `active.md` when a thought gets an agreeing review, and (b) **prunes** settled thoughts from `thoughts/`.
- **Refines a just-committed line.** `plugins/relay/CLAUDE.md` (commit `8ee287e`) says "thoughts are the immutable log; `index.md` is a projection." Restate: the immutable log is **git history + `decisions/log.md`**; **`thoughts/` is disposable working material**; **`active.md` is the projection**.
- **`launch`** scaffolds `decisions/` again (`log.md` + `active.md`) — as a ledger, not the old per-file graduation dir ADR-053 retired.
- **Lands as one commit**: format contract + `settle` / `digest` / `launch` SKILL.md + `plugins/relay/CLAUDE.md`, with a relay version bump and the content repo's `CLAUDE.md` project-structure line.

## Out of scope / open

- **Draft prune = hard delete (git-only) vs light `archive/` (browsable).** Leaning **git-only** ("用完即丟"); the trade is *browsable raw deliberation* vs *clean working tree*. git is the backstop, so decision-write quality becomes load-bearing.
- **`log.md` naming** (vs `history.md`) — open. `active.md` is chosen.
- **Where the company records this** — a relay/tooling decision; the content repo's only project is the product (`music-agent-os`), so a pure relay-`report` there would miscategorize. This ADR is the home; an optional pointer thought can give the counterpart visibility.
