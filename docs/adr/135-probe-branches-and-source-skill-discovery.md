# ADR-135 — Align probe branches and discover skills from their source file

> 2026-09-30 · Status: accepted · Extends ADR-134; active entrances and disk contracts unchanged.

## Context

The owner authorized the next corrections after ADR-134. Probe's body allowed existing
measurements, while its reference required preregistration without a branch distinction
and omitted reuse of paid-scope authorization. The staged hook also caught platform
generation changing with a retired empty directory: namespace membership accepted any
directory, while skill emission required SKILL.md. Fixing one historical reference did
not remove that discrepancy from the generators.

## Decision

Probe reads the same branch-specific protocol for existing-data assessment and new
experiment design. Existing measurements retain their original method/criteria and
limits; absent preregistration is reported rather than fabricated. New trials still fix
their verdict rule before collection. Paid execution states its scale and honors matching
approval and tier choice; increased cost/effects require missing authority, not a repeated
confirmation of an already approved run.

`scripts/lib/catalog.mjs` exports the existing skill-directory predicate. Catalog
registration and both platform builders use it: a direct skill directory with a file
named SKILL.md participates; empty/resource-only directories and directory-valued
SKILL.md entries do not. Namespace conversion and emission share that membership.
The predicate does not create a second manifest or registry. Active source behavior and
catalog ordering are preserved; conversion no longer depends on local retired residue.

The bounded artifact retry still ignored only its new subdirectory after reading the
shared policy. Sharpen that owner's completion gate: resolve coverage at the existing
process-artifact root, inventory existing records and explicit retained exceptions,
then verify every excluded record or report the remaining exception. Index cleanup
authority and preservation requirements are unchanged. No additional paid retry follows
this second correction in the current batch.

## Verification and limits

Unit and real-generator tests check residue invariance, correct active-name conversion,
and visibility of a real newly added skill. Owner-authorized post-repair trials cover
existing-measurement routing, whole-tree artifact retention, and two-turn dogfood over
the current synthetic fixtures. Model execution remains opt-in and bounded; no automatic
evaluation job or new skill is introduced. Outcomes and acceptance limits are recorded
in `docs/findings/2026-09-30-probe-and-roster-followup.md`.
