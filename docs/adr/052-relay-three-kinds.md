# ADR 052 — relay entries have three kinds: converge · sync · discuss

**Status**: superseded by [ADR-053](docs/adr/053-relay-thought-stream.md) — the three kinds + consensus were over-engineered for the 1–2-person report→review pattern; relay collapsed to a thought-stream the same day.
**Date**: 2026-06-24
**Refines**: [ADR-050](docs/adr/050-relay-plugin.md) (the relay plugin — extends its single-shape entry into three kinds), [ADR-049](docs/adr/049-nav-compose-verb.md) (sync's body navigation is delegated to `compose`)
**Evidence**: [[relay-conflates-converge-sync-discuss]], [[sync-is-distilled-state-not-worklog]], [[progressive-disclosure-two-axes]] (observations, 2026-06-24)

## Context

ADR-050 gave `report` one shape — the standup buckets (Needs-decision · Blocked-on · Done), disciplined to be terse so `digest` can triage "what needs you" in 3 seconds. That shape optimizes for **converge** (drive a framed decision to consensus) and treats everything else as a brief FYI tail.

Dogfooding the first real use — syncing a CEO on a re-architecture — surfaced the gap: the content was an **orientation briefing**, not a decision, and forcing it into the terse "Done" bucket fought the format every time. Coordination has more than one verb, and they need *different* length disciplines: brevity is converge's rule, not a universal one.

## Decision

**An entry declares a `kind` (frontmatter), one of three coordination verbs, each with its own shape and length discipline.** They form a lifecycle: **discuss → converge → sync**.

| kind | the verb | body | length discipline |
|---|---|---|---|
| **converge** | ratify a framed decision | Needs-decision · Blocked-on · Done | terse — one line per item, depth by link (the ADR-050 shape) |
| **sync** | bring a model up to speed | TL;DR → explanation → Example (+ optional Needs-ack) | **length allowed** — its job is understanding-transfer, not triage |
| **discuss** | think together, pre-decision | Question · Angles | open; responses are takes, not accept/reject |

Supporting decisions:

- **`digest` treats kinds differently.** A `sync` is shown as a **pointer** (its `subject` + a link), never exploded into the triage list — so a long briefing can't drown the 3-second view. `discuss` entries get an "Open for your input" section; converge keeps "Needs your decision". The every-run `@you` sweep covers all kinds.
- **One entry, one kind** → **one file per entry**: `thoughts/<date>-<handle>-<slug>.md` (the old `<date>-<handle>.md` couldn't hold two kinds, since `kind` is per-file frontmatter).
- **sync's navigation reuses `compose`; its grounding idiom is its own.** Progressive disclosure factors into two orthogonal axes — *navigation* (gist→detail, owned by `/nav:compose`) and *grounding* (claim→evidence→example, a genre idiom). sync references compose for the first and defines `TL;DR → explanation → evidence → example` for the second ([[progressive-disclosure-two-axes]]).
- **sync ≠ work-log.** A sync carries *distilled state*, organized by knowledge; a chronological work-log stays in the project repo (`progress.md`), and a sync points at it. "Chronological dump" is sync's named anti-pattern (backed by compose rule ④) — without it, `sync` would be the loophole that reopens the flood the brevity rule held shut ([[sync-is-distilled-state-not-worklog]]).
- **No new machinery for acks.** A sync's optional ack reuses the existing `[D]`+accept gate; a discuss take reuses the `counter` reply line. No new response type (anti-N+1).

## Why kinds, not just "a longer Done"

Relaxing converge's brevity in place would pour briefing-length content into the same stream `digest` triages — drowning the signal. The value of the buckets is the *exclusion* of long-form. So the fix is a first-class **shape per verb** with its own discipline, and a `digest` that routes each kind to a different presentation — keeping the triage stream lean while giving sync the room it needs.

## Consequences

- **Format contract updated** (`plugins/relay/CLAUDE.md`, the single owner): `kind` + `subject` frontmatter, the three body shapes, the `-<slug>` filename, members-as-list.
- **Skills touched in the same commit**: `report` (write the kind), `digest` (present per kind), `reply` (respond across kinds), plus `register`/`launch` (members may hold a role list) and `compose` (the navigation-vs-grounding seam made explicit).
- **`subject` frontmatter** (added earlier this session) is now load-bearing — it is what `digest` shows for a `sync` pointer.
- **Backward shape**: a `converge` entry is exactly the ADR-050 buckets, so prior reports remain valid; only the filename convention and the optional `kind` tag are new.

## Out of scope

- **`settle` kind-awareness** — left as-is (non-critical, recomputed); a sync briefing has no thread to archive unless it carries an ack. Revisit if briefings accrete.
- **A dedicated `discuss`/`sync` verb** — rejected as N+1; the three kinds share ~80% of `report`'s machinery, so they are modes of one verb, not separate skills.
