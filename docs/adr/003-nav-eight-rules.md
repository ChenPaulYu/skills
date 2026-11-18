# ADR-003 — Nav's eight rules and thresholds

Status: accepted · 2026-11-18

## Decision

Nav audits and preserves code shape with eight rules (owned by `plugins/nav/CLAUDE.md`)
plus the N+1 trigger: the second consumer of an inline utility extracts a primitive.
Information hiding, including information leakage and temporal decomposition, sits
inside rule 1 rather than as a separate rule. Value leakage is detected at audit and
prevented per change. Every length threshold ships with its falsifier: does this
section have a name that lets its caller stop knowing what is inside? Length is a
signal, not a verdict.

## Evidence and alternatives

- Eleven rules, and a ninth rule for information hiding, were rejected as
  overlapping; consolidation kept every check while shrinking the restated surface.
- Raising the function threshold from 100 to 150 lines, or dropping function length,
  was rejected; the falsifier handles legitimate long functions.
- Splitting on a number alone was rejected for the same reason.
- Pushing aggregate leakage analysis into every implementation step was rejected as
  audit work paid per change.
