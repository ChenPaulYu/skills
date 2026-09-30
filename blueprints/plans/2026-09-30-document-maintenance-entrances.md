# Project reconciliation and document sync — plan

> Status: implemented locally; see `docs/findings/2026-09-30-reconcile-and-sync-checks.md` for verification and limits.
> Generated: 2026-09-30 · Source: owner-approved conversation · Grounding: current origin/main `edfe557`

## Context

The owner needs two distinct actions: reconcile completed or stale project design material,
and check that reader-facing documents such as README describe the current implementation.
The first is buried in shape-align; the second is nav-sync's on-demand docs leg. Align also
mixes priority judgment with a whole-turn mechanical model override. The working clone and
managed installs were updated before this work; the pull hook regenerated three stale mirrors.

## Resolved questions

- Restore shape-reconcile for the lifecycle of blueprints, preserving decisions and rationale.
- Keep one nav-sync for source headers and README/setup/usage/API/architecture documents.
- Keep shape-align focused on verified board status and user-owned priorities.
- Retire the standing codebase-map render workflow and its reference machinery; the owner reports no readership. Do not delete unrelated existing project artifacts.
- A README/docs batch inventories and completes the full requested document set, with a disposition per file.
- Checks are on demand. A check-only request writes nothing; an authorized update proceeds
  without a second generic approval. Destructive cleanup still requires its concrete scope.
- Existing blueprints paths and formats remain compatible. No framework or automatic hook
  for semantic document checking is introduced.

## Approach

1. Extract reconcile's protocol from align, preserving retirement and untracked-file safeguards;
   align retains board-item verification and stops requiring a full cleanup before triage.
2. Extend nav-sync's docs protocol from roster/link checks to behavioral
   claims and missing reader workflows. Preserve intended-but-unimplemented decisions, historical
   records, generated ownership, and explicit coverage limits.
3. Share the existing blueprints format through the bundled-reference generator. Update current
   callers and documentation so each responsibility has one owner. Keep judgment on the session.
4. Record ADR-131 and mark the affected portions of ADR-108/112/125 as superseded. Update plugin
   versions, adapter metadata, editorial catalog, README lookup, site anatomy, and the board.
5. Regenerate manifests/catalog and both adapters; run repository validators and focused
   packaging checks. Review bounded workflow scenarios and exercise the repository
   surfaces; report the limits of same-session diagnostics rather than claim a blind model evaluation.
6. Refresh managed installs with the existing profile and verify installed bytes and new names.

## Critical files

| Owner | Planned change |
|---|---|
| `plugins/shape/skills/align/` | Board-only responsibility; remove whole-turn model override |
| `plugins/shape/skills/reconcile/` | Restored entry and transferred blueprint cleanup protocol |
| `plugins/nav/skills/sync/` | One explanation-sync entry; remove map machinery; strengthen docs and header checks |
| `scripts/lib/shared-skill-references.mjs` | Bundle the existing blueprint specification for reconcile |
| `plugins/shape/CLAUDE.md`, `plugins/nav/CLAUDE.md` | Family responsibilities and current routes |
| `docs/catalog-copy.json`, `platforms/codex/descriptions.json` | Human and host discovery surfaces |
| Plugin manifests and adapter manifest | Release metadata and capability consumers |

## Verification

- Catalog and shared-reference unit tests; all marketplace consistency/compatibility gates.
- New skills registered and independently packaged in Claude, Codex, and Cursor forms.
- Route cases: priorities → align; stale blueprints → reconcile; README/setup/architecture →
  nav-sync; headers → nav-sync; session resume → catchup.
- Document diagnostic: renamed command, changed behavior, missing capability, planned work,
  historical ADR, generated document owner, and an unverified runtime claim.
- Reconciliation diagnostic: completed plan, still-live reason, unknown status, referenced mockup,
  untracked content, absent/nonstandard tree, and no automatic priority changes.
- `git diff --check`; exact installed-mirror comparison after synchronization.

## Out of scope

Changing product code, automatic full-repo checks after each edit, resurrecting retired canon
tiers, unrelated skill pruning, and publishing this change to the remote.
