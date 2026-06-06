# ADR 019 — `sync` collapses `headers` + `map` into one door (engine stays two render phases)

**Status**: superseded by [ADR-029](029-resplit-sync-and-map-by-cadence.md) — the "engine stays two pieces" half holds; the "one door" half is reversed (headers + map have different cadences, so two doors)
**Date**: 2026-06-01
**Amends**: [ADR-003](docs/adr/003-five-skills-not-four-or-six.md) (the skill roster — still five, the two "describe" verbs merge)

## Context

`nav:headers` (per-file `head -12` headers) and `nav:map` (the repo-level `docs/codebase-map/index.html`) were two separate skills. In practice they are never run apart — you change code, then you want *both* the file headers and the map back in step with it. Two observations forced the question "are these one feature?":

1. **They share the expensive part.** Both need the same grounded read of each load-bearing file's role + dependencies (verified vs guessed). Two doors meant doing that read twice and remembering two commands.
2. **The map regeneration *is the test* of the headers.** Rule ⑧ — if you struggle to write a domain's one-liner while rendering the map, that struggle is the deep-module failure signal, and it usually means a file lacks a usable header. So `map` is downstream of `headers`: a pipeline edge, not two independent things.

The naive fix ("merge them into one skill") was wrong for a precise reason, and the right shape only fell out after separating two layers that "skill" had been conflating.

## The cut — door vs engine

A "skill" is two layers, and the merge question has a different answer at each:

- **The door (entry point)** — what the user summons. Here the user is right: they never call `headers` or `map` alone, so there should be **one door**. Two doors with overlapping triggers is a menu the user has to disambiguate — and *needing to ask "which one?" is itself the proof they're one entry*.
- **The engine (render logic)** — the per-file header writer and the HTML map renderer. These must stay **two pieces**, for reasons independent of how the user calls them:
  - `/nav:doctor` gates *between* them (review the header diff, **then** regenerate the map off the corrected headers).
  - `/shape:reconcile` consumes only the header artifact (`head -12` = its cheapest "is this implemented?" signal).
  - The door is an *open umbrella* — "sync all of the navigation layer" — so a future third renderer (deps graph, changelog) slots under it without reshaping the entry.

So: **merge the door, keep the engine.** The unifying unit is the *grounding pass* (the shared input), not the outputs. `headers` and `map` were two renderers of one read all along.

## Decision

1. **New skill `nav:sync`** — the single navigation-sync door. Description absorbs both former skills' trigger phrasings (+ "sync after a code change"). Runs **one grounding pass → Phase A (header-render) → gate on the header diff → Phase B (map-render)**.
2. **Retire `nav:headers` and `nav:map` as standalone skills.** Their protocols move verbatim into `skills/sync/references/header-render.md` and `skills/sync/references/map-render.md` (engine, loaded on demand). `visual-spec.md` moves to `skills/sync/references/`.
3. **Roster stays five**: `audit` · `refactor` · `sync` · `doctor` · `plan` (the 6th, `plan`, predates this; the merge nets headers+map → sync).
4. **`doctor` reuses the two phases** at steps 4–5 (header-render gate, then map-render) instead of the two retired skills — its between-step gate is exactly why the engine stays split.
5. **Cross-plugin repoint**: every live `shape` reference to `/nav:headers` / `/nav:map` (reconcile, elicit, align, build, CLAUDE.md, blueprints-spec) now points at `/nav:sync` — they consume the *artifact* sync maintains, semantics unchanged.
6. **Version bump** `nav` 0.1.0 → 0.2.0 (skill rename/retire per the "renaming a skill → bump version + ADR" convention).

## Consequences

- **Good**: one command for the routine "re-sync the nav layer"; the grounding read happens once; the door names the user's actual intent (navigability for agent + human); the open umbrella grows by adding render phases, not doors.
- **Cost paid**: `doctor` and the `shape` seams had to be rewired; the gating site map (`docs/site/index.html`) updated; this ADR + the ADR-003 amendment written. Larger blast radius than adding a thin orchestrator, but faithful to "never use them separately."
- **Not done (deliberately)**: `doctor` was *not* folded into `sync` (considered, declined) — `doctor` keeps its distinct value (the read-only audit + the 4-bucket categorized plan + structural-refactor tee-up). `sync` is doctor-minus-diagnosis: routine, no audit ceremony.
- **Historical records left intact**: ADRs 005/008/009/010/013 and `docs/observations|findings/*` still mention `headers`/`map` in their period context — correct ADR practice (supersede forward, don't rewrite history).

## Naming note

`sync` (names the maintained state — artifacts ↔ code) beat `update` (names neither input nor intent) and `reground` (names the mechanism — architecturally honest but no one types it). The architecture lives in the description/docs; the *name* optimizes for what the user summons by, which is the drift being corrected. See the convention: name carries identity + ergonomics, description carries the trigger net.
