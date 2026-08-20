# ADR-122 — A length threshold is a signal to look, never a verdict to cut

**Status**: accepted
**Date**: 2026-08-20
**Relates**: [ADR-043](docs/adr/043-audit-deep-mode-domain-fanout.md) (audit's check tables), [ADR-008](docs/adr/008-inject-check-at-handoff.md) (the dispatch bracket that let a bad cut ship)

## Context

`/nav:audit` publishes numeric thresholds — file > 500 LOC "giant" / > 700 "severe", function > 100 LOC "suspect", imports > 20 "wide surface". They exist to make the audit mechanical, and they work: the numbers point a reader at places worth examining.

But a threshold that produces a list reads as a to-do list. Field evidence, 2026-08-20 (tactus, one session):

An audit reported "17 functions > 100 LOC". The agent worked the list top-down. The **first** cut was right: `register_recipe_shortcuts` at 226 lines held four whole CLI commands (`program`/`place`/`groove`/`chop`), each with its own flag surface and its own name; hoisting each to a module-level factory took the registrar to 11 lines and left four independently readable faces.

The **second** cut, dispatched to a subagent on the strength of the same number, was wrong in five measurable ways:

- The two files **grew 284 lines** in total, and `assets.py` went 622 → 771 — crossing out of "giant" into "severe giant". A worse violation of the same rule set than the one being fixed.
- All **ten extracted helpers had exactly one caller**. A helper with one caller that needs six parameters hides nothing; it relocates code and adds a parameter-passing ceremony. Ousterhout's shallow module, manufactured on purpose.
- The helper names were `preflight` / `resolve` / `land` / `execute` — **decomposition by execution order**, which the same audit's own check table lists as a rule ① smell (temporal decomposition).
- **The metric never moved.** 16 → 16: both functions still cleared 100 measured from `def` to end, because 21 of `stock`'s lines are its frozen `click` signature and 24 are its docstring.
- Cost: ~140k subagent tokens and a full review cycle, reverted the same day.

The root cause is not the subagent's. The thresholds were stated without their falsifier, so a list of numbers read as a queue of work.

## Decision

**Every length threshold ships with the question that overrides it: does this section have a name that lets its caller stop knowing what is inside?**

1. **`/nav:audit` states the falsifier where it states the thresholds** — the Universal thresholds block and the Frequently-misjudged list both carry it. Length reported in a finding is *evidence to examine*, never a prescription to cut.
2. **`/nav:refactor` gates on the question, not the number.** Before proposing or accepting a split: name the thing being extracted; if the name is a phase of execution (`preflight`, `setup`, `apply`, `finish`), that is temporal decomposition and the split is refused. If the length comes from **surface width** (a wide CLI/prop/flag contract) or from **step count**, the code is healthy and stays.
3. **The one-caller screen.** An extraction whose product has exactly one call site and a wide parameter list is a shallow module. Allowed only when the extracted thing is conceptually independent (it could move to its own file tomorrow and still make sense) — which is exactly what separated the good cut from the bad one above.
4. **Measure the whole rule set after a cut, not the one number being optimised.** If a function split pushes its file across a file threshold, the refactor made the codebase worse; revert it.

## Why not the alternatives

- **Raise the function threshold (100 → 150).** Rejected: the number was never the problem. A 120-line function can be four things in a trench coat and a 250-line one can be a single wide-surfaced CLI face. Moving the line just relocates the same mistake.
- **Drop function-length from the audit.** Rejected: it earned its place — it is what surfaced the 226-line registrar that genuinely needed cutting. The signal is good; only its framing as a verdict was wrong.
- **Leave it to the operator's judgment, undocumented.** Rejected: that is the status quo that failed. The operator here *had* the judgment and still worked the list mechanically, because a numbered list of violations is an instruction shape. The falsifier has to sit next to the number.

## Consequences

- Audit output stays identical in what it measures; findings framed as "worth examining" rather than "fix these".
- Refactor gains an explicit refusal path — declining a split is now a documented, correct outcome, not a skipped task.
- Projects can record the verdict per site. The tactus board now carries both worked examples — the registrar split that was worth it and the phase split that was not, with the evidence that killed it — so the same 208-line function is not re-proposed next quarter.
