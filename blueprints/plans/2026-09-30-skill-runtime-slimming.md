# Skill runtime slimming — plan

> Generated: 2026-09-30 · Source: owner-approved review · Grounding: origin/main `edfe557` plus the preceding local reconcile/sync changes

**Status**: implemented locally; verification and installation receipt in `docs/findings/2026-09-30-skill-runtime-slimming-checks.md`.

## Context

The current root AGENTS.md concatenates all four plugin guides (101,754 characters), even
when a task touches one family. Several prose skills still insert a second approval into
already-authorized work. Reconcile bundles 363 lines of blueprint format/render material it
does not need. Four reasoning lenses explain their taxonomy at length, while digest carries
its reducer's complete fallback semantics in every invocation. A legacy global mockup copy
still advertises the old workflow independently of the maintained shape-mockup installation.

## Resolved questions

- Preserve the 24 named task entrances and the prior turn's changes.
- Keep authorization, evidence, destructive-cleanup, and external-action gates explicit.
- Load family-specific maintainer guidance only when that family is touched.
- Reconcile needs its cleanup protocol, not a blueprint renderer or full authoring template.
- Keep the four reasoning methods and their existing worked examples; remove repeated
  introductions, taxonomy, and handoff narration.
- Digest stays read-only. The helper owns computation; the exact semantic contract remains
  available for direct-GitHub fallback and debugging.
- Archive only the verified legacy mockup installation and its matching lock entry outside
  discovery roots. Keep a recoverable backup; do not prune unrelated installed skills.

## Approach

1. Record a before snapshot. Remove contradictory second-approval rules from compose and
   related touched guidance; preserve review-only and external-effect boundaries.
2. Make root AGENTS.md contain the shared editing rules and a family index rather than all
   plugin bodies. Preserve source guidance in place, loaded for the affected family only;
   move long root maintenance rationale to a task-specific reference where useful.
3. Narrow reconcile to the existing cleanup protocol. Remove the two obsolete shared bundles;
   teach the shared-reference builder to prune only retired files bearing its own marker.
4. Compact analogize, first-principles, orthogonal, and dialectic around their distinct checks.
   Move digest's fallback semantic sections verbatim into a reference and make the normal
   helper path load only command/presentation details needed for the result.
5. Record ADR-132, update affected versions/catalog descriptions and generated projections,
   and verify behavior boundaries, registration, generation, and digest fixture behavior.
6. Archive the legacy global copy; preserve the current install profile, synchronize managed
   copies, and verify their actual contents. Report size reductions and behavioral-test limits.

## Critical files

| Owner | Change |
|---|---|
| `CLAUDE.md`, `scripts/build-codex.mjs` | Shared editing gates plus on-demand family guidance |
| `plugins/nav/skills/compose/` | Authorized continuation, faithful meaning rather than mandatory verbatim wording |
| `plugins/frame/skills/{analogize,first-principles,orthogonal,dialectic}/` | Compact distinct reasoning contracts |
| `plugins/relay/skills/digest/` | Helper-first instruction body; verbatim fallback reference |
| `plugins/shape/skills/reconcile/` | Cleanup-only dependency set |
| `scripts/lib/shared-skill-references.mjs` and its tests | Safe removal of retired generated bundles |
| `docs/catalog-copy.json`, manifests, platform metadata | Current public surfaces and release versions |

## Verification

- Baseline/source comparison for retained unique gates; byte-for-byte check of extracted digest semantics.
- Shared-reference tests: retired generated files removed; hand-owned files and current bundles retained.
- Catalog tests and the normal marketplace validator (including native/Codex/Cursor packaging).
- Digest's existing offline reducer tests; no live GitHub writes or notifications.
- Read generated root guidance: each family is discoverable without embedding its full text.
- Confirm archived mockup is outside all skill discovery roots and only its matching receipt entry changed.
- Compare final source/installed files, preserve user runtime overrides and selected profile.
- No claim of a blind model A/B improvement: this pass validates preserved contracts and distribution.

## Out of scope

Retiring more named skills, changing digest algorithms, building a new workflow router,
broad pruning of external skills, paid model fan-out, commit, push, or remote publication.
