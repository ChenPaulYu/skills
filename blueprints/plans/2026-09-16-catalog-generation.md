# Generated public catalog — plan

> Generated: 2026-09-16 · Source: owner-approved maintenance automation
> Grounding: current generators, public surfaces, validator, and hook entry points.

## Context

Plugin manifests already own versions; SKILL.md frontmatter owns skill discovery
and explicit invocation. README.md and docs/site/index.html repeat the roster,
counts, and versions by hand. validateRegistration checks only token presence
(including historical mentions); validateSiteMapVersions scans formatting-sensitive
prose and can miss differently quoted objects. Neither is a dependable catalog.

## Approach

1. Keep existing English README prose and bilingual site prose in a hand-owned
   docs/catalog-copy.json keyed by plugin/skill. This is editorial copy, not a
   second roster: absent/retired entries never create live skills. New skills use
   their source description until editorial copy is supplied.
2. Discover active plugin manifests and skill frontmatter in scripts/lib/catalog.mjs.
   Generate marked README plugin/skill blocks and the site's DOMAINS/CB_NODES data
   block. Derive version/count metadata and invocation categories there. Keep the
   site's semantic anatomy diagrams, layout, interaction, and historical audit
   narrative manual; do not infer relationship edges for new skills.
3. Integrate via build-manifests so the existing generation command remains the
   entry point. The validator compares regenerated public surfaces, rejecting
   stale/missing blocks without regex-matching version prose. Installation sync
   runs this owner generation before platform builds.
4. Update authoring instructions to distinguish generated inventory from manual
   explanations. Remove current hardcoded numeric inventory prose at migrated
   surfaces; preserve historical statements as dated evidence.

## Critical files

- scripts/lib/catalog.mjs and catalog.test.mjs — discovery/rendering and isolated tests.
- scripts/build-manifests.mjs — existing generator entry point.
- scripts/validate-codex-skills.mjs — fail-closed derived-surface drift check.
- docs/catalog-copy.json — migrated editorial prose and graph layout hints.
- README.md and docs/site/index.html — marked derived blocks, existing navigation.
- CLAUDE.md, scripts/sync-installed.sh, scripts/hooks/pre-commit — maintenance path.

## Verification

Use isolated fixtures for version-only updates, additions/renames/removals, explicit
invocation changes, missing editorial copy, malformed source/markers, determinism,
and preservation outside generated blocks. Confirm both language versions derive
the same metadata. Run existing marketplace/blueprints validators, regenerate twice,
and browser-check counts, search, language switch, graph details, and anchors.
An isolated stale-public-surface mutation must fail the validator.

## Out of scope

No skill behavior change, automatic prose rewriting or translation, automated
semantic anatomy design, release/Changesets adoption, commit, or push. Existing
uncommitted renovation work and installed profile selection remain intact.
