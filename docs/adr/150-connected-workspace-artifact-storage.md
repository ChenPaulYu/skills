# ADR 150 — Connected workspaces retain records and their artifacts together

**Status**: accepted
**Date**: 2026-11-16

## Context

A connected home was already the intended working store, but mockup storage still
foregrounded code-local blueprints and the shared retention fallback still foregrounded
local ignored files. An agent saved an approved mockup's notes in the home while placing
the complete HTML elsewhere. A summary, locator or hash did not preserve the requested
artifact in the user's selected store. This was both an execution error and conflicting
instructions, not a reason to add another save skill.

## Decision

Resolve the existing home and project mapping before every project-record or artifact
write. A connected workspace owns both records and the retained mockups, probe results
and supporting artifacts needed to reopen the work. Product code and runtime fixtures
remain in the code repository. Without a mapping, tolerate the established legacy
convention; ordinary saves do not enroll or migrate projects. An unavailable configured
home is reported rather than silently replaced by another store.

Saving includes actual artifact bytes and required dependencies. Verify a reopen or
restoration from the saved destination. Respect the selected home's storage policy;
report an unresolved asset-policy conflict rather than silently splitting storage.
A scoped user retention choice does not authorize arbitrary media import. Disposable
status/graph exports remain derived previews outside the home, not saved work artifacts.

Workspace-records owns location and routing. Development-artifacts owns retention and
restoration. Shape/Nav bodies load these owners before writing; stale mockup, probe and
dogfood storage directions are replaced in the same change. No new skill, parser,
mandatory document chain or automatic legacy migration is introduced.

## Verification and limits

Regenerate all bundled references and native/Codex projections, then run the marketplace
validator. Exercise the existing home/project reader and verify restoration of a retained
self-contained HTML from its committed bytes. This checks propagation and the concrete
save path; it does not prove every future agent will follow the prose on every host.
