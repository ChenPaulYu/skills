# Do protocol — scope and verification examples

The skill body owns the inject → execute → check workflow. Read this reference
for grounding multi-step work or selecting verification.

## Scope

A decided outcome can be implemented once its acceptance is observable and the
request authorizes execution. Trace each promised path against current behavior
before dividing the work. Surface assumptions that would change an outcome,
including alternate entry points, older persisted data, and what happens after an
error or reopening. A mockup may show seeded or authored output; identify where
the application will get the real result and how to verify it. For generated answers,
check what source evidence reaches the model and whether the resulting answer
uses it. Wiring tests and answer-quality checks establish different facts.

Derive execution order and test mechanisms from the code. When ownership or
compatibility has a costly consequence, investigate the affected callers and
persisted state before writing. Keep the implementation reasoning proportional
to the decision. If a user-owned choice blocks an item, name the consequence
and continue any independent authorized item.

## Grounding and ownership

Before adding behavior, inspect the target's role and search its domain for existing owners.
Reuse implementations rather than creating a parallel path. Check package command-entry
contracts before changing CLI docs or wrappers; verify the installed command when users will
invoke that command outside the checkout.

A second consumer of a shared implementation should reference its owner. Repeated constants,
design values, and configuration have the same ownership concern across code and non-code
layers. Distinct design values need a meaningful distinction, not just a slightly different literal.

Trace a shared callback, prompt or configuration to its other callers; a new action must not
change the policy of an existing one accidentally. Inspect interface growth: forwarding props or
introducing flags without owning the hidden decision may add a layer rather than deepen a module.

Keep structural preparation and changed behavior reviewable. Prefer verbatim moves where they
fit, but preserve behavior rather than requiring identical source text. Unrelated restructuring
and discovered bugs remain separate findings unless they are already in scope.

## Verification examples

- A pure helper change: targeted tests for the changed cases and existing callers.
- An installed CLI change: install into temporary tool/bin directories and invoke the bare
  command, checking output and exit status.
- A UI interaction change: automated interaction coverage or a focused browser pass through
  the affected states; a screenshot alone cannot prove a drag or keyboard action works.
- A shared API change: integration/consumer checks alongside unit tests.
- A new action on an existing runner: drive the real action-to-result path with fake external
  boundaries where needed, and check an existing action that shares its handler or policy.
  Passing the new component in isolation does not prove the request is delivered or saved.
- A low-impact wording change: inspect the rendered result or diff; do not invent a test that
  just repeats the string.
- A newly enabled paid-LLM path: separate deterministic logic checks from live-service evidence,
  explain additional cost, and honor any existing approval for the same run scope.

Complete repository-required gates. Report missing evidence precisely. Passing tests on an
unrelated path is not verification of the changed behavior; absence of a suite is a reason to
find reproducible checks, not automatically to stop.

Record actual commands/workflows, inputs or interface states, observations and unverified limits
separately from intended checks. A fake service can prove delivery wiring without proving live
provider output quality. Treat diff-based ownership/reuse/interface inspection as structural
evidence; passing a typecheck is not a substitute for that inspection.

## Completion

Report changed behavior, relevant files, checks and results, and material limitations. Update
changed file roles and any board item actually advanced by this work. Do not retriage the board
or publish merely because the implementation is complete.
