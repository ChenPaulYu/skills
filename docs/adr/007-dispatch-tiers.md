# ADR-007 — Dispatch tiers

Status: accepted · 2026-11-18

## Decision

The session model owns planning, judgment, review and acceptance. Bounded
reconnaissance and execution default to `model: sonnet`. Workers return file and
source evidence, never a substitute verdict. When judgment is stuck, the session asks
the user; there is no sub-agent reviewer rung. The dispatcher injects scope, seams,
contracts and completion checks, then reads the actual diff on return. A task is safe
for the cheaper tier when it has ground truth, cheap downstream verification and
cheap mistakes. Mechanical skills declare `model: sonnet` in frontmatter. Dispatches
report `⚙ 派工:執行=<tier> ×N|判斷+驗收=session model`, and resulting commits say so.

## Evidence and alternatives

- An advisor tool, then a stronger-model sub-agent reviewer, were tried and dropped:
  each review is itself an unreviewed judgment one level up. Reinstating either needs
  a new decision here.
- Per-tier skill copies (`do-sonnet`) were rejected; tier is a dispatch parameter.
- Per-item dispatch approval was rejected (see ADR-008).
- An unverified benchmark is not evidence for moving a task to the cheaper tier.
