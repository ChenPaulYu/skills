# Plan protocol — grounded work at the necessary depth

The skill body owns depth selection, continuation and authority. Use this reference when
working through a requested engineering approach; it supplies grounding and verification examples,
not a mandatory set of sections.

## Grounding and readability

Use a gap-and-uncertainty loop: intended outcome → current evidence → necessary change
and unresolved premises → evidence or decision that resolves them → an acceptance observation.
Apply it at the responsibilities affected by the request, including dependencies; a file inventory
alone cannot establish requirement coverage. Reuse existing task criteria and decisions rather
than creating another checklist or enforcing a fixed set of headings.

When checking a premise, consider whether an unspoken boundary, compatibility obligation,
edge condition or trade-off would change the result. These are lenses for finding consequential
unknowns, not questions to ask by quota. Read facts from the repository/source, recover already
made choices from the conversation, and ask only for a remaining user-owned decision.
Engineering owns factual investigation and routine implementation trade-offs. A missing API
fact is not a question for the author. An unresolved product choice names the affected
engineering decision and returns to shape; it does not expand plan into product discovery. Preserve a resolved choice's rationale when it constrains the
implementation; keep unresolved premises and their consequences visible to the next executor.
A short plan can compress the writing while still accounting for those decisions.

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

## Turn promised outcomes into coverage

Use the user's requests and accepted reference to follow one representative interaction. At
relevant transitions, ask what input/material is carried in, what the user receives, what they
can do next, and what survives leaving/reopening or a failed attempt. Compare affected menus,
shortcuts and other entry points; include removal of superseded behavior. Reuse the task's
completion criteria/work items for these observations instead of adding a second inventory.

A reference with authored example text, fixed results or seeded state proves a presentation
choice. Inspect which of those the implementation must acquire, compute, generate or persist.
Name that producer and the check for its output before treating the reference as implementable.
For example, an attachment visible in an editor needs checks at submission, in the sent result,
and on later inspection; checking only its input chip misses the rest of the promised behavior.

For generated answers, trace evidence acquisition into the real request. Record necessary
surrounding context, source identity, retrieval/coverage limits and what happens when it is
unavailable. A narrow selected target can require wider evidence without expanding the output
scope. Choose bounds for the task rather than always loading a whole corpus or prescribing a
fixed page count, summary cache or provider architecture.

Use discriminating examples: a pronoun whose antecedent is outside the selected excerpt, or
the same excerpt in two source contexts that require different interpretations. Define the
supported answer and disallowed unsupported claims from the source. Deterministic fixtures can
verify context inclusion, retrieval/failure behavior and correct source delivery. Evaluation
against those source-dependent expectations is separate from schema/transport/UI checks; a
canned response cannot establish generated-answer quality. When live evaluation is not
available or authorized, retain that acceptance item as pending and complete independent
engineering work within scope. Do not treat the user's core outcome as verified by relabeling it
an optional quality improvement.

## Keep the approach proportional

An engineering proposal explains responsibility and ownership, reuse, critical
interface changes, compatibility and risk handling. Order dependent changes
where sequencing matters. Name critical files when their role informs a choice.
Discuss rollback only when the proposed change needs it. Use the existing task's
deliverables and acceptance checks as inputs and keep their progress in that task.

## Comparing interface designs

Use this only when the user asks to compare or choose an interface. In one pass,
sketch three deliberately different designs: (a) the fewest entry points, (b) the
most flexibility for future callers, (c) the simplest call for the most common
caller. For each, give the signature, a caller example, what it hides and its
trade-offs. Compare them on depth (behavior per unit of interface), where future
change lands, and seam placement, then recommend one or a hybrid. Keep any behavior
change it implies (failure handling, naming, ordering) visible as a decision for the
user rather than folding it into the design. In two probe rounds this single-pass
form won 2 of 3 blind comparisons, each narrowly; it is not worth separate design
workers by default.

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
