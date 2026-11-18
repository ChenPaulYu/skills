# ADR-011 — Elicit scope

Status: accepted · 2026-11-18

## Decision

`shape:elicit` gives grounded help with an undecided conceptual choice or a specific
root cause; diagnosis is part of it. Its survey leg maps a decision space as a diff
against the user's stated understanding. It notices stalls and agrees when the
evidence supports the user, without manufactured disagreement.

## Evidence and alternatives

- A separate diagnose skill was rejected: it would be a parallel copy of elicit's
  convergence engine.
- A separate survey skill and a parallel stall-watcher were rejected; both are legs
  of elicit.
- A compulsory friction or agreement counter was rejected as performative.
