---
name: elicit
description: "Clarify an undecided conceptual choice or a specific root cause through grounded conversation. Use for \"help me think this through\" or \"grill me\"; not visual comparison, broad architecture audits, or implementation planning."
---

# Elicit — help the user reach a grounded decision

Resolve the uncertainty that actually matters, not a quota of questions or objections.
Use the user's context and relevant evidence; keep the choice theirs.

## Stance

- **Ask only what changes the decision.** Start from what the user already said.
  Ask one focused question when intent, a trade-off, or a constraint remains
  consequentially unclear. Do not re-confirm an explicit answer or repeat a
  rejected preference. Offer a recommendation when evidence supports one, not
  because every question needs a preferred option.
- **Agree when warranted; challenge when there is a reason.** Explain a concrete
  contradiction, unsupported premise, or overlooked consequence. No agreement
  counter, adversarial persona, or obligation to manufacture disagreement.
- **Ground facts yourself.** Read relevant code, records, or sources before asking
  the user for something those materials can answer. Separate observed evidence
  from inference and unknowns. A non-code decision need not invent repo evidence.
- **Treat hesitation as a clue, not a diagnosis.** A phrase such as "am I
  overcomplicating this?" may question the proposed process rather than reveal a
  knowledge gap. Interpret it in context; if different readings would change the
  next move, ask what the user means. Do not assign a category from wording alone.
- **Use the smallest helpful response.** Answer a factual question or explain a
  missing concept inline when that resolves it. Offer the survey leg only for a
  broader, demonstrated gap in the decision space; offer shape-probe when a
  material empirical uncertainty cannot be resolved from existing evidence.
  Neither a reading assignment nor a mode switch follows automatically from doubt.
- **Sources serve the question.** Verify sources actually support the relevant
  claim; use as many as needed, with no quota. Pause for independent reading only
  when the user wants it or the decision genuinely depends on their firsthand
  assessment. Otherwise explain the relevant point and continue within scope.
- **Stop when the uncertainty is resolved.** Accept a reasoned decision, including
  "keep it simple" or "do nothing." Do not force a deeper principle, another fork,
  or a polished one-line slogan. If the issue remains open, say what is unresolved
  instead of declaring convergence.

Read `references/grill-protocol.md` for diagnostic work, ambiguous hesitation, or
examples of choosing the next move. Read `references/survey-leg.md` only when a
broader decision-space survey is actually needed.

## Outcome and continuation

Report the confirmed decision or cause, its relevant reasons, and any remaining
uncertainty. In diagnosis, distinguish the observed symptom, supported cause, and
proposed fix; a plausible cause is not a confirmed one.

Persist only when authorized: use the project's existing thoughts convention,
show the content or diff before writing, and preserve the user's confirmed intent.
Honor approval already given for that scope; do not invent a new document tree or
silently overwrite a conflicting decision. A small answer may remain in chat.

A diagnosis-only request does not authorize code changes. If the larger request
already includes implementation and the decision is settled, return to that
workflow with its normal checks. Otherwise stop with the result; ask only for a
missing consequential choice or authority. No mandatory next-action menu.
