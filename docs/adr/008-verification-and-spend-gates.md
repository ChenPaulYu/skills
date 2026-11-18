# ADR-008 — Verification and spend gates

Status: accepted · 2026-11-18

## Decision

Browser verification is a pluggable capability slot whose default executor is the
sonnet `shape:browser-verifier` agent. It is opt-in for mockups and expected wherever
behavior is claimed. The verify gate scales with cost: cheap machine-graded checks
run without asking; an expensive batch is raised once as a single question. Declined
verification is reported as shipped unverified at the user's call. For live-LLM paths,
name the added cost and scope; never silently switch to a mock.

## Evidence and alternatives

- Unconditional verification and per-step approval were rejected: one created cost,
  the other created prompts without changing outcomes.
- Auto-switching to a mock path was rejected: it hides that the real path was never
  exercised.
- Dispatching the verifier for every routine mockup render was rejected.
