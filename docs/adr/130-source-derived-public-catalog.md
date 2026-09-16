# ADR-130: Generate the public catalog from source

Status: Accepted
Date: 2026-09-16

## Decision

Generate the marked catalog blocks in README.md and docs/site/index.html from
plugin manifests and skill frontmatter. Keep explanatory prose and layout hints
in docs/catalog-copy.json. That file owns presentation, never membership.

## Context

Versions, skill counts, and rosters were copied across public surfaces. The old
validator searched for invocation tokens anywhere in the files, including
historical notes, and scanned specific JavaScript formatting for versions.
Neither test proved that the visible catalog matched the source.

## Implementation

scripts/lib/catalog.mjs discovers active plugin manifests and skill directories,
reads invocation categories, and renders the README tables and bilingual site
data. Editorial entries order and describe existing members; stale entries do
not resurrect retired members. Missing copy falls back to source descriptions.
The site stays self-contained, with generated data embedded in its HTML.

scripts/build-manifests.mjs owns the build entry. Installation sync runs it before
platform generators. The existing validator rebuilds surfaces in a temporary
tree and compares them exactly. Missing, duplicate, or reversed block markers
fail closed; text outside the blocks remains untouched.

## Boundaries

Generated membership does not verify explanatory truth. The quick lookup,
anatomy diagrams, editorial descriptions, and dated audit history still need
human review when semantics change. No new release workflow or skill behavior
is introduced. Catalog generation does not register plugins in marketplace
installation manifests; that existing ownership remains unchanged.

## Verification

Isolated tests cover roster changes, versions, invocation categories, missing
and stale copy, escaping, marker failures, preservation, and determinism.
Integration checks include stale-surface rejection and a bilingual browser smoke
test of the current catalog. No network request is needed to render the catalog.
