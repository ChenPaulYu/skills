# Skill renovation — plan

> Generated: 2026-09-16 · Source: owner-approved conversation · Grounding: reused audit, refreshed after origin/main update

## Context

Fathom's five skills bind repository exploration to a curriculum, study bookkeeping, and
artifact birth gates. The owner rejected this rigid interaction model and authorized retiring
the plugin without immediately replacing it. Its teaching lessons remain historical evidence.

Nav still carries fixed next-action menus, subjective confidence percentages, length-triggered
actions, and full-suite checks after every refactor step. Codex projection injects a complete
worker contract into ordinary skill bodies and still ships a judgment reviewer role despite
ADR-123. These are the agreed targets; the newly landed nav-sync docs leg stays intact.

## Resolved scope

- Remove Fathom's source, generated installs, registration, and current-facing references.
- Preserve historical ADRs, studies, findings, and transferable teaching lessons.
- Remove the independent judgment reviewer role; keep execution/reconnaissance roles.
- Let prior authorization carry through planning and execution. Ask only about consequential
  unresolved choices or new authority, scope, external effects, or paid verification cost.
- Replace numeric confidence gates and length-triggered actions with evidence-based decisions.
- Preserve behavior and public contracts in refactors; use scoped checks during work and the
  required integration/release checks at completion instead of the full suite after each move.
- Load dispatch machinery only when dispatching.
- Keep shape-migrate and frame; they were candidates, not approved retirements.

## Approach

1. Retire Fathom and its registrations; preserve recoverability through tracked git history.
2. Rewrite nav planning, execution, and refactoring instructions and their references together;
   update shared rule restatements so no obsolete instruction can override the new behavior.
3. Remove the reviewer runtime artifact and update compatibility projections, capability
   coverage, fixtures, and conditional worker references.
4. Record the decision in ADR-126, update README/site/board and plugin versions, regenerate all
   derived artifacts, and validate consistency and compatibility in isolated smoke fixtures.
5. Refresh this machine's managed installed copies while preserving its selected profile.

## Critical files

| Owner | Responsibility |
|---|---|
| `plugins/fathom/` | Retired source and bundled artifacts |
| `plugins/nav/skills/` and `plugins/nav/CLAUDE.md` | Behavior rules and detailed protocols |
| `CLAUDE.md` | Marketplace-wide authorization and dispatch policy |
| `scripts/lib/codex-compat.mjs` | Conditional platform-specific worker guidance |
| `platforms/codex/manifest.json` | Runtime roles, capabilities, profiles, adapter release |
| `README.md`, `docs/site/index.html` | Current human-facing inventory and descriptions |

## Verification

- Inspect current-facing references for retired skills, roles, and contradictory rules.
- Run manifest, Codex, and Cursor generators; never hand-edit generated outputs.
- Run `node scripts/validate-codex-skills.mjs` and compatibility/release smoke checks.
- Check scenario outcomes against the written protocols: plan-only stops at a plan; authorized
  implementation continues; a long cohesive file is not automatically split; a scoped refactor
  preserves its contract without unrelated changes; a read-only audit loads no dispatch payload.
- Confirm installed-copy refresh preserves the selected profile and prunes managed retirements.

## Out of scope

- A replacement teaching skill, frame consolidation, or shape-migrate retirement.
- Publishing, pushing, or changing external collaboration objects.

## Completion evidence

Completed 2026-09-16. The generated roster is four plugins and 22 skills; default compatibility
validation (including isolated runtime upgrade/preservation checks), blueprints validation, and
diff whitespace checks pass. Source instruction review covers plan-only, authorized build,
cohesive long-file, contract-preserving refactor, and non-dispatch audit scenarios; no live-model
behavioral experiment is claimed. The site renders both languages with 22 skills, no missing
internal anchors, no overflow, and no browser errors. Installed Codex/Claude skill bodies match
the new source; Fathom is absent. The locally customized retired reviewer was archived outside
the active agent directory without changing its bytes. No commit or publication was performed.
