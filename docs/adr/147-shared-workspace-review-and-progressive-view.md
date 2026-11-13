# ADR-147 — Share review facts between agents and the workspace view

Status: Accepted
Date: 2026-11-14

## Decision

The optional workspace reader owns a read-only `review` projection. The human view
consumes that same result rather than inventing a second cleanup policy in JavaScript.
Unverified imports, work without canonical relations and superseded records are
advisory review signals. None authorizes deletion, completion or fabricated parents.
A standalone idea remains valid. Tidy still checks current implementation, retained
reasons, inbound links and recovery before retiring anything.

Keep debugging observations inside the original task, distinguishing symptoms,
hypotheses, evidence and next checks. Split only when independent work needs its own
ownership, next action or completion. This adds no record kind or required schema.

The offline view leads with confirmed work and reveals search, local relation context,
full text and source metadata on demand. A quiet canvas with content cards replaces
the full inventory graph. Existing typed relations and original task files remain the
only authority; the view does not edit or duplicate progress.

Exports include one project by default. Including every project requires explicit
`--all-projects`, because the resulting private HTML contains their complete bodies.
Malformed records remain readable with diagnostics, without merging duplicate IDs.

## Consequences

Shape owns the implementation and shared lifecycle reference. Nav and other Shape
consumers receive generated self-contained copies. Both plugin versions change.
There is no new skill, database, graph file, expiration clock or archive ceremony.
Tests cover advisory semantics, source immutability and the explicit export boundary;
rendered interaction checks cover navigation and disclosure at multiple viewport sizes.
