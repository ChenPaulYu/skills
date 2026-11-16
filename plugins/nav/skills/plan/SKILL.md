---
name: plan
description: "Plan a code change at the depth its coordination and design risks require, grounding ownership, reuse and verification in the codebase. Small, already-decided changes can go directly through nav-do; a planning-only request never authorizes implementation."
---

# Plan

Turn intent into executable work inside the owning task. Choose how much planning the
change needs; preserve code readability through ownership, reuse and explicit interfaces,
and define how the behavior will be verified.

Before creating or updating project records or working artifacts, read
`references/workspace-records.md` to resolve the connected home and storage first. Read
`references/record-interface.md` and apply its pre-write ownership check; it also
defines metadata, dates, opening conclusions and Relations. This does not change the format of product docs or force legacy-board migration.

## Choose planning depth

Read the relevant code and prior decisions before choosing; use decision risk and coordination
needs, not file count or a fixed document length:

- **Direct change:** the outcome and existing owner are clear, the current path can be reused,
  and verification is bounded. Use nav-do discipline; a one-off fix needs no new record solely
  for ceremony. If the user explicitly requested a plan, provide the short requested approach
  and stop before implementation unless it is already authorized.
- **Short task:** known work needs progress tracking or resumption, but no material
  design choice remains. Keep goal, boundaries, completion criteria, dependency-ordered work
  items, verification and next action together; no speculative engineering section is required.
- **Engineering plan:** meaningful choices about ownership/interfaces, persisted data or
  compatibility, migration/rollback, or coupled changes need explicit reasoning. Add the grounded
  implementation approach and checks to the same task. Multiple files alone do not trigger it.

State the chosen depth and reason briefly; routine sizing needs no user confirmation. Increase
depth when investigation exposes a consequential decision, preserving current progress and
already-granted execution authority. Do not create an extra plan record to change depth.

## Workflow

1. **Ground the affected domains at the chosen depth.** Reuse a recent matching audit from the conversation, then
   inspect anything that changed. Trace entry points, implementations, consumers, and tests.
   Identify the gap between current behavior and the requested outcome; cite files.
2. **Resolve consequential uncertainty.** Read code and prior decisions before asking. Ask only
   when a missing answer would change scope, externally visible behavior, compatibility, or a
   material trade-off. Routine implementation choices are yours to make and explain. Record
   deferred questions with the step they block; continue independent work.
3. **Write in the owning task when a record is needed.** If the request or repository policy forbids file changes,
   present the plan in chat. In a connected workspace, find the existing work item,
   or create `tasks/<topic>.md` under the task-creation rules in
   `references/workspace-records.md`. Keep the grounded approach alongside completion
   criteria, progress and next action; add an Implementation plan section only at
   engineering depth. Reuse live
   legacy plans in place; do not silently migrate them or create a parallel task.
   Without a connected workspace, follow the project's existing planning convention:
   prefer `blueprints/plans/`, an established plans directory, or `docs/plans/`.
   Before writing, read `references/development-artifacts.md` for project retention policy
   and Git checks. State the owning path; a conventional location needs no separate confirmation.
   Write only the detail justified by the chosen depth, preserving existing progress. When
   engineering planning is needed, name the module responsibilities, reused paths, critical
   interfaces and files; do not substitute a file-edit checklist for design reasoning. Read
   `references/plan-protocol.md` for the grounding checklist and proportional task shape.
4. **Continue according to the user's scope.** A plan-only or do-not-implement request ends with
   the plan and unresolved decisions. When implementation is already authorized, show the plan's
   approach and continue the approved work using execution discipline. Ask only for a new
   consequential choice or authority. After verifying an item, continue the next authorized
   ready item; record blockers and advance independent items within the same scope. Stop when
   complete or no authorized ready item remains, not at an arbitrary step boundary.

## Constraints

- Preserve named public contracts and map each new shared owner to the callers that will adopt
  it; naming a helper without rewiring its consumers leaves dead architecture.
- Keep implementation detail behind its existing owner and a simple interface. For a new owner,
  explain the decision it hides and which consumers adopt it. Trace changes to shared callbacks,
  prompts or configuration across their callers so one new action does not silently alter others.
- Use a visual comparison when an unresolved visual choice needs one and the capability is
  available. A mockup can settle appearance; real-engine behavior still needs runtime evidence.
- Completion must be checkable. Translate a scored or open-ended target ("90 points", "do all
  of it") into observable criteria, and mark steps that need the user's hands or judgment as
  user-owned. The build is done when the criteria pass and only user-owned steps remain.
- Plan checks for the new behavior, affected existing behavior, and structural readability
  (ownership, reuse, interface size and duplicate logic). Name the observation that would expose
  each material failure and the command or workflow that will collect it. Exercise the affected
  entry-to-result path when a component check cannot prove the outcome; build/typecheck alone
  does not prove behavior. Keep repository-required gates and distinguish proposed checks from
  executed evidence, results and unverified limits. Honor existing authority; surface additional
  paid calls or external effects before undertaking them.
- Planning and acceptance stay with the session model. If a bounded implementation step is
  delegated to a sub-agent, read `references/worker-dispatch.md` at dispatch time. Delegation is
  an execution choice, not the default answer to every plan.

## Completion

Report the chosen depth, owning work item when needed, approach, and unresolved decisions.
If part of an authorized build, complete implementation and verification before the final handoff. Preserve the user's
limits on commits, publication, and external actions.
