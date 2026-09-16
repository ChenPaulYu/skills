# ADR-129: Elicit clarifies instead of manufacturing friction

> 2026-09-16 · Accepted.
> Revises ADR-076's phrase-triggered stall handling and the adversarial interview rules.

## Decision

Keep elicit as grounded help with an undecided conceptual choice or a specific
root cause. Remove the instruction to produce disagreement, the agreement counter,
and the assumption that progress must take the form of another fork.
Agree when evidence supports the user; challenge a concrete contradiction,
unsupported premise, or consequence when one exists. Recommendations are useful
when justified, not compulsory accessories to questions.

Hesitation is contextual evidence, not a classifier. An expression such as
"am I overcomplicating this?" may question the agent's process rather than expose
a knowledge gap. Interpret context and clarify ambiguous intent when it matters;
do not automatically diagnose or switch modes from the phrase alone.

Explain small gaps inline. Preserve the survey leg for a demonstrated broader
gap and the experiment route for a material empirical uncertainty unresolved by
existing evidence. Verify relevant sources without a quota. Pause for reading
when the user wants it or their firsthand assessment is genuinely needed, not
because a rule requires a reading assignment.

## Preserved boundaries

- Ground factual claims and diagnoses in relevant evidence; distinguish hypotheses
  from confirmed causes. Local bugs need not become structural redesigns.
- Respect the user's choices and vetoes; do not manufacture agreement either.
- Stop when the uncertainty is resolved; accept simple answers and doing nothing.
- Keep broader surveys optional, without automatic research spending or skill calls.
- Persist only within authorization and existing conventions, with a content/diff
  preview. A small clarification can stay in chat; no compulsory new document tree.
- Diagnosis alone does not authorize implementation. Already-authorized larger
  workflows may continue with their normal checks, without another closing menu.

## Scope and verification

Update the body, both references, current plugin/public descriptions, the Codex
discovery description and regression canary, then regenerate and sync installed
copies. Historical observations remain evidence rather than current instructions.
Maintenance automation is deferred; no skill is added or renamed.

Static checks establish packaging and instruction consistency, not improved
conversation quality. Subsequent use should test warranted agreement, ambiguous
hesitation, inline definitions, legitimate broader surveys, and evidence-limited
diagnosis without treating a matching phrase as a behavioral evaluation.
