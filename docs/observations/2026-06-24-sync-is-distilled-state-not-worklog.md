---
date: 2026-06-24
status: raw
---

# a relay sync/briefing carries distilled STATE, never a chronological work-log; the raw log lives in the project repo and relay points at it

> **TL;DR**: When relay gains a `sync` kind that allows length ([[relay-conflates-converge-sync-discuss]]), the immediate risk is that work-logs flood in through it — defeating the brevity that protects digest. The guard: sync is organized by **knowledge** ("what you need to understand"), a work-log by **chronology** ("what I did when"). They are different artifacts, not long-vs-short versions of one. The raw log's home is the project repo (`progress.md` / `CHANGELOG`); a sync may carry *distilled state* + a pointer to it, never the dump. Encode "chronological changelog/work-log dump" as sync's explicit anti-pattern.

## What prompted it

While designing relay's `sync` kind, the user asked the sharp question: "does sync include the work-log?" If yes, sync becomes the loophole that reopens the floodgate the converge-brevity rule was holding shut.

## The signal

The distinction is **organizing axis, not length**:

- ✅ sync: "Crate now runs the full think→capture loop; next is W" — distilled state + meaning, reader-oriented.
- ❌ not sync: "6/1 did A, 6/3 did B, 6/5 fixed C…" — chronological activity, record-oriented → project repo.

This is already backed by an existing rule: **`/nav:compose` rule ④ — group by knowledge, not chronology** ("temporal decomposition" is a named red flag). So sync's anti-pattern isn't a new invention; it's compose ④ applied to the relay genre. Analogy: a work-log is the flight recorder; a sync briefing is the captain's announcement — not a shorter recorder, a different thing.

The underlying pull to dump the log into relay is really "I'm afraid my work won't be seen." The fix meets that need without the dump: keep the log in the repo, and surface it via a sync's distilled state + a link when it matters.

## Evidence so far

- **Only case (2026-06-24, relay sync design)**: user converged from "I want a work-log lane in relay" to "the raw log shouldn't be in relay at all" once the knowledge-vs-chronology axis was named.

(One case → stays `raw`. Promote if a real sync entry starts accreting a changelog and the anti-pattern has to be cited to stop it.)

## Links

- Applies [ADR-049](docs/adr/049-nav-compose-verb.md) rule ④ to relay. Part of [[relay-conflates-converge-sync-discuss]].
