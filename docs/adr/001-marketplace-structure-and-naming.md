# ADR-001 — Marketplace structure and naming

Status: accepted · 2026-11-18

## Decision

One marketplace, `skills`, holds topical plugins (`nav`, `shape`, `frame`). Skills
use bare verbs; the `<plugin>:` prefix is the namespace, so skill names never repeat
it. A family may diverge when its idiom demands it and says so in its plugin guide
(frame's lenses use canonical names such as `first-principles`). Skills are
language-agnostic: a universal core plus per-stack heuristics, never refusing an
unfamiliar stack.

## Evidence and alternatives

- A plugin named after one philosophy (`deep-modules`) or one person (`paul-dev`)
  was rejected: it locks the brand to a single idea or owner.
- Prefixing skill names (`nav-audit`) was tried and removed: the colon already
  namespaces, so the prefix paid for the namespace twice
  (`docs/findings/2026-05-28-dont-pay-for-namespace-twice.md`).
- Bailing out on unknown stacks was rejected; principles transfer and only
  thresholds need adjusting.
