# ADR-154 — Experience is input to engineering planning

Status: Accepted · 2026-11-17

Shape owns converging the intended experience. Nav owns how existing code will deliver it.
A settled choice, its operative reason and representative reference remain constraints during
implementation and acceptance; reuse of an existing component is not evidence of experience parity.

## Decision

Keep the existing skills and task owner. Elicit/mockup carry their accepted experience,
reasons, examples and consequential open choices into the original decision/task. Nav-plan
traces those inputs into module ownership, reusable paths, interfaces, compatibility and
observable checks. It investigates code facts itself. An unresolved user-owned choice names
the engineering decision it blocks and returns to shape; it does not expand planning into
another product or visual discovery pass. Existing decisions need no automatic author sign-off.

## Evidence and limits

An authorized diagnostic compared two fresh executions with identical curated source evidence
and the same model tier: ordinary engineering handoff versus explicit experience/evidence/open-choice
reconciliation. Across three cases both covered most outcomes; the small difference did not reach
the preregistered threshold. Both identified the same unresolved product choice, and both missed
an explicit redundant-entry removal check. This is not evidence for a mandatory extra step,
a new skill, or a claim that one model tier caused previous failures. Private source material
and trial outputs remain in the configured home workspace rather than this public repository.

The responsibility boundary implements the owner's decision. The experiment does not establish
that changed prose prevents future omissions. Plans, implementation review and runtime acceptance
are separate sources of evidence. Preserve accepted experience through all three.

## Alternatives

A new shape handoff skill would add another entrance without a distinct recurring responsibility.
Merging engineering planning into do would hide consequential interface/compatibility decisions
for substantial changes. Mandatory author approval would ask again about already-settled choices.
Keep proportional planning and targeted clarification instead.
