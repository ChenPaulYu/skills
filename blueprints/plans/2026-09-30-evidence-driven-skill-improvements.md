# Development artifacts and experiment evidence — plan

> Generated: 2026-09-30 · Source: owner-approved development-session review · Grounding: `fcac75d`, upstream unchanged; two existing generated-reference repairs

Status: complete; verified and installed. The low-cue follow-up extends this work, and
the owner subsequently authorized committing and pushing the combined changes.

## Context

Shape still prescribes committed blueprints/mockups, while the owner repeatedly excludes
development-process artifacts in product repositories. Dogfood's ignore instruction misses
already tracked files. Probe leaves representative inputs and measurement interference
implicit. Dogfood can drift from evaluating a tool to polishing its demonstration output.
The existing four behavior fixtures do not exercise these failures.

## Resolved questions

- Default development-process artifacts to local, Git-ignored storage. Explicit user or
  project retention policies override the default; this marketplace's maintained doctrine
  and existing tracked development records are not a request for bulk untracking.
- Preserve disk contents and useful decisions. Removing existing Git tracking requires
  authorized cleanup; an ignore rule alone does not accomplish it.
- Strengthen existing skills, not add entrances or a general workflow router.
- Paid model trials remain opt-in; offline checker tests are not model-quality evidence.

## Approach

1. Add one shared development-artifact policy and bundle it into the affected Shape skills
   and nav-plan through the existing shared-reference builder. Replace contradictory
   storage instructions, qualify Git recovery assumptions, and add a policy-only migration
   ledger entry without a structural version change.
2. Make probe test the decision's actual claim with representative inputs, fair timed
   conditions, accessible comparisons, and separate correctness/quality/workflow evidence.
3. Anchor dogfood to the tool and intent under evaluation, distinguish assisted use from
   independent observation, and route findings without polishing an unrelated output.
4. Extend the existing fixture checker only for Git retention outcomes; add storage, probe,
   and dogfood cases with session-review rubrics and meaningful negative checker tests.
5. Update ADR, catalog explanations, plugin versions, generated artifacts, and installed
   copies. Run focused tests, repository-required validators, and full offline checks.

## Critical files

| File | Change |
|---|---|
| `plugins/shape/references/development-artifacts.md` | Single owner of artifact retention and Git checks |
| `scripts/lib/shared-skill-references.mjs` | Bundle policy into standalone consumers |
| Shape skill bodies and references, `plugins/nav/skills/plan/SKILL.md` | Reach policy and preserve scope/recovery gates |
| `scripts/skill-behavior.mjs`, `scripts/fixtures/behavior/cases.json` | Reuse preparation/checking; exercise new outcomes |
| `scripts/lib/skill-behavior.test.mjs` | Reject ignored-but-tracked and staged artifact mistakes |
| `docs/adr/134-development-artifacts-and-decision-evidence.md` | Decision and anonymized session evidence |

## Verification

Run focused shared-reference and behavior-checker tests; demonstrate that ignore-only
cleanup fails while authorized untracking preserves files and passes. Retain fixtures and
product code. Prepare the new cases without leaking expectations into worker packets.
Review instruction changes against the actual session failures; check for stale defaults
and unqualified recovery claims. Run all existing offline tests, marketplace generation
validation, blueprint convention validation, and whitespace checks. Record actual checks
and distinguish fixture checks from fresh model trials.

## Out of scope

Bulk cleanup of other repositories, My-wiki changes, new skills, automatic paid trials,
remote publication, or blanket exclusion of production documentation/test fixtures.

## Outcome

Implemented all five steps. The existing reconcile fixture now carries an explicit
retention exception; the dogfood case also verifies an unchanged index when cleanup is
forbidden. Updated dogfood compiler anchors and source signals preserve its host contracts.
Focused tests passed 10/10; full offline tests passed 126/126. Marketplace and blueprint
validators passed. A temporary committed snapshot passed the full compatibility audit,
and installed Claude/Codex/Cursor copies were verified against their source projections.
Fresh model trials remain unrun. Details and limits:
`docs/findings/2026-09-30-development-artifacts-and-evidence-checks.md`.
