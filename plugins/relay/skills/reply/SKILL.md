---
name: reply
description: "Respond on an existing GitHub object with an ACK, answer, comment, PR Comment, Approve, or Request changes. A reply records the human's response; it never decides that the whole object is finished."
---

# reply — leave my response on an existing object

Map the human's intended response to one GitHub-native action. `reply` leaves **my response**; `/relay:settle` uses authority to declare the whole matter finished or effective.

## Action map

| Human intent | GitHub action |
|---|---|
| “I read the explicit ACK request” | Add `👀` as the designated account |
| “This answers the question” | Post/select a Discussion answer as appropriate |
| “Here is context or feedback” | Discussion or Issue comment |
| “Feedback, not a verdict” | PR Comment |
| “This revision is acceptable” | PR Approve |
| “This revision must change” | PR Request changes |

## Process

1. Open the supplied object URL and read its current state. Ask if the target or intended action is ambiguous.
2. For PR verdicts, resolve the current head revision immediately before acting. Never carry a verdict across a changed revision.
3. Show the exact response/action and target. Wait for approval before writing.
4. Apply one native action.
5. Read the object back and verify the actor, action type, object, and revision where applicable.

## Completion

Done means the selected response exists on the correct object/current revision. It does **not** mean the Discussion, Issue, or pull request is complete.

## Discipline

- A Comment is never upgraded to Approve or Request changes by interpretation.
- Only the designated account's `👀` completes an ACK.
- Do not close objects, write final resolutions, merge, author briefs, or infer consensus.
- If the write succeeds but verification is blocked, return the URL and say verification is incomplete.

## Companion skills

- `/relay:digest` finds the obligation.
- `/relay:settle` handles authorized closure/effectivity after the response round.

## Communication style

- Explain in the user's language with simple, direct wording.
- Lead with the result; put technical details after it.
