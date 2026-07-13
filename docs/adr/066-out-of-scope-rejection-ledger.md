# ADR 066 — `docs/out-of-scope/`: a rejection ledger, separate from deferral

**Status**: accepted
**Date**: 2026-07-13

## Context

This repo already has plenty of places a *deferred* item gets recorded — a plan's "Out of scope (deferred)" section, an ADR's "Consequences" future work. What's missing is a place for the other kind of closed question: a proposal that was actually **considered and turned down**, with a reason. Without one, a rejected idea's only trace is buried inside whichever ADR or plan happened to reject it — discoverable only by someone who already knows to look there. `mattpocock/skills` carries a `.out-of-scope/` directory for exactly this purpose; this repo adopts the same shape, adapted to sit under `docs/` alongside the existing `docs/adr/` convention.

## Decision

1. **New directory `docs/out-of-scope/`**, one Markdown file per rejected proposal, each carrying: the rejected proposal (one line), the reason, a source citation (verbatim quote + path, so the rejection is verifiable, not just asserted), and a date.
2. **`docs/out-of-scope/README.md`** owns the format and the one hard rule: **deferral ≠ rejection**. A "not now, revisit later" item stays in its originating plan/ADR; only a "considered and turned down" item gets a ledger file. This is a governance distinction, not a filing-cabinet one — conflating the two would make the ledger either useless (full of things still open) or misleading (implying live options are closed).
3. **Root `CLAUDE.md`'s "New skill" maintenance rule** gains one clause: check `docs/out-of-scope/` before proposing a new skill or reopening a design question, so a rejected idea isn't re-pitched from a blank slate.
4. **Seeded with two entries**, each verified against its cited source at authoring time (not reconstructed from memory): the rejection of literal skill-to-skill invocation (`docs/adr/015-converge-verbs-offer-align.md`, plus the standing invariant restated in `nav`'s and `shape`'s `CLAUDE.md`), and the rejection of Changesets-based release automation (`blueprints/plans/2026-07-13-matt-skills-adoption.md`'s Out of scope section).

## Why

- A rejection with no durable, discoverable trace gets re-argued from zero every time someone independently thinks of it — the ledger's job is to make the *previous* argument the starting point for the next one, not to forbid revisiting anything.
- Keeping deferral separate from rejection matters precisely because this repo's plans defer things constantly (that's a healthy, ordinary planning move) — folding deferred items into the same ledger as genuine rejections would drown the rare, deliberate "no" in a much larger pile of ordinary "not yet"s.
- Seeding with verified-not-recalled entries sets the standard for every future entry: a citation with a verbatim quote and a path, checkable by any reader, not a paraphrase trusted on the ledger's own authority.

## Consequences

- `docs/out-of-scope/README.md` + two seed files are new, gated as any other doc (validated by `node scripts/build-codex.mjs` regeneration for the root `CLAUDE.md` change, `node scripts/validate-codex-skills.mjs` green).
- Root `CLAUDE.md`'s "New skill" rule is amended (one clause added); no other maintenance rule changes.
- Consuming this ledger from other verbs (`/shape:elicit`, `/reflect:observe`) is explicitly **not** decided here — left as optional future work per the adoption plan this ADR implements.
- The ledger's completeness is not audited by any script — like the site-map rev/ADR-count and plugin `CLAUDE.md` rosters, it's a surface no gate reaches; keeping it current is a manual discipline, same as everything else root `CLAUDE.md` already flags as ungated.
