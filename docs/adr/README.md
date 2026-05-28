# ADRs — Architecture Decision Records

Decisions that shape this marketplace. Sibling to [`observations/`](../observations/) (use-side patterns) and [`findings/`](../findings/) (build-side mechanisms).

## When to write an ADR

| Trigger | Goes to |
|---|---|
| Made a choice between alternatives | **ADR** |
| Learned how the tooling works | `findings/` |
| Noticed a usage pattern | `observations/` |
| Want a "always do this" rule, no alternatives weighed | `CLAUDE.md` addition |

If a finding led to weighing alternatives → promote to ADR (link the finding from the ADR's Context).

## Format

```markdown
# ADR <N> — <topic>

**Status**: accepted | superseded by ADR-<M> | partially superseded
**Date**: YYYY-MM-DD
**Supersedes**: (optional) prior ADRs replaced

## Context
2-4 sentences. The situation forcing a decision.

## Decision
What we chose. Table if multiple parts.

## Why
3-5 bullets. Load-bearing reasons only.

## Consequences
3-5 bullets. What changes as a result.
```

Optional trailing sections: `## Notes` for caveats / "what this doesn't promise" / lessons. Skip if nothing to add.

## Status lifecycle

| Status | Meaning |
|---|---|
| `accepted` | In force |
| `partially superseded` | One section overridden; rest stands. Link to the superseding ADR. |
| `superseded by ADR-<M>` | Fully replaced. Keep file as history. |

Never delete an ADR. Supersede.

## Discipline

- Title = one-line decision (greppable). Future you scans titles, not bodies.
- "Why" lists reasons, not narrative. If a reason needs a paragraph, it's probably two reasons.
- Cite findings / commits / files when the ADR is grounded in concrete events.
- No "lesson recorded" essays. One line if useful, else cut.
