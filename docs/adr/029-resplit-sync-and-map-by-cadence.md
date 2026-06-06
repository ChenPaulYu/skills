# ADR 029 — re-split `sync` into `nav:sync` (headers) + `nav:map`, by cadence

**Status**: accepted
**Date**: 2026-06-06
**Supersedes**: [ADR-019](019-sync-collapses-headers-and-map.md) (the headers+map merge — its engine-stays-two-pieces half holds; its one-door half is reversed)
**Amends**: [ADR-003](003-five-skills-not-four-or-six.md) (the roster — the two "describe" renderers are two doors again)

## Context

[ADR-019](019-sync-collapses-headers-and-map.md) merged the former `nav:headers` and `nav:map` into one door, `nav:sync`, on the principle **"merge the door, keep the engine."** Its case rested on two claims:

1. **Shared grounding** — both need the same grounded read of each load-bearing file's role + deps, so one door does that read once.
2. **Map-regeneration *is* the test of the headers** (rule ⑧) — so `map` is downstream of `headers`, a pipeline edge, and a `doctor` would gate between them.

Living with the merge — concretely, a full codebase-map regeneration on the `crate` project (2026-06-06) — surfaced that the merge's central synergy **does not fire in practice**, and that a more fundamental axis was being ignored.

## What the crate run showed

- **Phase A (header-render) was a 1-file touch; Phase B (map-render) was an 8-agent parallel ground + a synthesis agent (~600k tokens).** The two were wildly different in weight inside one invocation — the merge made that asymmetry awkward: you either over-scope the cheap job (sweep every header to justify the map) or under-deliver the expensive one (header-only, map skipped).
- **The shared grounding pass never materialized.** Phase B's agents each re-grounded their own domain from source; none reused Phase A's grounding. The "one read feeds both" benefit was theoretical, not realized — because the two renderers want different granularities of read (a header needs one file; an anatomy needs a domain's cross-edges).
- **Rule ⑧'s validation still holds — but not via an in-skill pipeline.** The map tests the headers by *reading each file's `head -12`*; it doesn't need to run in the same invocation as header-render to do that. The pipeline edge is "map reads headers," which is a cross-skill data dependency, not a single-door requirement.

## The reframe — the unit that's one is the *cadence library*, not the door

ADR-019 separated **door** from **engine** and was right that the engine is two pieces. Its error was assuming the *door* is therefore one. The real invariant is neither: it's that **headers and map run on different cadences**, and cadence — not "are they the same job" — is what decides door count.

| | **headers** (`nav:sync`) | **map** (`nav:map`) |
|---|---|---|
| cadence | continuous — *every time you touch a file* (lint-like) | periodic — *after a wave of change* (a release-note-like projection) |
| cost | cheap (one file, a comment) | heavy (whole-repo render, bilingual, anatomies) |
| consumer | `/shape:reconcile` + every agent's `head -12` | a human onboarding / an agent planning |

Two cadences bound to one door force one of them to be the wrong size. The thing they genuinely share — *a grounded read keyed on `head -12`* — is a **convention both follow**, not a single pass one door must run. So: **two doors, one shared grounding convention.**

(ADR-003 argued "five skills not six" — but the count was never the principle; *cadence-coherence* is. A door should bundle work that runs together at the same rhythm. headers and map don't.)

## Decision

1. **`nav:sync` becomes headers-only** — the per-file navigability door (the former Phase A). Keeps `references/header-render.md`. Light + frequent; offers `/nav:map` at the end when the repo map is also stale.
2. **New `nav:map`** — the per-repo navigability door (the former Phase B). Owns `references/map-render.md` + `references/visual-spec.md` (moved from `sync/`). Periodic + heavy; its grounding reads the headers `sync` maintains (run `sync` first if they're stale).
3. **Shared grounding stays a convention, not a forced single pass.** Each skill grounds at the granularity it needs, keyed on `head -12`. `/nav:audit`'s inventory is still reusable by both when it ran earlier in the session.
4. **No combined door is shipped** (`doctor` was retired by [ADR-021](021-retire-nav-doctor.md) as too thin; its full-pass entry folded into `audit`'s onward hand-off). The cadence argument says you rarely want both at once; when you do, run `sync` then `map`. If a real need for a one-shot full pass reappears, it's an *orchestrator over three doors* (`audit → sync → map`), not a reason to re-merge two.

Roster is now `do · plan · audit · sync · map · refactor`.

## Consequences

- **Two right-sized doors.** `sync` is cheap enough to run on every change (even hook-able); `map` is deliberately a batch you invoke after a wave. Neither distorts the other.
- **The cross-skill edge is explicit.** `map` reads `sync`'s headers; `sync` offers `map`. The dependency that ADR-019 internalized as a phase gate is now a named hand-off (offer-next-action, not auto-run — skills don't invoke each other).
- **Rule ⑧ is preserved.** The map still audits the headers, via `head -12`; a file it had to guess at is flagged → `/nav:sync`.
- **Cost:** a heavy map run re-grounds rather than reusing a header pass. This was already true under ADR-019 (the crate run proved it), so the merge wasn't actually saving it — the re-split makes the honest cost visible instead of claiming a synergy that didn't exist.
