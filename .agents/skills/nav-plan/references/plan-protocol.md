# Plan protocol — grounded work at the necessary depth

The skill body owns depth selection, continuation and authority. Use this reference when
writing a short task or engineering detail; it supplies grounding and verification examples,
not a mandatory set of sections.

## Grounding and readability

Reuse a same-session audit of the same target when it still matches the working tree. Otherwise
read affected domains, detect the stack, and trace behavior through entry points, implementation,
consumers, and verification. Scope the investigation to the proposed change.

Describe the gap as current behavior, requested behavior, and the necessary change. Find the
existing owner and reusable path before proposing new ones. For engineering decisions, explain:

- Which module owns the behavior and hides its policy, state, format or algorithm.
- Which existing entry points and implementations are reused, and how consumers adopt any new owner.
- Which interface must change and which callers/contracts must remain compatible. Avoid props,
  flags and helper layers that merely relay knowledge another owner should keep private.

File length invites inspection of cohesion, not an automatic split. A public API or persisted
format needs an explicit compatibility boundary and a check of its consumers. A shared callback,
prompt or configuration change needs a check of other operations using it, not only the new caller.

Resolve uncertainty from repository evidence and prior decisions first. Ask about missing intent
or a trade-off the user must own; do not invent questions to fill a quota. Separate blocked items
from independent work and name the decision that blocks each affected item.

## One task, expanded only where useful

In a connected workspace, extend the existing task rather than replacing its goal, progress or
verification. Follow the shared frontmatter, opening summary and visible Relations convention;
those fields are owned by the record interface, not this template. Planning-only work remains
`planned`. Keep live legacy plans and unconnected-repository conventions in their existing shape.

A short task can use this body. Omit empty sections; do not manufacture work just to fill it.

```markdown
# <Outcome>

> <Current state or open question in up to three lines.>
> Next: <concrete next action>

## Relations
<Projection of actual frontmatter links, or an explicit absence of relations.>

## Goal and boundaries
<Desired outcome, authorized scope and existing behavior that must remain intact.>

## Completion criteria
<Observable outcomes, including what evidence is needed before closing.>

## Work items
- [ ] <Ready outcome and its completion check.>
- [ ] <Dependent outcome and its completion check; name its dependency when needed.>

## Verification
<Expected result and command/workflow for each material risk. Planned checks are not passes.>

## Progress, evidence and next action
<Actual changes, checks run and observed results; remaining limits/blockers and next ready item.>
```

For engineering depth, add an **Implementation plan** in the same task: responsibility/ownership,
reuse, critical interface changes, compatibility and risk handling, followed by dependency-ordered,
independently verifiable changes. Name critical files where their role matters. Resolved/open
questions, migration/rollback or a file-role table are useful only when they inform execution.
Do not prescribe every edit or add a second progress checklist in another document.

A work item is an outcome the executor can verify, not just "edit file A." Keep structural
preparation reviewable separately from new behavior. After a verified item, advance the next
ready item within the user's existing authorization; update blockers without losing independent
work. Do not split one task into several records merely to list implementation steps.

## Verification design and evidence

Choose checks by the failure they could reveal. Cover applicable risks in three dimensions:

| Dimension | Question | Useful evidence |
|---|---|---|
| New behavior | Does the actual entry point deliver the requested result? | Focused input/output check or interaction through the result, including delivery/persistence when affected |
| Preserved behavior | Which existing operation could change unintentionally? | Existing-consumer or regression check, especially for shared handlers, policies and configuration |
| Readability | Is complexity behind the right owner and a simple interface? | Diff inspection of responsibilities, real reuse, adopting callers, interface growth and duplicate logic |

For each material risk, name the scenario, expected observation and command or workflow. Keep
verification proportional: a pure helper may need input/output checks; a UI interaction may need
an interface pass at required sizes; an installed command needs invocation through its entry point.
Build/typecheck contributes static evidence, not proof that the behavior is connected. A fake
boundary can verify wiring while leaving native, physical-device or provider quality unverified;
state the boundary rather than claiming full runtime acceptance.

During execution, retain the actual check, relevant inputs/states, result and remaining limits.
Keep these observations distinct from checks merely planned. Record a newly discovered regression
as additional evidence rather than presenting it as a preregistered test. Honor repository-required
gates and existing authority for paid checks or external effects. No fixed test count or compulsory
new test file follows from this format.

## Review before continuing

Can the next executor identify the intended behavior, owner/reused path, preserved contract,
next ready item and completion check without reconstructing the conversation? At engineering
depth, are consequential decisions and caller adoption explicit? Keep only details that improve
those answers, show the chosen approach, then honor the continuation rule in the skill body.
Planning alone is not permission to build or publish.
