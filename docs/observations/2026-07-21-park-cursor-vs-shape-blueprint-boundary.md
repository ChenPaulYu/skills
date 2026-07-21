---
date: 2026-07-21
status: raw
---

# Two sanctioned "record where work stands" homes (park's HANDOFF.md vs shape's blueprints) have an unmarked boundary

> Source: patchboy session — asked to "park" a built-but-never-live-tested CLI
> member, the agent wrote an ad-hoc `handoff.md`; the user rejected it for the
> shape blueprint format. Filing this as skill-feedback surfaced that BOTH a
> `reflect:park` (→ `HANDOFF.md`) and a `shape:align` (→ `docs/blueprints/`)
> convention already exist — and nothing states which fits which case.

## What happened

Told to "park" `threads-cli` (a scaffolded, mocked-green, never-run-against-a-real-
app member) so it could be resumed later, the agent invented
`threads-cli/handoff.md` in a bespoke format. The user corrected it:

> 那個handoff，你可以參考其他project的格式嗎？不要亂做，請你建立shape的blueprint格式

The fix was the shape blueprint convention every sibling project (gamut, phonon,
tactus, ricercar, youtube-toolkit) uses: `docs/blueprints/plan.md` (status board)
+ `plans/<date>-<slug>.md` (grounded plan). While routing this as skill-feedback,
it turned out `reflect:park` ALSO exists and its canonical output is literally
`HANDOFF.md` (project-root cursor: Goal/Done/Now/Open/Next + git SHA, single
overwritten file). So the agent's `handoff.md` was not invented from nothing — it
half-collided with park's sanctioned name while landing on neither convention.

## The real gap

There are TWO legitimate homes for "record where work stands," and the line
between them is nowhere stated:

- **`reflect:park` → `HANDOFF.md`** — an EPHEMERAL session cursor: "where am I
  *right now*, about to step away, and why," single file, overwritten,
  local-by-default.
- **`shape:align` → `docs/blueprints/plan.md` + `plans/`** — DURABLE status: a
  maintained board (⏸ Future, etc.) + grounded plans that outlive the session and
  belong to the roadmap.

The threads case was the second kind — a durable parked feature plus a resume
checklist that belongs on the roadmap — so shape was right. But nothing in either
skill tells an agent how to choose, and the generic-industry `handoff.md` pattern
is the attractor reached for instead of either.

## Skill-feedback bind (S · P · D)

- **S (skills):** `reflect:park` and `shape:align` — the two that own "record where
  work stands."
- **P (decision-point):** when asked to park / hand off / write down where work
  stands for later.
- **D (behaviour-delta):** make the boundary explicit and cross-referenced —
  route an ephemeral "stepping-away cursor" to `reflect:park`/`HANDOFF.md`, and a
  durable "parked-work-with-resume-plan / roadmap item" to shape's ⏸ board entry +
  a grounded `plans/` doc. Never invent a third ad-hoc format; and when a repo has
  no `docs/blueprints/` yet, seed it from the sibling convention rather than
  improvising (a brand-new repo is not an excuse).

## Toward a skill change (the ADR → skill-change step; maintainer's call)

Cheapest fix: each of the two skills carries a one-line "not this skill when…"
cross-reference to the other, so an agent doing an ad-hoc "park this" request
(outside an explicit `align`/`park` invocation) lands on the right convention
instead of a hybrid. A deeper option is a short shared note on the two record-homes
and their boundary.
