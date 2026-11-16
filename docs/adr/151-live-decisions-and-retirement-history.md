# ADR 151 — Keep live decisions distinct from retirement history

**Status**: accepted
**Date**: 2026-11-16

## Context

A design thought accumulated an artifact-by-artifact retirement list during cleanup.
New design conclusions were then added to the same record to satisfy a document-count
preference. Recovery facts remained available, but the active decision became difficult
to read. Preserving reasons should not turn the live decision owner into a cleanup log.

## Decision

The shared record-interface owns the distinction: a thought retains its current choice,
operative reasons and still-useful alternatives. Deferred work remains in the appropriate
idea/task without gaining implementation authority. Completed cleanup chronology may be
removed within authorized tidy after verifying exact committed recovery. Necessary
non-Git restoration instructions use an existing preservation owner. Neither a new
mandatory archive nor one replacement record per retired item is required.

Tidy's body gates purpose-based consolidation; its protocol verifies each disposition
and stops requiring all deferred branches to be copied into the owning thought. A
heading, old date or document-count target does not authorize deletion. Uncertain live
intent or recoverability still goes to the user. Retain a short rejection reason when
it continues to explain or protect the current choice.

## Scope and verification

Bundle the shared rule into its existing Shape/Nav consumers, bump both plugins and
regenerate platform projections. Run the marketplace validator and staged checks.
This changes future authoring/cleanup behavior; it does not itself delete a user's
existing retirement section, migrate records or prove compliance in a fresh agent run.
