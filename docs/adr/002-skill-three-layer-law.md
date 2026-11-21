# ADR-002 — Skill three-layer law and description budget

Status: accepted · 2026-11-18

## Decision

Every skill fact lives in the lowest layer that still fires it. The frontmatter
`description` (loaded every turn) says when to summon, in the user's vernacular,
with one NOT-boundary, in at most three sentences. The `SKILL.md` body carries only
stance and behavior-changing gates. `references/` carries protocol detail, loaded on
demand and moved verbatim. Skill depth is behavior delta divided by always-resident
tokens; delete-test each body paragraph.

The invocation axis has one owner, the `disable-model-invocation` frontmatter field,
and README buckets it for humans. Instructions load only when needed: the repo-root
guide indexes source guides, and dispatch machinery lives in references. The prose
failure vocabulary is owned once by
`docs/authoring-failure-modes.md`.

## Evidence and alternatives

- Treating description length as per-skill taste was rejected: description cost is
  measurable and paid every turn.
- Claiming that invocation flags alone save runtime context was rejected until
  measured.
- Loading worker and dispatch machinery in skill bodies was rejected: it is paid on
  every fire for a path most fires never take.
- An eighth failure term, "Duplication", was rejected for lack of grounding.
