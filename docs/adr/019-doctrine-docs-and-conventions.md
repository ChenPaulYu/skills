# ADR-019 — Doctrine documents and conventions

Status: accepted · 2026-11-18

## Decision

An ADR exists to stop a rejected alternative from being re-proposed. Write or update
one only when alternatives were weighed and a later session would plausibly propose
the rejected one again; other changes explain themselves in the commit message. One
ADR owns one topic and is edited in place; Git keeps the history.
`docs/out-of-scope/` holds rejected proposals with no standing decision, and
`docs/findings/` holds build-side mechanisms. Usage patterns go straight to the skill
or guide they correct, or become a workspace idea when the owner is unclear.
Development artifacts (blueprints, mockups, captures, experiment scripts) stay local
or Git-ignored unless their role justifies tracking them.

Only manifests and generated artifacts are enforced contracts. Blueprints, boards,
handoffs, headers and document layout are conventions: a verb that reads one handles
the standard shape, an ad-hoc shape and absence, and reports which it read.

## Evidence and alternatives

- Append-only ADRs (one new number per revision) were replaced on 2026-11-18. By then
  155 ADRs tracked commits rather than decisions, most had no reference from any
  skill or guide, and reading one current rule could mean following a chain of
  three. The 155 were consolidated into these topic ADRs; the originals are in Git.
- Deleting `docs/adr/` outright was rejected because some proposals do recur (for
  example, a reviewer sub-agent; see ADR-007). Review on 2027-02-18: if no ADR has
  blocked a repeat proposal, move reasons beside their rules and freeze `docs/adr/`.
- The observations inbox was removed: it stopped receiving notes and most stayed
  unprocessed. Six live patterns became workspace ideas.
- Bulk untracking of artifacts was rejected; retention is decided per role.
- Linting conventions as contracts was rejected; it broke on legitimate variants.
