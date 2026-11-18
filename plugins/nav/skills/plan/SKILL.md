---
name: plan
description: "Ground an engineering approach in the actual code when asked for an implementation plan or to compare engineering options before committing to an approach. Use shape-task to define deliverables and acceptance, and nav-do to implement authorized decided work."
---

# Plan — reason through a requested engineering approach

Use this entry when the user asks to see or decide an engineering approach.
Start from the agreed experience and any existing task. Trace what the code
already supports, the missing paths, and the choices that change ownership,
compatibility, rollout or verification. A substantial authorized build can go
directly through nav-do, including engineering reasoning within execution.

## Workflow

1. **Ground the affected domains at the depth the engineering decision needs.** Reuse a recent matching audit from the conversation, then
   inspect anything that changed. Trace entry points, implementations, consumers, and tests.
   For each affected responsibility, connect intended behavior to current evidence and the
   necessary change; cite files. Include dependencies that the outcome relies on.
2. **Resolve consequential uncertainty.** Surface assumptions that could change the outcome,
   not just questions obvious in the spec. Resolve factual gaps from evidence and product
   choices from prior decisions. If intent is still missing or contradictory, identify the
   engineering decision it blocks and ask that focused question (shape-elicit / shape-mockup
   can help). Existing decisions do not require an author sign-off before implementation;
   nav-plan does not reopen product or visual convergence.
   Keep consequential resolved choices and their reasons visible. Label unresolved assumptions
   with their consequences and blocked work instead of treating them as settled. Routine
   implementation choices remain yours; continue independent authorized work. Question counts
   and document length are not measures of adequate clarification.
3. **Show the engineering approach.** Give it in chat by default. If the user
   asks to persist it, follow the project's established engineering document
   convention or the requested existing destination. Before writing project
   records or artifacts, read `references/workspace-records.md`,
   `references/record-interface.md` and `references/development-artifacts.md`.
   Keep the owning task's deliverables and evidence in place. Preserve legacy
   engineering sections when revisiting existing work. Name the relevant
   ownership, reusable paths, critical interfaces and observable checks.
   Read `references/plan-protocol.md` for grounding and verification examples.
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
  explain the decision it hides and which consumers adopt it. When the user asks to compare
  interface designs, draft three different ones first (fewest entry points, most flexible,
  best for the common caller), compare depth, where change concentrates and seam placement,
  then recommend one; see `references/plan-protocol.md`. Trace changes to shared callbacks,
  prompts or configuration across their callers so one new action does not silently alter others.
- For AI-generated content, separate the selected target from the evidence needed to answer it.
  Name how sufficient context is acquired, its bounds and missing-context behavior. Include a
  content-level acceptance case whose answer depends on that evidence, beyond valid formatting
  or delivery. Context/tool availability alone does not prove it was supplied or used; see
  `references/plan-protocol.md` for coverage and evaluation examples.
- Compare implementation with the accepted reference at the interaction and content level.
  If an unresolved visual choice blocks engineering, return that choice to shape; a mockup
  can settle appearance, while real-engine behavior still needs runtime evidence.
- Completion must be checkable. Translate a scored or open-ended target ("90 points", "do all
  of it") into observable criteria, and mark steps that need the user's hands or judgment as
  user-owned. Keep material product outcomes open when their evidence is missing; report
  engineering readiness separately from outcome acceptance. The build is done when the criteria
  pass and only user-owned steps remain.
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

Report the grounded approach, the affected task when one exists, and unresolved decisions.
If part of an authorized build, complete implementation and verification before the final handoff. Preserve the user's
limits on commits, publication, and external actions.
