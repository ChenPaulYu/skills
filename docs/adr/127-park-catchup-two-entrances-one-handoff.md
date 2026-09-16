# ADR-127: Restore park and catchup as two entrances to one handoff

> 2026-09-16 · Accepted and implemented.
> Supersedes ADR-113's single-entry choice, not its storage convention or reflect retirement.

## Decision

Replace shape-baton with **shape-park** (save the session stopping point) and
**shape-catchup** (reconstruct current work). Both remain explicitly invoked.
The owner still reaches for these two action names; a shared artifact does not
require a shared button. No compatibility alias keeps a third active skill alive.

Keep existing `blueprints/baton.md` and root `HANDOFF.md` data compatible. Follow
an established blueprints location, consume readable legacy notes, and do not
migrate files merely because an entrance was renamed. The five fields remain
goal, done, now, open, and next. The handoff is a convention, not a validated schema.

## One owner, independent packaging

`plugins/shape/references/session-handoff.md` owns the shared location, fields,
and evidence rules. `scripts/lib/shared-skill-references.mjs` maps that owner to
the two bundled references; `scripts/build-manifests.mjs` materializes them before
the platform generators. The existing validator re-derives and compares both
destinations. Claude, Codex, and Cursor therefore receive self-contained skills
without two hand-maintained copies or runtime skill-to-skill calls.

Direction-specific gates remain in their respective bodies. Park previews an
overwrite and honors authorization already given. Catchup checks current state,
including staged and untracked changes even when the recorded SHA matches HEAD.
It reports freshness and fallback tier and does not start implementation.

Two old contradictions are removed while separating the directions: there is no
stale root-only location rule underneath the blueprints rule, and reading a note
does not itself justify deleting it. Cleanup requires finished/superseded work
and durable preservation of still-relevant rationale. A chat summary alone is
insufficient. Technical paths are allowed when needed for a concrete next action;
the report remains concise and decision-level, not a change inventory.

## Trade-offs and boundaries

- The roster grows from 22 to 23 skills (shape: seven to eight). This adds one
  discoverable entry and packaging mapping, accepted for the user's familiar verbs.
- One shared source plus generated copies prevents format drift; the validator
  owns that check, rather than an instruction to remember to edit both.
- Catchup means current project work, not a general repo tour, historical recap,
  reprioritization, or authorization to build. Shape-align retains durable priorities.
- Old invocation names must be updated. Historical ADRs and the disk filename
  remain truthful history, not active aliases. Reflect stays retired.

## Verification

Regenerate manifests and both platform adapters; run the marketplace validator,
shared-reference generation tests, and skill frontmatter checks. Inspect current
registration/profile entries and the bilingual site graph for both entrances.
Sync installed copies only after these checks, preserving the installed profile.
