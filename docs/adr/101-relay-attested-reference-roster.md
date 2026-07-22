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

`/relay:launch` audits it, read-only, at convention tier: parseable YAML, and its GitHub-account handles resolve (`gh api users/<handle>`). Absent is `missing (optional)`, never a blocker — a repository with no legacy handles to map does not need one.

## Rejected

**(i) Recording the roster as a Decision file.** A roster is living reference data, not a deliberated conclusion. Forcing it through the Decision format would require writing a `## Deliberation` section for a fact nobody argued about — fabricated process for a plain lookup table. And a roster changes over time (a role changes, a new party joins); treating every update as a new superseding Decision turns routine maintenance into ceremony the blueprint's own promotion test (section 4) was written to prevent: "is there a new statement that future people or agents should treat as a valid basis for action or belief?" — a roster edit is not that kind of statement.

**(ii) Keeping the mapping unrecorded.** The status quo before this ADR. Rejected because a load-bearing fact with no owner is exactly the failure mode the blueprint's memory model exists to close — it is the same shape as the supersession-marker gap the blueprint itself flagged in section 7 ("a future reader ... would believe it still holds"), except here the fact was never written down at all rather than written down and left to rot.

## Consequences

- New file, not built by this ADR: `relay.yml` at the repository root (a per-workspace file, not part of this marketplace repository — the marketplace ships the *contract*, not a live roster).
- `plugins/relay/CLAUDE.md` — the "Minimal implementation" section no longer states there is no roster file; it now names the forbidden thing precisely (a machine-consumed parallel *state* store) and says a jointly attested *reference* file is formal memory. The "Raw, briefs, and Core" section gains `relay.yml` as a fourth formal-memory category alongside `decisions/`/`briefs/`/`core/`.
- `plugins/relay/skills/launch/SKILL.md` — the audit checklist gains one optional, convention-tier item (parseable YAML, handles resolve via read-only `gh api users/<handle>`; absent = `missing (optional)`, never a blocker); the Discipline section's prohibition no longer names "roster" as forbidden outright.
- No reducer or schema change: `digest` never reads `relay.yml`, so `compute-state.mjs` and `compute-state.test.mjs` are untouched (82/82 stays 82/82).
- No new daily verb. The daily verb set stays `launch · report · digest · reply · brief · settle` plus explicit-only `migrate`; `launch` gains an audit item, not new write authority — it never creates or edits `relay.yml`, since a change is PR-gated counterpart attestation, not a setup mutation.
- relay `2.0.0` → `2.0.1` — a documentation/audit-surface addition, no behavior change to any verb's routing, obligation, or write contract, so a patch bump, not a minor or major one.
