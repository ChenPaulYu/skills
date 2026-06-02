# ADR 025 — `refactor` syncs per-file headers inline (consistency with `do`)

**Status**: accepted
**Date**: 2026-06-02
**Refines**: [ADR-019](docs/adr/019-sync-collapses-headers-and-map.md) (which made headers `sync`'s job), [ADR-023](docs/adr/023-nav-do-execution-verb.md) (`do`'s inline header gate — the model this aligns to), [ADR-008](docs/adr/008-inject-check-at-handoff.md) (header hygiene in the sub-agent check)

## Context

A consistency audit across the three code-changing paths asked: *when code changes, does each path sync the file's top header in the same change?*

- **`do`** — yes, inline. Its check gate #1 is header hygiene; a touched file's header updates in the same change.
- **`plan` → sub-agent** — yes, in the Check (←): "a new load-bearing file has a header and a changed role is updated same-commit."
- **`refactor`** — **no.** Its main process (Steps 1–7) never mentioned headers; it deferred *all* header work to a later `/nav:sync` (a companion footnote). Only its improve-sub-agent hand-off (Step 8) checked headers.

So a refactor — which by definition changes file roles and `Reads` (extract a hook, split a file) — left every touched header **stale between the refactor landing and a separate `/nav:sync` the user might never run.** That window is exactly what the `stale header = lie` rule exists to forbid, and it made refactor the odd one out among the three paths.

The deferral had a real rationale: a refactor can touch many files (1718 → 16), and `sync` refreshes headers + map holistically in one grounding pass. But "holistic later" and "no window of lying headers" are separable concerns.

## Decision

**`refactor` syncs per-file headers inline, in the same change (new Step 7 "Sync headers, then report").** For every file whose role or `Reads` changed in the move, its top header is updated *now* — a moved file whose header lies is an **incomplete** move. The header is a comment, not the code body, so syncing it does not violate the verbatim-move rule (⑥).

The repo-level **codebase map** regen stays `/nav:sync`'s job (ADR-019 holds); only the *per-file header* stops waiting. `/nav:sync` after a refactor now regenerates the map + does a holistic header sweep, rather than being the primary place headers get fixed.

This makes all three code-changing paths consistent: **per-file headers travel with the change (do · refactor · plan-dispatch); the map is sync's.**

## Why not keep the deferral

`stale header = lie` is a hard rule, and `do` already enforces it inline. Leaving refactor as the one path that ships lying headers — dependent on the user remembering a follow-up command — is the weakest link in a "headers never lie" guarantee. A check you must remember to invoke is a poor fix for a drift problem (the same reasoning ADR-008 used for wiring the integration check into the hand-off rather than a standalone skill).

## Consequences

- `refactor/SKILL.md`: Step 7 renamed "Sync headers, then report" with an explicit inline header-sync instruction; a new Discipline bullet; the `/nav:sync` companion note reframed (map regen + holistic sweep, not the primary header update). No new step numbers shift (folded into Step 7).
- No skill/rule/structure added — behaviour inside an existing skill. Site map: audit block bumped + refactor node desc notes inline header sync; no `NAV_NODES`/`NAV_EDGES` structural change.
- Codex mirror regenerated (`nav-refactor`).
- `do` and `plan` unchanged — they already synced headers inline.
