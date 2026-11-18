# ADRs — Architecture Decision Records

An ADR stops a rejected alternative from being re-proposed. Each one states a topic's current decision and why the alternatives lost ([ADR-019](docs/adr/019-doctrine-docs-and-conventions.md)). Siblings: [`findings/`](docs/findings/) (build-side mechanisms) and [`out-of-scope/`](docs/out-of-scope/) (rejected proposals with no standing decision).

## When to write an ADR

| Trigger | Goes to |
|---|---|
| Weighed alternatives, and the rejected one is likely to be re-proposed | **ADR** — update the topic's existing ADR, or add one for a new topic |
| Any other change, including a new skill or a rename | the commit message |
| Learned how the tooling works | `findings/` |
| Noticed a usage pattern | the skill or `CLAUDE.md` it corrects; a workspace idea when the owner is unclear |
| Want an "always do this" rule, no alternatives weighed | `CLAUDE.md` addition |

If a finding led to weighing alternatives → record it in the topic's ADR (link the finding).

## Format

```markdown
# ADR-<N> — <topic>

Status: accepted | trial | retired · YYYY-MM-DD

## Decision
The current decision, stated as it stands today.

## Evidence and alternatives
What grounded it, and each rejected alternative with the reason it lost.
```

## Status lifecycle

| Status | Meaning |
|---|---|
| `accepted` | In force. Edit in place when the decision changes and update the date. |
| `trial` | In force for a stated pilot; name what would confirm or reverse it. |
| `retired` | No longer in force. Keep one line saying what replaced it. |

One ADR owns one topic. Revise it in place; Git keeps the history. Add a new number only for a new topic. The 156 change-by-change ADRs written before 2026-11-18 were consolidated into ADRs 001–019; recover an original with `git show e8d0866:docs/adr/<file>`.

## Discipline

- Title = the topic (greppable). Future you scans titles, not bodies.
- An ADR states the current decision and its reasons. What changed and when belongs in the commit message.
- Reasons, not narrative. If a reason needs a paragraph, it's probably two reasons.
- Cite findings / commits / files when the ADR is grounded in concrete events.
