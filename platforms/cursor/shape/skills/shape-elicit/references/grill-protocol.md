# Elicit protocol — choose the next useful move

> Operational examples and diagnostic detail. The SKILL.md body owns the behavior
> and authorization gates. ADR-129 replaces the former compulsory-friction loop;
> the filename remains stable for existing references.

## Ground the actual uncertainty

Use the stated goal and decisions already reached. Restate your interpretation
only when a plausible misreading would change the work. Read the relevant
implementation or records for factual questions; ask the user for preferences,
intent, or constraints not available there.

A fork is useful when its alternatives expose a real trade-off. It is not the
mandatory shape of every reply. A direct answer, a counterexample, or a brief
explanation may resolve the question without another choice.

## Hesitation has several possible meanings

These examples illustrate judgment, not phrase-triggered transitions:

| Situation | Useful response |
|---|---|
| The user says "am I overcomplicating this?" after a large proposed process | Reassess whether the process is needed; simplify it if evidence supports that. Clarify only if their intended concern is ambiguous. |
| They ask what a term means | Explain the term in this context, then return to the decision if it remains open. |
| They keep switching because important options are unfamiliar | Check what is missing; offer a focused survey when the gap is broader than a brief explanation can resolve. |
| The choice depends on a result nobody has measured | Look for existing evidence first. If the unknown still matters, identify the smallest deciding test; running it needs appropriate scope and authority. |
| They prefer to read the original material before deciding | Supply verified, relevant sources and wait for their assessment. No fixed source count. |
| Their proposed simplification fits all known constraints | Agree and explain why; do not manufacture an objection to keep the conversation going. |

A tentative explanation of a stall should be revisable. The user saying "no,
that's not what I meant" is new context, not resistance to overcome.

## Diagnostic work

Trace the specific symptom against what is actually built and, when available,
reproduction evidence. Distinguish expectation from observed behavior.
Consider competing causes and check the links that would make each explain the
symptom; do not promote a hunch to a diagnosis.

A missing implementation path and a mistaken product premise imply different
fixes, but they are possibilities to investigate, not a compulsory opening
binary. A local bug may really be local; no structural reframe is required.
If runtime evidence is necessary but unavailable, name the missing check.
A broader hands-on usability pass may use shape-dogfood when the user wants it;
do not widen every targeted diagnosis into that pass.

## Finish proportionally

Stop when the user has a supported answer or has settled the decision. When
uncertainty remains, describe it precisely rather than forcing closure.
The body governs optional persistence and continuation; this reference adds no
document, closing menu, or implementation permission.
