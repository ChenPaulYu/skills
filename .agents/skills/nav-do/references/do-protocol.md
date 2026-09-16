# Do protocol — scope and verification examples

The skill body owns the inject → execute → check workflow. Read this reference when deciding
whether a task is a small behavior change or when selecting useful verification.

## Scope

A decided small change has an observable outcome and a placement that can be grounded without a
separate implementation plan. File count alone does not decide scope: a mechanical update across
several files can remain small; a one-file feature with unresolved product choices may need a plan.

Use nav-refactor for behavior-preserving restructuring and nav-plan for substantial changes.
Resolve routine implementation choices from code. Ask when missing intent would change the
requested outcome, compatibility, or a material trade-off. Planning within an authorized build
does not revoke the authority to continue that build.

## Grounding and ownership

Before adding behavior, inspect the target's role and search its domain for existing owners.
Reuse implementations rather than creating a parallel path. Check package command-entry
contracts before changing CLI docs or wrappers; verify the installed command when users will
invoke that command outside the checkout.

A second consumer of a shared implementation should reference its owner. Repeated constants,
design values, and configuration have the same ownership concern across code and non-code
layers. Distinct design values need a meaningful distinction, not just a slightly different literal.

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
- A low-impact wording change: inspect the rendered result or diff; do not invent a test that
  just repeats the string.
- A newly enabled paid-LLM path: separate deterministic logic checks from live-service evidence,
  explain additional cost, and honor any existing approval for the same run scope.

Complete repository-required gates. Report missing evidence precisely. Passing tests on an
unrelated path is not verification of the changed behavior; absence of a suite is a reason to
find reproducible checks, not automatically to stop.

## Completion

Report changed behavior, relevant files, checks and results, and material limitations. Update
changed file roles and any board item actually advanced by this work. Do not retriage the board
or publish merely because the implementation is complete.
