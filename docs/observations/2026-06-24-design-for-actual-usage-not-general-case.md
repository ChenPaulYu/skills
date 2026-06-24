---
date: 2026-06-24
status: raw
---

# A skill/protocol can be over-built for the *general* case and need same-day reversal — ground the design in the real usage (who · how often · the actual loop) before building the general machinery

> Source: this session — relay was given a 3-kind model + consensus protocol, then collapsed to report→review the same day once the real usage was named.

## What prompted it

relay was designed for the *general* coordination case: multi-party convergence — three entry kinds (discuss / converge / sync) and an `@`-set consensus protocol that graduates decisions ([ADR-052](docs/adr/052-relay-three-kinds.md)). The moment the **actual** usage was stated — "1–2 people, progress-report-centric, little discussion" — the whole apparatus read as over-engineered, and it was reverted to a single **thought-stream (report → review)** with no consensus protocol ([ADR-053](docs/adr/053-relay-thought-stream.md)), all in one session.

## The signal

The over-build came from designing for a usage that wasn't the real one. The cheap guard, before building the general machinery, is three questions about **actual** use:

- **Who** uses it — how many parties? (2 people ≠ a consensus protocol.)
- **How often / what cadence** — frequent-and-light, or rare-and-heavy?
- **What's the real loop** — the dominant path, not the union of all paths it *could* support.

Build the simplest thing that fits that, and let the general case be a later ADR if it ever actually arrives. A simple tool that gets used beats an elaborate one that doesn't — and the elaborate one carries machinery (consensus, kinds, graduation) that all has to be maintained.

The repo-evolution loop (observation → ADR → skill) **does not by itself** catch this: an observation can name a real gap, and the ADR can over-correct by solving the *general* version of it. The grounding question belongs *before* the build, not after the diff.

## Evidence so far

- **Only case (2026-06-24, relay)**: [[relay-conflates-converge-sync-discuss]] named a real gap (converge vs sync) → ADR-052 generalized it into three kinds + consensus → reverted same-day to ADR-053 (report→review) once "1–2 people, progress-centric" was stated. The durable bit of 052 survived as a *tone* (progress vs alignment), not a protocol kind.

(One case → stays `raw`. Promote on a second skill that ships a general-case design and gets simplified on contact with the real usage — then this is a process rule, not a one-off.)

## Links

- Feeds the design discipline behind [ADR-053](docs/adr/053-relay-thought-stream.md). The reverted design = [ADR-052](docs/adr/052-relay-three-kinds.md).
- The observation that drove the over-build: [[relay-conflates-converge-sync-discuss]] (now marked superseded by 053).
