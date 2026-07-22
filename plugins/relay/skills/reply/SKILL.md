---
name: reply
description: "Respond on an existing GitHub object with an ACK, answer, comment, PR Comment, Approve, or Request changes. A reply records the human's response; it never decides that the whole object is finished."
---

# reply — leave my response on an existing object

Map the human's intended response to one GitHub-native action. `reply` leaves **my response**; `/relay:settle` uses authority to declare the whole matter finished or effective.

## Action map

| Human intent | GitHub action |
|---|---|
| “I attest that I saw this receipt-bearing notice” | Add your own `👀` — clears only your own receipt, never anyone else named alongside you |
| “Here is my answer” | Post an answer to the Q&A Discussion |
| “This answer resolves my question” | Accept the answer as the Discussion author |
| “Here is context or feedback” | Discussion or Issue comment |
| “Feedback, not a verdict” | PR Comment |
| “This revision is acceptable” | PR Approve |
| “This revision must change” | PR Request changes |

## Process

1. Open the supplied object URL and read its current state. Ask if the target or intended action is ambiguous.
2. For PR verdicts, resolve the current head revision immediately before acting. Never carry a verdict across a changed revision.
3. **Author sign-off.** A `👀` reaction is mechanical — no authored text — so it follows the normal write-gate: show the target and wait for approval. Any response that carries prose (an answer, a comment, a PR Comment, or verdict text on Approve/Request changes) shows the exact text that will be posted, verbatim, and asks: "Is this what you mean?" Post only after they confirm; a rewrite goes through the same gate. Wait for approval before writing.
4. Apply one native action.
5. Read the object back and verify the actor, action type, object, and revision where applicable.

## Completion

Done means the selected response exists on the correct object/current revision. It does **not** mean the Discussion, Issue, or pull request is complete.

## Discipline

- A Comment is never upgraded to Approve or Request changes by interpretation.
- A Q&A answer and the author's acceptance are different actions; never let the answerer accept on the author's behalf.
- Your own `👀` completes YOUR receipt, and only yours (ADR-097 receipt-default) — a Discussion naming several accounts gives each one its own independently-clearing receipt, not one shared obligation; another named recipient's own `👀` does not touch yours, and yours does not touch theirs. It verifies the actor's awareness attestation, not comprehension, acceptance, or external work.
- On an FYI, `👀` is a different signal from the ACK-notice attestation above: each recipient's own seen-mark — a comment is welcome when a recipient has something to say, but is never required. The initiator checks the reaction list, then closes the FYI as housekeeping (ADR-096).
- Never use an ACK reaction to claim that exact material was reviewed; request a PR verdict on that revision. Never use it to claim software was installed, a session restarted, a command ran, or state changed; those belong to an assigned Issue with evidence.
- Do not close objects, write final resolutions, merge, author briefs, or infer consensus.
- If the write succeeds but verification is blocked, return the URL and say verification is incomplete.

## Companion skills

- `/relay:digest` finds the obligation — including the native Q&A obligations on a Discussion the viewer authored: `accept-answer-or-follow-up` while unanswered with a stranger's comment (answered here by "This answer resolves my question", or by "Here is context or feedback" as a follow-up comment), and `close-answered-question` once accepted and still open. It also surfaces each named recipient's own receipt obligation on a receipt-bearing Announcement (ADR-097), completed here one `👀` at a time, and a `close-announcement` SETTLE obligation for the announcement's author once every recipient has reacted.
- `/relay:settle` handles authorized closure/effectivity after the response round — including closing an answered Q&A Discussion.

## Communication style

- Explain in the user's language with simple, direct wording.
- Lead with the result; put technical details after it.
