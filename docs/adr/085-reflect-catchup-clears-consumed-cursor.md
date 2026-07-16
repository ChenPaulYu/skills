# ADR 085 — `reflect:catchup` clears the consumed cursor (single-use `HANDOFF.md`)

**Status**: accepted
**Date**: 2026-07-16
**Source**: direct session directive, ratified by Paul 2026-07-16 ("如果 handoff.md 過期或做完,你可以直接 clear 嗎?我也希望把這個 feedback 回我的 skill" — observed after a real catchup consumed a two-rounds-stale cursor and left it on disk)

## Context

`park` (ADR-070) writes the session cursor into `HANDOFF.md`; `catchup` reads it first on return. But nothing ever removed it. In practice a consumed cursor kept sitting at the project root: a real catchup on 2026-07-16 found a `HANDOFF.md` parked at a SHA six commits behind — everything it tracked had shipped or moved into `plan.md` — and could only *report* the staleness, because `catchup` was strictly read-only ("Do not edit, write, or commit anything"). `park`'s own discipline already names a stale cursor left lying around as Sediment, yet the family assigned nobody to sweep it. The user had to notice and authorize the deletion by hand, each time.

## Decision

1. **A read cursor is a used cursor — `catchup` deletes it directly after reporting, no confirmation.** Two qualifying conditions: **done** (the work it describes verifiably shipped — its Next items are in git history / the report's Done) or **stale-and-absorbed** (SHA mismatched and its residual *why* has been folded into the report or superseded by newer durable artifacts). One line in the report says it happened.
2. **The delete is `catchup`'s single, bounded write exception.** The skill's read-only rule stands for everything else; no write-gate applies (this is deletion of consumed state, not a lossy overwrite — the file is one `/reflect:park` call away from regeneration). If the file is git-tracked, the deletion rides the project's next normal commit; `catchup` still never commits.
3. **The escape hatch is doubt, not habit.** If it's genuinely unclear whether the cursor's *why* was captured anywhere, `catchup` says so and leaves the file — that is the only case to keep it.
4. **The cursor is single-use by design.** `park` writes it; the next `catchup` that drains it removes it. `park`'s companion note states this so both ends of the pair tell the same story.

## Why

- **Sediment needs an assigned sweeper.** Naming stale cursors as Sediment (park's Anti-patterns) without giving any skill the authority to remove them guaranteed they'd accumulate — the fridge-note that nobody may take down stays on the fridge.
- **A stale cursor is worse than none.** `catchup` already downgrades a mismatched SHA to "possibly stale," but the *next* session's reader still pays the cost of re-deriving that verdict — or worse, trusts it. Deleting at the moment of consumption is the one point where staleness is *known* and the knowledge is about to evaporate.
- **No confirmation, deliberately.** The write-gate exists in `park` because overwriting is lossy. Deletion of a consumed cursor is not: content was just folded into the report, and regeneration is one skill call. Asking each time re-creates exactly the manual step this ADR removes.

## Consequences

- `catchup`'s SKILL.md gains Step 3 ("Clear the consumed cursor, then stop"); its read-only header carves the one exception; `park`'s companion section documents the single-use contract.
- reflect's plugin CLAUDE.md convention line updates: `catchup` is no longer a pure non-writer — it owns one bounded delete (this ADR), joining the writer census (one writer before ADR-070, two before ADR-084, and `catchup`'s delete-only exception here).
- reflect `0.6.0 → 0.7.0`.
