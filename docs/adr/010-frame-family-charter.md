# ADR-010 — Frame family charter and presentation

Status: accepted · 2026-11-18

## Decision

`frame` is the understanding family: reasoning lenses (`first-principles`,
`orthogonal`), explanation forms (`analogize`, `draw`), a guided walkthrough
(`unfold`) and `tinker`. It is independent of nav and shape and feeds shape only when
the user asks or continuation is already authorized. A new member needs recurring-use
evidence and must force a check the default omits. Frame answers in chat without
artifact files, except where a form needs one. Presentation scales to the question:
technical terms are allowed, analogies are optional outside `analogize`, and there is
no compulsory closing metaphor or banned-word list. `unfold` goes skeleton first, one
layer per turn, with no fixed level count or state file.

## Evidence and alternatives

- A standalone ELI5 skill was rejected; `analogize` is that door.
- Fixed levels or gates for walkthroughs were rejected as ceremony.
- Speculative lenses (`invert`, `second-order`) were dropped for lack of use.
- A lens that only says "think harder" was rejected: it forces no check.
- Sibling-skill calls inside `unfold` were rejected; see ADR-006.
