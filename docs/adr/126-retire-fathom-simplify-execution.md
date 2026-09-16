# ADR 126 — Retire Fathom and simplify authorized execution

**Status**: accepted
**Date**: 2026-09-16
**Source**: owner requested a marketplace renovation, rejected Fathom's rigid teaching model,
accepted retiring it, and authorized implementing the discussed cleanup.
**Amends**: ADR-007/008 (continuation and dispatch), ADR-023 (small-change verification),
ADR-067/081/114 (authority and dispatch gates), ADR-109 (conditional loading), ADR-122
(length signals). Enforces ADR-123's session-owned judgment across runtime artifacts.
**Supersedes**: Fathom's active curriculum and roster from ADR-111/116; historical records remain.

## Problem

Fathom made free exploration a detour around a five-level curriculum. Even an unbounded dive
could not advance a level, required study bookkeeping, and restored the learner to a pending
gate. Artifact availability depended on recorded teaching progress rather than whether source
evidence could support the requested explanation. The owner wants questions to determine the
route and depth; more exceptions to the ladder would preserve the wrong center of gravity.

Execution skills had a related problem: an already-authorized build could stop at a fixed
next-action menu, a subjective confidence percentage, or an interaction-count approval boundary.
Refactor demanded full checks after every move and identical source text even though behavior
is the actual invariant. The recently adopted length-as-signal rule still had conflicting
length-triggered actions elsewhere. Codex also loaded full worker machinery in ordinary audits
and shipped a judgment reviewer role after that responsibility returned to the session.

## Decision

1. **Retire the entire Fathom plugin without a replacement skill.** Remove its five source
   skills, bundled runtime assets, generated projections, current registrations and routes.
   Preserve historical ADRs, findings, and the teaching lessons below. Managed installed copies
   are pruned by the existing synchronization mechanism; user studies are outside this deletion.
2. **Carry existing authorization through the task.** Plan-only remains plan-only; analysis is
   read-only. An authorized build gets a grounded plan when needed and then continues to
   completion without another generic menu. Ask only for consequential unresolved choices or
   missing authority for additional scope, cost, external effects, or destructive actions.
   Publication and speaking for the user remain explicit boundaries.
3. **Replace numeric confidence gates with evidence and consequence.** Inspect available
   evidence first, label unsupported claims, and ask when missing intent changes the outcome.
   Routine implementation choices do not need user arbitration.
4. **Refactor preserves observable behavior and public contracts.** Prefer verbatim moves where
   sufficient; permit necessary internal rewrites backed by behavioral evidence. Keep unrelated
   behavior changes separate. Run focused checks at coherent boundaries and repository-required
   final gates; do not weaken assertions to obtain a pass. Unrelated baseline failures are
   reported rather than automatically blocking independently verifiable work.
5. **Length is an inspection signal only.** No automatic split, action, or rollback follows
   crossing a line-count threshold. A structural change needs a useful knowledge boundary.
6. **Dispatch details load only when dispatching.** Skills keep a short conditional pointer;
   bundled references carry work packets, returns, and acceptance checks. Remove the separate
   judgment reviewer role; the session reads actual changes and verifies execution evidence.
7. **Keep the tentative candidates.** Frame and shape-migrate stay. Frame's retired Fathom route
   is removed; its reasoning methods and interaction rituals are not redesigned in this change.

## Retirement test and retained lessons

This is an owner-attested **mis-fit**, not a zero-usage deletion: repository understanding is
still wanted, but the curriculum and mandatory state did not serve the preferred workflow.
The three-causes check from ADR-107 does not justify denying the need or automatically creating
another skill to claim it. Try ordinary evidence-grounded conversations before designing a successor.

| Keep as method evidence | Retire as mandatory workflow |
|---|---|
| Check actual source before explaining repository behavior | Five fixed levels and exit gates |
| Distinguish recorded reasons, inference, and unknowns | A trust/index ceremony before every learning task |
| Connect unfamiliar mechanisms to what the learner already knows | Mandatory calibration and learner-state files |
| Repair the exposed misunderstanding rather than replaying everything | Compulsory narration and restoration to the curriculum |
| Use a picture when it makes a relationship understandable | Artifact availability governed by course progress |

## Compatibility and recovery

Source stays under `plugins/`; Codex and Cursor outputs remain generated. Plugin versions and
adapter release metadata change with their content. Existing install profiles remain usable;
the legacy `all-without-fathom` name may remain an alias now that `all` also excludes Fathom.
User-modified runtime files are preserved by installed-copy reconciliation. Deleted tracked
content remains recoverable from git history; historical references are not rewritten as if
the old design never existed.

## Verification

Validate generated consistency, capability coverage, conditional reference presence, negative
fixtures, and isolated installation/reconciliation. Check the written protocols against concrete
scenarios: plan-only stops; authorized build continues; a cohesive long file is not split by
count; a refactor preserves behavior; an ordinary read-only audit loads no dispatch payload.
These checks establish instruction consistency and packaging, not measured live-model behavior.
