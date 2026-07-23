# ADR 101 — Relay restores `relay.yml` as attested reference data

**Status**: accepted
**Date**: 2026-07-22
**Refines**: [ADR-100](docs/adr/100-relay-adopts-the-accord-memory-model.md)

## Context

The Accord memory model's convergence session ([the blueprint](blueprints/plans/2026-07-22-accord-memory-model.md), section 3, "Attested reference data — the roster") named a gap the model had otherwise left silent. Several backfilled Decision files attribute a conclusion to a named party using a legacy handle — a short identifier from before the coordination work went GitHub-native. Resolving that handle to a real GitHub account and role is load-bearing: a reader of history who cannot make that mapping cannot tell who actually settled a Decision. Yet nothing in the repository owned that mapping. It was implicit, carried in the memory of whoever had been present for the migration — an unrecorded fact with no file, no PR history, and no owner.

The roster is not a new idea. An earlier iteration of the coordination work kept one (`docs/design/relay.md`'s changelog: "Relay began as a separate git-native coordination repository with roster, projects, reports, replies, and consensus"). It was dropped during the GitHub-native migration (ADR-090) because, at the time, it read as exactly the kind of parallel state store the migration was built to retire — GitHub already owns assignment, review, and closure state, and a second file claiming to also track "who is who" looked like the same anti-pattern the migration eliminated everywhere else. That reasoning was sound for *state* (who currently owes what) but did not distinguish it from *reference data* (who a legacy handle refers to) — a different kind of fact, one GitHub has no field for and never will, because it predates the repository's own history.

## Decision

**`relay.yml` is restored as a maintained reference file, under a new formal-memory category: attested reference data.** It holds legacy handle · GitHub account · name · role, one row per party. It is:

- **not a Decision** — nobody is deliberating a conclusion; the file states current facts about identity, not a settled question with a Question/Deliberation/Conclusion shape;
- **not a Brief or Core projection** — it derives from nothing; it is itself the source;
- **not a parallel state store** — the digest reducer never reads it, so nothing Relay computes for "who owes what" depends on its presence, accuracy, or staleness.

Every change goes through a PR. The counterpart's approval on that PR **is** the attestation — no separate Decision file records "we agreed the roster says X," no ceremony beyond the review itself. This is the same authority shape formal memory already uses elsewhere (a Brief's PR review, a Core PR's stricter gate) applied to the simplest possible content: a lookup table both parties sign off on by reviewing the diff.

The canonical shape is `people.<legacy_handle>.{name, github, title, git}`. `name`, `github`, and `title` are required; `git` is optional historical/commit-author reference data and never blocks routing. Legacy handles and GitHub accounts are unique. A consumer may match a requested legacy handle, name, or role only when the result is exactly one row and that row's GitHub account resolves; ambiguity is a question for the user, never permission to guess.

`/relay:launch` owns initialization and later edits. It audits the roster at convention tier (parseable YAML, required fields, uniqueness, and resolvable GitHub accounts). Absence is `missing (optional)`, never a blocker, but `launch` offers a remedy: gather the proposed rows, show the complete YAML and mutations, then open a normal PR after approval. The counterpart's requested review and eventual approval attest the shared mapping. `launch` never writes roster changes directly to the default branch.

The roster is useful only after an agent has found the Relay workspace. GitHub-native Relay therefore also restores an explicit default-workspace resolver for cross-repository use: explicit object/repository → `$RELAY_REPO` → the verified one-line local preference at `~/.config/relay/repo` → a cwd carrying repository-owned Relay markers → ask. `launch` may preview and persist the verified `OWNER/REPO` locally. This pointer is deletable routing configuration, not shared reference data or collaboration state; it is neither committed nor read by `digest`.

`/relay:report` uses the resolved workspace's roster to translate a human-facing recipient into a verified GitHub assignee/reviewer. An explicitly supplied GitHub account may bypass roster matching only after GitHub resolves it. A missing roster, zero matches, multiple matches, or an invalid account stops before author sign-off and creation. `digest` remains roster-independent: obligations still derive only from native GitHub fields.

## Rejected

**(i) Recording the roster as a Decision file.** A roster is living reference data, not a deliberated conclusion. Forcing it through the Decision format would require writing a `## Deliberation` section for a fact nobody argued about — fabricated process for a plain lookup table. And a roster changes over time (a role changes, a new party joins); treating every update as a new superseding Decision turns routine maintenance into ceremony the blueprint's own promotion test (section 4) was written to prevent: "is there a new statement that future people or agents should treat as a valid basis for action or belief?" — a roster edit is not that kind of statement.

**(ii) Keeping the mapping unrecorded.** The status quo before this ADR. Rejected because a load-bearing fact with no owner is exactly the failure mode the blueprint's memory model exists to close — it is the same shape as the supersession-marker gap the blueprint itself flagged in section 7 ("a future reader ... would believe it still holds"), except here the fact was never written down at all rather than written down and left to rot.

**(iii) Letting `report` infer a GitHub account or silently use cwd.** Display names, organization names, and repository remotes are suggestive but not attested identity or destination facts. In a product repository this fallback can create a perfectly valid Issue in the wrong place and assign a similarly named but wrong account. Rejected in favor of verified workspace resolution plus an exact roster match or explicit user-supplied account.

## Consequences

- `relay.yml` lives at each Relay workspace root. The marketplace ships its contract; `/relay:launch` now owns creating or changing the live file through a reviewed PR.
- `plugins/relay/CLAUDE.md` owns the roster schema, verified workspace resolver, and recipient-resolution law. It distinguishes a machine-consumed parallel *state* store (forbidden), attested *reference* data (`relay.yml`), and a local routing preference (`~/.config/relay/repo`).
- `plugins/relay/skills/launch/SKILL.md` audits the optional roster and may initialize/update it through a previewed, counterpart-reviewed PR. It may also preview and persist the verified default workspace locally.
- `plugins/relay/skills/report/SKILL.md` resolves the target workspace before the object router, then resolves the recipient from an explicit verified GitHub account or one unambiguous roster row. It asks instead of guessing.
- No reducer or schema change: `digest` never reads `relay.yml`, so `compute-state.mjs` and `compute-state.test.mjs` are untouched (75/75 stays 75/75).
- No new daily verb. The daily verb set stays `launch · report · digest · reply · brief · settle` plus explicit-only `migrate`; the new capability belongs to the existing setup and reporting doors.
- Relay `2.1.0` → `2.2.0` — backward-compatible new behavior in existing verbs: roster initialization, default-workspace persistence, and verified recipient resolution.
