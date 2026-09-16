# Plan protocol — grounding and artifact

Use while drafting a substantial implementation plan. The skill body owns continuation and
authority; this reference supplies the evidence checklist and file shape.

## Grounding

Reuse a same-session audit of the same target when it still matches the working tree. Otherwise
read affected domains, detect the stack, and trace behavior through entry points, implementation,
consumers, and verification. Scope the investigation to the proposed change.

Describe each gap as current behavior, requested behavior, and the necessary change. Check for
existing helpers and architectural seams before proposing new ones. File length is a reason to
inspect cohesion, not an instruction to split. A public API or persisted format needs an explicit
compatibility boundary and a check of its consumers.

Resolve uncertainty from the repository and conversation first. Ask about missing intent or a
trade-off the user must own; do not invent questions to fill a quota. Separate blocked steps
from independent work. A plan depending on an unanswered material question must say so.

## Plan template

Follow the existing repository language and structure; omit empty optional sections.

```markdown
# <Feature> — plan

> Generated: <date> · Source: <request/spec> · Grounding: <fresh/reused>

## Context

<Current behavior, code evidence, desired outcome, compatibility boundaries.>

## Resolved questions

<Consequential choices already made, including prior conversation authorization.>

## Open questions

<Only unresolved choices; state which step each blocks.>

## Approach

<Dependency-ordered, independently verifiable changes. Name existing pieces to reuse,
new owners and their adopting consumers, and required generated artifacts.>

## Critical files

| File | Role and planned change |
|---|---|
| <path> | <why this file is involved> |

## Verification

<Checks for changed behavior and preserved contracts; focused checks during implementation,
required final gates, and interface flows not covered by tests. Identify missing evidence.>

## Out of scope

<Real scope boundaries, not hypothetical future features.>
```

For shared design values, name the single owner and the step adopting it at existing call sites.
Verify the owner has actual consumers. When a board tracks the work, update only advanced or
completed items with evidence; reprioritization remains a separate decision.

## Review before continuing

Can another executor identify the files, intended behavior, preserved contract, and completion
check without reconstructing this conversation? Are unresolved decisions visible? Does the
plan respect the authorized scope? If so, show its approach and follow the continuation rule
in the skill body. Planning alone is not permission to build or publish.
