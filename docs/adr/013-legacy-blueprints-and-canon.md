# ADR-013 — Legacy blueprints and canon

Status: accepted · 2026-11-18

## Decision

Old `blueprints/` trees (thoughts, the `plan.md` board, plans, mockups,
decisions) remain readable by status, tidy and mockup, but new work does not write
them. Mockups have no lifecycle of their own: keep one only while it is canon-pinned
or in flight, and render overviews on demand rather than maintaining a standing page.
Canon has no folder or write protocol. A principle routes by how it must fire: every
turn goes to an always-loaded guide, on a trigger goes to a skill, as a case goes to a
durable decision record. Decisions are born durable: a status line, the call, how it
shows, and what was rejected.

## Evidence and alternatives

- A big up-front roadmap was rejected in favor of small tracked items.
- A standing `overview.html` with a consumption gate was rejected: nobody read it.
- Keeping every mockup after code absorbs it was rejected.
- A `core/` canon tier with a freeze protocol and amendments ledger was tried and
  retired; so was a canon-authoring verb.
