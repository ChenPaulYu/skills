# ADR-136 — Retire the relay plugin and `shape:migrate`

> 2026-11-13 · Status: accepted · Supersedes the relay plugin's roster (ADR-115 lineage) and ADR-105's `migrate` verb; the migration ledger survives as a design document.

## Context

Transcripts from Claude Code and Codex sessions for 2026-10-09 through 2026-11-13
(about five weeks) show `relay:digest`, `relay:reply` and `relay:report` at zero uses,
`relay:settle` at one use, and `shape:migrate` at zero SKILL.md reads. Five weeks is
short of ADR-109's three-month zero-fire rule, so the window alone does not authorize
deletion.

The authority is different: the owner attests that both are genuinely unclaimed, which
is the third cause in ADR-107's three-causes check (never reachable, mis-triggered,
or genuinely unclaimed). After reviewing this usage evidence, the owner decided to delete both outright.

## Decision

1. Delete the whole `relay` plugin (`digest`, `reply`, `report`, `settle`) and its
   marketplace entry. Generated platform artifacts are regenerated. The one-way
   legacy-hook cleanup in `scripts/build-codex.mjs` and `scripts/lib/codex-compat-audit.mjs`
   stays: it removes the session-start hook from older installs and has no relay source
   dependency.
2. Delete `shape:migrate`. Shape goes from nine skills to eight; its minor version bumps.
3. The convention migration ledger is not deleted. `validate-blueprints.mjs` and
   `/shape:align` tell users how to upgrade legacy trees, so the ledger (version-detection
   table, protocol, `M<n>` entries) moves verbatim to
   `plugins/shape/skills/align/references/migration-ledger.md`, with a short retirement
   note. It is bundled with align rather than kept under `docs/` because a skill runs in
   other projects and must carry its own references; a repo-relative `docs/` path would
   resolve against the user's project and dangle. Upgrading is now manual, following that
   document. The rule that a convention change lands its `M<n>`
   entry in the same commit still applies, now to the ledger file.
4. Live references that named `/shape:migrate` (reconcile, align, blueprints-spec, the
   blueprints validator) point at the ledger document instead.
5. Historical records (`docs/adr/`, `docs/observations/`, `docs/findings/`, `docs/plans/`,
   `docs/design/relay.md`, `blueprints/`) are dated and left untouched.

## Consequences

- Fewer resident skill descriptions; the marketplace is three plugins (`nav`, `shape`, `frame`).
- Re-entry: if relay-style GitHub coordination or automated tree upgrades are wanted
  again, restore from git history (the last commit containing `plugins/relay/` and
  `plugins/shape/skills/migrate/`) rather than rebuilding.
- The shape-migrate recipe is not lost, but no longer has an automated gate (verbatim,
  tracked-check, user confirmation); a manual upgrade must apply those by hand.
