# Skill runtime slimming — verification

> 2026-09-30 · ADR-132 · Local changes and installations verified; no commit or push.

The marketplace still exposes 24 skills. Shared editing rules load at the root; family
maintainer guides and detailed protocols load when needed. The preceding reconcile/sync
work remains in place. This report measures instruction size and checks contracts and
distribution; it does not claim measured model-quality improvement.

## Size comparison

Baseline is the local state after ADR-131, immediately before this pass. Counts are Unicode
characters including frontmatter and whitespace, not tokens. They describe file size, not
the exact context used by any particular runtime or session.

| Surface | Before | After | Reduction |
|---|---:|---:|---:|
| Generated root AGENTS.md | 101,753 | 22,075 | 78.3% |
| Root CLAUDE.md | 27,356 | 20,882 | 23.7% |
| Digest SKILL.md | 18,475 | 2,916 | 84.2% |
| Four frame SKILL.md bodies combined | 18,129 | 5,523 | 69.5% |

Reconcile now carries only its cleanup protocol on all three platforms. The 363 lines of
blueprint-spec and render-template bundles were unnecessary dependencies; their owners
remain available to the workflows that use them.

## Checks and corrections

- `node --test scripts/lib/catalog.test.mjs scripts/lib/shared-skill-references.test.mjs plugins/relay/skills/digest/scripts/compute-state.test.mjs`: **106 passed**. The new retirement case checks owned-file removal, handwritten and other-generator retention, symlink safety, and active bundles. Digest's 86 existing offline cases remain unchanged.
- Digest's entire old `Obligation contract` through the section preceding `Present` was
  compared byte for byte with the new semantic-contract reference: identical except for
  the removed blank separator before the following section. Classifier
  implementation is unchanged. The body keeps collection caveats and read-only behavior;
  the old arrival instruction to take action was corrected to report that action.
- Source comparison retained each frame method's unique reasoning checks and analysis-only
  boundary. Final review explicitly restored first-principles/dialectic's request-to-trigger
  rule. The fallback examples remain packaged.
- The first marketplace validation found seven literal canary expectations for retired
  phrasing. Expectations were updated to the new authorization wording and strengthened
  with premise/evidence/verdict checks; rejection of the old forced chooser remains.
  The final normal marketplace validator passed: **24 plugin skills**, Claude/Codex/Cursor
  generation and compatibility. No frozen-source compatibility-only audit was claimed.
- All four generated family-guide links reach their source owner; none of the full family
  guides remains embedded in root AGENTS.md. Both reconcile render bundles are absent from
  native, Codex, and Cursor packages.
- Blueprint convention validation passed. Staged-file checking later found a trailing blank
  separator in the new semantic reference; it was removed and whitespace checks rerun. The catalog was
  regenerated from source; this pass changed prose, not site layout or navigation. No new
  browser interaction check is claimed for this pass.

## Installation receipt

`sync-installed.sh` preserved Codex's `all` profile and installed 24 skills. Native plugin
versions are frame **0.14.1**, nav **0.20.1**, relay **2.5.4**, and shape **0.24.2**; Codex
adapter release is **1.0.10**. Actual installed bytes matched **78 native files** and
**66 Codex files**; all four Cursor symlinks target the generated source trees. No user
runtime override was changed. New sessions receive the refreshed native cache.

Two old standalone mockup copies in the global Claude and shared skill roots were byte
identical, and the install lock identified the marketplace's old shape source. Both were
moved outside discovery roots under `$HOME/.codex/retired-skills/`. The backup includes
the original lock, per-file hashes, and recovery paths. Only the matching `mockup` receipt
entry was removed; all other entries were compared and preserved. Maintained shape-mockup
remains installed.

The sync script prints a stale-mirror warning whenever regenerated files differ from Git,
including these intentionally uncommitted changes. It exited successfully; generated
equivalence was separately established by the validator and installed-byte comparison.

## Limits

No fresh-model A/B trial or paid fan-out ran. The useful next evidence is whether real tasks
load the right references, retain the reasoning checks, and finish authorized edits without
another generic approval. Smaller files and passing packaging tests alone do not prove it.
Local backups are not a change to repository history, privacy policy, or publication scope.
