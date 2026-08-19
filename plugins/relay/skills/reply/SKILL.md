---
name: reply
description: "Respond on an existing GitHub object — 回覆他 / 幫我回 — clarify, answer, or hand off the same scope with native stage/assignment changes; route independently completable follow-ups back to report. Also posts PR comments/verdicts. Never settles the whole object."
---

# reply — leave my response on an existing object

Map the human's intended response to one GitHub-native action. `reply` leaves **my response**; `/relay:settle` uses authority to declare the whole matter finished.

## Action map

| Human intent | GitHub action |
|---|---|
| "Here is more context/evidence" | `clarify`: comment only; state explicitly that the baton does not move |
| "Here is the input you asked for" | Post the answer as a comment on the `needs-input` Issue — this flips the baton (see below) |
| "You own the next step on this same outcome" | `handoff`: comment plus legal stage/assignee transition (see below) |
| "This also raises a separately completable task/question" | `fork`: stop in-object mutation and delegate linked Issue creation to `/relay:report` |
| "This resolves it" / "I need more" | The acceptor's disposition comment on an `awaiting-acceptance` Issue — accept it, or send it back |
| "Here is my answer to your Q&A question" | Comment on the answerable Discussion — only the question's AUTHOR may mark it as the accepted answer; never accept on their behalf |
| "This answer resolves my question" (as the author) | Mark the answer accepted, then close via `/relay:settle` |
| "Here is context or feedback, not a formal response" | Discussion or Issue comment |
| "Feedback, not a verdict" | PR Comment |
| "This revision is acceptable" | PR Approve |
| "This revision must change" | PR Request changes |

## The baton flip (blueprint section 10)

`report`'s `needs-input` Issue names an owner and a completion rule. Delivering the requested input is not a comment that happens to exist alongside an unchanged label — it is a **native state transition**, and `reply` is the verb that performs it:

1. Post the answer as a comment on the Issue.
2. Remove the `needs-input` label and apply `awaiting-acceptance`.
3. Reassign the Issue to the acceptor (usually the original asker).

Both the label swap and the reassignment are native GitHub fields — `/relay:digest` computes "the acceptor now owes a disposition" from them alone, no prose parsing, typo-proof. The baton has flipped: A asked B, B owed the input, B replied, now A owes the disposition (accept, dispose, or send back with `needs-input` re-applied and reassigned to B again if the answer wasn't sufficient). A reply never implies consensus, closure, or a change to formal memory on its own — the acceptor's own subsequent disposition is what determines what happens next.

## Clarify, handoff, or fork (ADR-120)

Choose the transition before drafting. A matter with no independent completion condition remains a
`clarify`/`answer` on this object. A same-scope next actor uses `handoff`. A matter with its own
stateable completion condition is `fork`, even when the current object depends on it; `/relay:report`
owns child creation and reciprocal links.

A generic handoff is allowed only for the current assignee or stable settlement seat. Plain work
and `needs-input` may transfer. It may never exit `awaiting-acceptance` or `awaiting-record`; only
the acceptor's disposition or completed recording chain can do that. Full matrix and recoverable
mutation sequence: `references/transition-protocol.md`.

## Process

1. Open the supplied object URL and read its `Done when`, current stage, assignees, settlement seat, and latest conversation. Choose `clarify`, `answer`, `handoff`, or `fork`; ask only when the completion condition or authority is genuinely ambiguous.
2. For PR verdicts, resolve the current head revision immediately before acting. Never carry a verdict across a changed revision.
3. **Author sign-off.** Any response that carries prose (an answer, a comment, a PR Comment, or verdict text on Approve/Request changes) shows the exact text that will be posted, verbatim, and asks: "Is this what you mean?" Post only after they confirm; a rewrite goes through the same gate. Wait for approval before writing.
4. Apply the native action — including the legal label/assignment mutation for `answer` or `handoff` — as one recoverable sequence. `fork` delegates to `report` and performs no in-object responsibility mutation itself.
5. Read the object back and verify the actor, action type, object, label state, assignee, and revision where applicable.

## Completion

Done means the selected response exists on the correct object/current revision, with the legal stage and assignment read back where applicable. For `clarify`, it also means no native responsibility field changed. For `fork`, completion belongs to `report`'s verified child/link contract. It does **not** mean the Issue, Discussion, or pull request is complete.

## Discipline

- A Comment is never upgraded to Approve or Request changes by interpretation.
- Delivering input and accepting it are different actions on different sides of the baton flip; never let the same reply that delivers input also record its own acceptance.
- Never let generic handoff bypass `awaiting-acceptance` or `awaiting-record`, and never infer handoff authority from an `@mention`.
- Never use a comment to claim exact material was reviewed; request a PR verdict on that revision. Never use it to claim software was installed, a session restarted, a command ran, or state changed; those belong to an assigned Issue with stated evidence.
- Do not close objects, write final resolutions, merge, author briefs, or infer consensus.
- If the write succeeds but verification is blocked, return the URL and say verification is incomplete.

## Companion skills

- `/relay:digest` finds the obligation: an assigned `needs-input`/`awaiting-acceptance`/`awaiting-record` Issue, a native Q&A obligation on a Discussion the viewer authored (`accept-answer-or-follow-up` while unanswered with a stranger's comment, answered here by "This answer resolves my question" or by a follow-up comment; `close-answered-question` once accepted and still open), or a requested PR verdict.
- `/relay:settle` handles authorized closure after the response round — including closing an answered Q&A Discussion, and applying `awaiting-record` when a Decision must be committed.

## Communication style

- Explain in the user's language with simple, direct wording.
- Lead with the result; put technical details after it.
