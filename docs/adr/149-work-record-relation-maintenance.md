# ADR 149 — Maintain relations during ordinary record work

**Status**: accepted
**Date**: 2026-11-14

## Decision

Deepen the existing shared record interface rather than adding a relation skill,
folder, mandatory pipeline or second graph store. Before creating a record, search
existing project work and reuse the same thread. During substantive updates, inspect
outgoing links and backlinks for affected decisions and evidence. Record meaningful,
directional relations supported by the work; explain a non-obvious connection in
prose and derive reverse lookup instead of storing a mirror edge.

When closing a task, inspect its relevant linked plans, mockups and probes in both
directions. Report each affected item's disposition and reason using its own criteria.
Update only evidence-supported statuses within the authorized scope. Retain uncertain
items and ask the user; closure does not authorize deletion or complete every neighbor.

## Ownership and limits

The shared record-interface reference owns relation authoring; workspace-records owns
closure and lifecycle. Both are bundled into their existing Shape and Nav consumers
in this change. IDs and frontmatter links remain canonical; Relations tables, backlinks
and graphs remain derived. Independent ideas may have no links, and no six-document
chain or automatic enrollment is required.

Existing reader diagnostics catch structural problems such as dangling targets, not
semantic completeness. These instructions improve the writing workflow; they add no
automatic semantic validator or guarantee that every meaningful relation is present.
Verification covers resource propagation and platform compatibility. Real usage must
still establish whether agents consistently choose useful relations.
