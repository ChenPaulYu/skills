# ADR 050 — `relay`, the async-coordination plugin

**Status**: accepted
**Date**: 2026-06-23
**Refines**: [ADR-044](docs/adr/044-manage-plugin.md) (manage — the object distinction below), [ADR-049](docs/adr/049-nav-compose-verb.md) (relay authors its docs via `compose`)
**Design**: [`docs/design/relay.md`](docs/design/relay.md) (full rationale + the 5-hole design review)

## Context

`manage:observe` proved an async-handoff skeleton — a structured artifact + git transport + a human gate — but only the **write/contribute** half, one-shot and single-party. The need: keep two (or many) people in sync **without live conversation**, two-way, recurring, threaded, converging decisions to consensus. That is a different object family from every existing plugin: not your code (`nav`), not work-forward (`shape`), not the external world (`research`), not reasoning (`think`), and **not your own session (`manage`)** — it is the **coordination channel with a counterpart**.

## Decision

**Add `relay` — a new marketplace plugin: coordinate asynchronously with a counterpart through your agents, over a shared git repo.** Six verbs, split **structure** vs **content**:

| verb | does | layer |
|---|---|---|
| `launch` | create a project (scaffold space + frame; bootstraps the repo on first run) | structure |
| `register` | enrol a person (name · git · github · title) + assign a per-project role | structure |
| `report` | a standup-shaped update (Needs-decision · Blocked-on · Done; id'd + `@`-routed) | content |
| `reply` | accept / clear / counter — an accept completing a [D]'s `@`-set graduates it | content |
| `digest` | the live, per-viewer "what needs you" (read-only; the awareness entry) | content |
| `settle` | owner-only periodic hygiene (archive · prune · refresh `index.md`) | content |

The marketplace goes from five plugins to **six**. Content lives in a **separate content repo** (the tool/content split); the plugin owns the **protocol + format contract** (`plugins/relay/CLAUDE.md`), each `SKILL.md` self-contained.

## Why a new plugin, not a manage skill (the object defence)

`manage`'s object is **your own working session** (reflect inward). `relay`'s object is **a counterpart** (hand outward). Folding relay into manage would tangle two object families — the same reason `nav`/`shape`/`research`/`think`/`manage` are separate. relay also reuses ideas without cloning rosters: shape's two-tier + graduation (`core`/`decisions`/`thoughts`) **without** a `position` verb (relay's canon = `decisions/`, authored by the consensus pipeline itself); a structural **echo** of nav (`index.md` ≈ `nav:map`, `settle` ≈ sync-hygiene) but a different object, so its own vocabulary.

## Key design decisions (full rationale in the design doc)

- **git-native markdown, not GitHub Issues** — Issues aren't in the repo (lock-in; breaks "any async project"). GitHub is at most an optional surface.
- **Single owner + computed views** — `thoughts/` (append-only entries) is the source of truth; `digest` is live/per-viewer/read-only; `index.md` is a `settle`-written shared snapshot.
- **Three axes** — identity (global `relay.yml`, auto-resolved by git email) · role (per-project, default-not-lock) · action (anyone, except `settle` = owner).
- **Consensus = the `@`-set, unanimously** — explicit accept (silence ≠ consent); graduation is **event-driven at the completing accept** (conflict-free); revoke = supersede.
- **In-band awareness** — agent auto-pulls + `digest`s on open; out-of-band is a later adapter.

## The 5-hole design review (resolved before build)

A skeptic pass found and closed five holes (scoreboard in the design doc):

1. **id collision** → author-namespaced `<handle>-<slug>` (handle seeded-from-github, frozen).
2. **`index.md` contradiction** → `digest` live/per-viewer/read-only; `index.md` a `settle`-only shared snapshot.
3. **identity resolution** → `git:` email is the resolver; github is display only.
4. **forgeable accept** → private repo + stated trust baseline; signed-commit accepts as opt-in hardening (host-agnostic).
5. **`settle` trigger / concurrency** → graduation moved to accept-time; `settle` is owner-only, non-critical, re-runnable.

## Consequences

- **Marketplace: six plugins.** `relay` v0.1.0; cursor projection + marketplace version derived via `node scripts/build-manifests.mjs`.
- **Registration (gate #3)**: `/relay:*` tokens + a relay node/entry in `README.md` and `docs/site/index.html`; counts updated (26 → 32 skills; 5 → 6 plugins; codex → 32; ADR count).
- **Codex mirror**: `node scripts/build-codex.mjs` regenerates `.agents/skills/relay-*` + `AGENTS.md`.
- **relay consumes `/nav:compose`** for its prose (reports, decisions, `index.md`) — the consumer ADR-049 anticipated.

## Out of scope (v1)

- **Out-of-band awareness** (cron / push notification) — deferred to an optional adapter.
- **Signed-commit enforcement** — opt-in hardening, not the v1 baseline (private repo + trust).
- **Per-file privacy** — a single repo is all-readable; access control is out of scope.
- **A `position`-style canon verb** — relay's canon is the consensus pipeline's output, not an authored campaign.
