# Refactor protocol — boundaries and evidence

Read when deciding how a structural change preserves behavior. The skill body owns authority,
verification cadence, and completion; this reference supplies examples and failure checks.

## Find a useful boundary

State which design decision the new module hides and which callers can stop knowing its details.
A helper with one caller can still own a coherent concept. A helper named only for an execution
phase, with many parameters and no hidden decision, often just moves complexity. Judge the whole,
not whether a file crossed a line-count threshold.

For extraction, identify the source, destination, incoming dependencies, return values, and
callers to rewire. For consolidation, name the surviving owner and every adopting consumer.
Check the old implementation no longer has callers before removing it. An abstraction with no
adopters is unfinished work.

## Preserve the actual contract

Capture the externally consumed surface and behavior from the working baseline, including
pre-existing uncommitted changes. Useful evidence includes public import tests, API snapshots,
consumer tests, command output/exit codes, serialization round trips, and side-effect ordering.
A signature grep alone cannot prove return-value, error, or async behavior is unchanged.

- **Extract an internal helper:** retain caller assertions; check the same inputs, outputs, and
  exceptional paths. Update imports and private test wiring as needed.
- **Move a public module:** retain its import path through a compatibility facade when it belongs
  to the preserved contract; verify downstream imports as well as local tests.
- **Consolidate implementations:** compare supported cases before selecting an owner. Observable
  differences require preserving both behaviors or resolving a scope change, not silently
  choosing one.
- **Extract a UI hook:** check initialization, cleanup, effect timing, and dependent interactions.
  Render-only tests do not demonstrate gesture behavior.

Prefer verbatim moves when sufficient; use internal rewrites when needed for the structural
goal and backed by behavioral evidence. Tests encoding private layout may change setup or
imports, but must retain behavioral assertions. Never change expectations just to pass.

## Choose verification by risk

Establish a relevant baseline, make a coherent change, and run the narrowest checks capable of
exposing the likely regression. Expand coverage when a shared boundary changes or a failure
shows the original selection was insufficient. Run all repository-required final checks.
After checks pass, repeat only for new changes or unresolved concerns.

An unrelated existing lint failure can be reported while focused behavior checks proceed.
An unexplained failure on the changed path prevents claiming equivalence. Without a suite, use
reproducible input/output or runtime checks. If no adequate evidence is available, state the
limitation and resolve the blocked scope before continuing dependent changes.

Keep known bugs as separate findings unless fixing them was already authorized as a distinct
part of the task. Preserve the structural diff's reviewability even within a larger build.
