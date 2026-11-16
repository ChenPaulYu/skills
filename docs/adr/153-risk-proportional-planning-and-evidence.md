# ADR 153 — Scale planning detail while preserving design and verification

**Status**: accepted
**Date**: 2026-11-16

## Context

ADR-152 made implementation planning an optional section of its owning task. The planning
skill still led directly to an engineering template, while "small" versus "substantial"
left the depth decision implicit. The owner asked for a readable task, code-readable
implementation choices and meaningful verification without a detailed plan for every change.
A small paired diagnostic did not establish an advantage from prescribing engineering steps;
it also exposed omitted integration evidence and an unintended shared-handler behavior change.
This is limited evidence, not a general claim that large features need no planning.

## Decision

nav-plan owns an explicit depth gate after grounding: direct execution for a decided bounded
change, a short task for known work needing tracking/resumption, and engineering detail for
material ownership, interface, compatibility, migration or coupled-change decisions. File count
and document length are not scope thresholds. An explicit planning-only request still stops
before execution, even when the requested plan can be brief.

Task retains the shared metadata/summary/Relations interface from ADR-149/152. Engineering
detail explains responsibility, hidden decisions, reuse, simple interfaces and consumer adoption;
it is not merely a list of files to edit. Check shared callbacks and policies against other
callers. There is no new record type, formatter, skill entrance or mandatory section set.

Planning defines observations for changed behavior, affected existing behavior and structural
readability. Execution collects actual commands/workflows, inputs/states, results and limits;
build/typecheck alone does not prove behavior. Integration and interface checks follow the risk,
not a fixed test count. Fake boundaries and post-hoc regressions retain their explicit limits.

Both plan continuation and do's work-item sync advance through authorized ready items after
verification. Record blockers and continue independent items in scope; stop when complete or
no authorized ready item remains. Depth changes do not create a parallel record or new approval
ritual. Existing authority and publication boundaries remain unchanged.

## Consequences and verification

Update Nav's plan/do bodies, their protocol references and public catalog copy together; retain
the shared record format and legacy reading support. Regenerate platform artifacts and run the
marketplace validator. Check the task template against direct, known-multi-item and design-risk
cases, including an explicit plan-only request. Structural validation proves packaging consistency;
no new fresh-agent behavioral trial is implied by this prose update.
