# Code Guiding — enter implementation through a behavior seam

> **Validation status: unvalidated.** This level has not yet been executed in a completed study
> (both lab cases stopped at Behavior). Run it attentively: if it feels too heavy or too
> line-bound, that observation is method evidence — put it in the closing friction note rather
> than silently improvising.

## Never assign files as reading units

Select **one behavior** (the current group's control path first) and trace it end to end:

```text
entry -> argument sources -> local state -> calls -> mutations -> branches
      -> side effects -> error propagation -> return consumers -> tests
```

## Disclosure order inside the trace

1. **Plain-language implementation trace first** — what the code does at each hop, no syntax.
2. **Reveal symbols and critical blocks** only where they confirm, refine, or refute the behavior
   hypothesis the learner already holds from level 4.
3. **Line-by-line only when the mechanism demands it** — concurrency, state management, lifecycle
   control, serialization, recovery, or a core algorithm. Everything else stays folded.

Evidence exists to confirm, refine, or refute the model — not to reward reading more code.

## Close every trace with transfer

1. The learner predicts where a small behavior change should land and which tests should react.
2. Run a small, reversible experiment (change it, observe, revert — or run the relevant test with
   a probe) and update the mental model from the result.
3. Return to level 4: compare the group's variants against this traced baseline, correct the
   system model, then advance to the next behavior group.
