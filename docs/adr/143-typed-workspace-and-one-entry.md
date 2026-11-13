# ADR-143: Typed work folders and one project entry

Status: Accepted for the workspace pilot
Date: 2026-11-13

## Decision

Use `project.md` as the sole project entry/index, with purpose, constraints,
repository mappings, user-chosen priorities and navigation to existing work folders.
Current state derives from original task records and actual repository evidence;
do not maintain another index.md or state.md for the same job.

Store work directly in ideas/, thoughts/, tasks/, plans/, mockups/ and probes/.
Simple records are Markdown files; mockup and probe topic folders contain their
canonical mockup.md or probe.md alongside HTML/results/supporting files. Create
folders only when needed. Keep stable IDs and canonical frontmatter edges from
ADR-142. A filename or directory is a locator, not record identity.

This replaces the pilot's flat records/ plus artifacts/ proposal. A representative
artifact can remain at its original location and be linked; no promotion stage or
move is needed. Tidy still retires eligible material with reasons, links and recovery
accounted for. Git carries committed history without a parallel changelog.

## Compatibility and verification

Keep legacy flat records/*.md readable during transition. Discover only the canonical
mockup/probe cards, not supporting Markdown, HTML or measurements. A mixed layout
with duplicate IDs or a folder/type mismatch must report the issue and preserve
readable content. Do not silently rewrite it.

Relocate the small existing pilot without changing IDs, statuses, dates or edges;
repair relative links and expose typed navigation in project.md. This is not a
mass migration or release of another product. Existing index files outside these
pilot projects are not automatically disposable.
