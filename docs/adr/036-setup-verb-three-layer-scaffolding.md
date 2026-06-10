# ADR 036 — `setup`: archetype-driven scaffolding on a three-layer knowledge base

**Status**: accepted
**Date**: 2026-06-10
**Relates to**: [ADR-021](021-retire-nav-doctor.md) (the structure-theatre razor — and shape's documented "no init"), [ADR-034](034-think-plugin.md) (value-guardrail: a skill must force a structure the default omits), [ADR-018](018-promotion-gate-is-evidence-not-session-count.md) (evidence gate), [ADR-008](008-subagent-reuse-via-transcript.md), [ADR-035](035-position-canon-authoring-verb.md) (the sibling graduation loop)

## Context

The TrackMate base setup (2026-06-10) was the **third manual run** of the same scaffold (afterhours-dj → crate → trackmate). Each run re-paid the same costs: tool-choice re-litigation, five recurring gotchas (pnpm postinstall blocking, pytest import paths, IPv6 proxy misses, tsconfig/vite.config, an audiorective type-trap), and — the expensive one — no enforced verification beyond "files written". The user converged the design across three same-day volleys: it's a skill · it must be archetype-driven with accumulating references · the cross-archetype stack principles deserve their own layer.

## Decisions

### 1. `shape:setup`, build family — and why the "no init" razor stands

shape's CLAUDE.md documents "deliberately no `init` skill" — scaffolding the blueprints tree is `mkdir -p` theatre, folded into `align`'s first run. That razor is **about payload, not about the verb "create"**: setup's payload is exactly the structure default scaffolding skips (archetype determination · standing principles · field gotchas · an enforced verification chain), so it passes ADR-034's value-guardrail while the razor keeps standing against thin scaffolds. Named `setup`, not `init` (razor adjacency + Claude Code's built-in `/init` collision). Family: **build** — `build` makes plan items real inside a project; `setup` lays the verified ground build stands on.

### 2. Three-layer knowledge base (resolves the stack-neutrality tension)

The Rytho stack is opinionated; the marketplace charter is stack-neutral. The user's reframe dissolves it: **engine neutral, opinions in references** — `SKILL.md` (protocol only) · `references/stack-principles.md` (the user's per-concern rulings + docs/git/.gitignore conventions + port registry; explicitly marked fork-with-your-own) · `references/archetypes/<name>.md` (composition + glue + gotchas + verification chain + named living exemplars). The engine grounds **exemplar repos**, never prose-embedded file bodies — prose drifts, running repos stay true.

### 3. The accumulation loop (the 晉升 pattern's 4th appearance)

New archetype → exemplar mode + a setup log → recurrence + user sign-off → graduates into an archetype reference; a ruling recurring across two projects → graduates into stack-principles. Same human-gated promotion as material→pool, commit→history, UI→device, observation→skill (ADR-035).

### 4. Done = verification chain green

The core non-negotiable, and the skill's value-guardrail answer: archetype-parameterized chains ending in the *running* thing (web: dev script for real → proxy curl → browser click + screenshot → teardown; cli: --help + smoke; lib: tests + build). The proxy curl and the browser click are the legs unit-green misses — both caught real issues on the founding run.

## Evidence gate (ADR-018)

Three manual runs of the fullstack archetype (the reference distills all three); the founding run exercised the full chain live including preflight gaps (agent-browser), all five gotchas, and a same-day convention ruling (blueprints-never-gitignored, which also fixed a 65-folder loss-exposure in crate). First skill-shaped field run: Traversa.

## Consequences

shape → 0.5.0, 8 skills (`setup` joins build family). README + site rev 39 + codex mirror (17 → 18). The stack-principles file is the new single home for the user's tool rulings — the trackmate-session observation's draft moves here; future rulings land here, not in scattered docs.
