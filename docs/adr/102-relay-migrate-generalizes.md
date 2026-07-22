# ADR 102 — `migrate` generalizes from a v0→v1 bridge to a pre-model coordination-state migrator

**Status**: accepted
**Date**: 2026-07-22
**Refines**: [ADR-090](docs/adr/090-relay-github-native.md), [ADR-100](docs/adr/100-relay-adopts-the-accord-memory-model.md)

## Context

`migrate` was scoped narrowly by ADR-090 (2026-07-21): an explicit-only bridge that inventoried Relay's own pre-GitHub-native v0 repositories (file-based ledgers, thought streams, status frontmatter) and promoted their reusable content into the then-new GitHub-native v1 model. That target existed, was migrated once (2026-07-22, the same convergence session that also produced ADR-096 through ADR-100), and — as of this ADR — no longer does: every repository this plugin's own history names as a v0 holdout has completed that move. The skill's SKILL.md still described the process entirely in v0→v1 terms (`legacy Relay repository`, `GitHub-native model`), and its site-map/README prose called it "untouched by ADR-100."

That framing was already too narrow even before this ADR. `migrate`'s actual discipline — freeze evidence, inventory completely, classify every item exactly once via the promotion test, show the mapping before writing, execute idempotently, verify, cross the effective point — has nothing v0-specific about it. It is the correct shape for *any* repository adopting Relay that already has pre-model coordination state: a different tool's file-based protocol, an overloaded ACK-style Discussion standing in for a receipt, a decision that only ever lived in a commit message or a closed Issue's last comment, an ad-hoc roster nobody owns. The v0→v1 wording didn't just describe a completed job — it actively mis-scoped the skill for the next repository that adopts Relay carrying none of Relay's own history.

## Decision

**`migrate` is rewritten as a general legacy-coordination → memory-model migrator.** Its target is no longer "a legacy Relay repository" but "any repository's pre-model coordination state" — file-based ledgers or thought streams (Relay's own v0 protocol is one instance, not the definition), overloaded ACK-style Discussions, announcement-type objects, decisions living only in commit messages or closed Issues, and unowned reference tables. The process shape carries over verbatim in spirit, generalized:

1. preflight (`/relay:launch` first, never infer a target);
2. preserve evidence (freeze tag/permalink baseline for file-based legacies; GitHub-hosted legacy objects need no separate freeze, their own history already is one);
3. full inventory;
4. classify each source item **exactly once** via the promotion test, into one of five dispositions — backfill a Decision file (with honest `status`/supersession, never backfilled `active` when the record shows otherwise), Resolution-only close, derived-view/Brief material, attested reference data (a roster, PR-gated, not a Decision), or discard-with-record;
5. show the complete mapping and wait for approval before any write;
6. execute idempotently — Decision backfills under the same five direct-commit fuses `settle` uses, open items as signed-off Resolution comments plus closes, announcement-shaped objects converting to `tell`/`needs-input` Issues **only when action or receipt is still owed** (otherwise closing with a plain Resolution — migration never manufactures a fresh obligation out of a stale broadcast), and a reversal of an already-agreed legacy decision routing through the Issue-based consent path (ADR-099) rather than announce-only;
7. verify with read-backs plus a conformance sweep run where the target repository has one;
8. the effective point: the migration's own changes merged to the default branch and read back.

Rules that carry over unchanged in spirit: never create `legacy/`/`raw/`/`archive/`/time-bucket mirrors (immutable history is the archive); author sign-off (ADR-095) on every backfilled Decision file and Resolution comment; the five recorder fuses on every backfill; the cite-never-restate law on any derived view touched. `migrate` stays `disable-model-invocation: true` and explicit-only — it remains exceptional, destructive-adjacent compatibility work, never a substitute for the six daily verbs.

## Rejected

**(i) Retire `migrate` (YAGNI).** Its only named target had already migrated, so a strict YAGNI reading says delete it and let a future repository adoption improvise. Rejected: the discipline the skill packages — freeze, inventory-once, classify-once, map-before-write, idempotent execution, verify, effective point — is exactly the sequence a careless migration skips, and every future Relay adoption over an existing coordination habit needs it. Deleting the skill would not delete the need; it would just mean re-deriving the same discipline ad hoc, under pressure, the next time a repository shows up with a file-based ledger or an ACK-shaped Discussion to convert.

**(ii) Leave the SKILL.md as-is, v0→v1-scoped.** The cheapest option. Rejected: it is a stale surface stating a false present-tense claim — "a legacy Relay repository," "the GitHub-native model" — for a job description that no longer matches what the skill is asked to do or what target exists to receive it. A stale SKILL.md is the same lie as a stale file-top header; the fix is a rewrite, not a shrug.

## Consequences

- `plugins/relay/skills/migrate/SKILL.md` — full rewrite: general pre-model-coordination-state scope, the "what counts as pre-model coordination state" section (not one specific legacy format), the generalized 8-step process with the five-way promotion-test classification, the founding-precedent line (anonymized: "the first migration of a private coordination repo"). `disable-model-invocation: true` and destructive-adjacent, explicit-only character both unchanged.
- `plugins/relay/CLAUDE.md` — the six-daily-verbs footnote and the "Cost and invocation" line both drop "v0-to-v1"/"legacy conversion" wording in favor of "pre-model coordination state"; this ADR added to the header ADR list.
- `README.md` — the `/relay:migrate` line rewritten to the new scope.
- `docs/site/index.html` — the migrate skill-row blurb (EN+ZH) rewritten; the "✓ VERIFIED" relay-skills bullet's "untouched, still the legacy v0-to-v1 bridge" parenthetical updated to reflect the new scope; ADR count 101 → 102.
- `docs/design/relay.md` — one changelog line.
- No reducer or schema change: `digest` never reads anything `migrate` produces beyond ordinary Decision/Brief/Core files and native GitHub objects, so `compute-state.mjs`/`compute-state.test.mjs` are untouched (75/75 stays 75/75).
- No new daily verb, no version-owner change to the daily verb set. relay stays `2.1.0` — a documentation/skill-scope rewrite with no behavior change to any of the six daily verbs' routing, obligation, or write contracts.
