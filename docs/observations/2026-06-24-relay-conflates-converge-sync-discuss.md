---
date: 2026-06-24
status: raw
---

# relay collapses three coordination verbs (discuss · converge · sync) into one terse shape; it needs an explicit `kind` with per-kind length discipline

> **TL;DR**: relay's `report`/`digest` optimize for *converge* (drive a decision to consensus) and treat everything else as a brief FYI tail. But async coordination has three distinct verbs — **discuss** (think together, no fork yet), **converge** (ratify a framed decision), **sync** (bring someone's model up to date) — and they need *different* length disciplines. Brevity is converge's rule, not sync's: a sync briefing's job is understanding-transfer, which sometimes needs room. Fix = a frontmatter `kind: discuss|converge|sync`; digest treats a `sync` entry as a pointer (show its `subject`, don't triage its body) so length doesn't drown the 3-second triage.

## What prompted it

Drafting the first relay report to sync a CEO on a re-architecture. The content kept fighting the format: it was an *orientation briefing*, but report's only home for non-decision content is a "Done" bucket disciplined to stay brief (anti-changelog). Every attempt to make it clear made "Done" too heavy. The mismatch was structural, not a wording problem.

## The signal

The three verbs form a **lifecycle**, not just parallel options: **discuss → converge → sync** (think it out → ratify it → broadcast the result). relay only encodes converge's discipline, so discuss gets mis-shaped as a premature `[D]` and sync gets mis-shaped as a brief FYI.

The fix is NOT "let Done be long" — that pollutes digest's triage stream. It's to make each verb a first-class *shape* with its own discipline, and have digest treat them differently:

- **converge** — the existing buckets, terse, top layer only (depth by link).
- **sync** — `subject` + a briefing body (length allowed); digest shows the subject as a "briefing available" pointer, does not explode the body into triage.
- **discuss** — an open question + framing + candidate angles (no resolution); responses are takes, not accept/reject.

An optional light ack on a sync reuses the existing `[D]`+accept machinery (no new response type — avoids N+1).

## Evidence so far

- **Only case (2026-06-24, relay first-report)**: a sync briefing forced into report's converge shape; `report` already gained a `subject` field this same session (toward this), and `digest` gained an every-run `@you` sweep — both point at the same gap.

(One case → stays `raw`. Promote when a second coordination episode hits the converge/sync mismatch, or once the `kind` change ships and a real `sync` entry is written.)

## Links

- Feeds [ADR-050](docs/adr/050-relay-plugin.md) (the relay model). Candidate for a new ADR: "relay's three coordination kinds."
- Related: [[sync-is-distilled-state-not-worklog]] (sync's content discipline), [[skill-reuse-is-reference-not-import]] (why sync's body references `/nav:compose` rather than re-specifying it).
