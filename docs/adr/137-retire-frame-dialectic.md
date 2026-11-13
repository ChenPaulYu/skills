# ADR-137 — Retire `frame:dialectic`

> 2026-11-13 · Status: accepted · Supersedes ADR-047's lens roster entry; follows ADR-136's retirement pattern.

## Context

Transcripts from Claude Code and Codex sessions for 2026-10-09 through 2026-11-13
(about five weeks) show `frame:dialectic` at zero Claude Code uses and two Codex
sessions. Five weeks is short of ADR-109's three-month zero-fire rule, so the window
alone does not authorize deletion.

The authority is the owner's decision: after reviewing this usage evidence, the owner
chose to delete the skill outright, which is the third cause in ADR-107's three-causes
check (genuinely unclaimed).

## Decision

1. Delete `plugins/frame/skills/dialectic/` and its generated Codex and Cursor mirrors.
   Frame goes from five skills to four (`first-principles`, `orthogonal`, `analogize`,
   `draw`); its minor version bumps.
2. `shape:probe` is unchanged in behavior. It restated the discipline inline and never
   read dialectic's files, so only its attributions change: step 1 (locate the
   load-bearing assumption) stays, without naming a live skill. Shape's patch version bumps.
3. Hand-maintained surfaces (README, catalog copy, Codex descriptions, the site audit
   block) drop dialectic. Historical records (`docs/adr/`, `docs/observations/`,
   `docs/findings/`, `blueprints/`) are dated and left untouched.

## Consequences

- Fewer resident skill descriptions; frame now has two reasoning lenses.
- Re-entry: restore from version history (the last commit containing
  `plugins/frame/skills/dialectic/`) rather than rebuilding.
- Deferred, not decided: a design-review loop modeled on Google's Elephant-Goldfish
  Model could succeed it. It would belong to the planning path, not frame, and would
  require revisiting ADR-123.
