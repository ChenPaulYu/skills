---
name: settle
description: "Close a Discussion or Issue with an authorized final resolution, merge an approved pull request, or close an explicitly abandoned pull request with a reason. Core additionally requires verified enforcement before merge makes it binding. Never authors a brief, substitutes for approval, or re-decides the matter."
---

# settle — declare the whole matter finished or effective

`reply` leaves my response. `settle` verifies authority, records the final resolution, and closes the object or makes approved Core effective.

## Process

1. **Read the whole current state.** Open the object, completion criteria, evidence, linked decisions, assignments, latest revision, reviews, and repository protection. Identify the claimed authority.
2. **Validate authority.** For an ordinary task Issue, the single assignee may settle after the stated evidence meets every completion criterion; if requester acceptance was specified, require it. For a Decision Issue, the single assignee is the v1 decision owner unless repository guidance names another authority. For Q&A, respect the accepted-answer owner. For an ordinary PR merge, require the requested reviewer's valid current-revision approval; the PR author owns settlement unless one PR assignee explicitly names the merger. Multiple assignees do not transfer it. For an unmerged PR abandonment, require the author or repository authority and an explicit reason; never describe it as successful completion. For Core merge, additionally require the configured approver's valid current-revision approval and meaningful required-review, stale-dismissal, and bypass enforcement.
3. **Draft the final resolution.** Make it self-contained: outcome, decision, concise reason, effective point, and follow-up link where work continues elsewhere.
4. **Show the exact resolution and close/merge action.** Wait for approval.
5. **Apply and read back.** Post the resolution, then close the Discussion/Issue, merge the approved PR, or close the explicitly abandoned PR. Verify closed/merged state, actor, current revision, and merge commit/effective time where applicable.

A closure that supersedes an earlier object names its successor in the closing comment, so a reader lands on the current object instead of a dead end.

## Accepted versus effective

A decision may be accepted before it is effective. An ordinary change applies when its PR merges; a Core rule becomes binding only when its enforced PR merges. Closing an unmerged PR means abandonment, not successful completion. Closing an Issue without an authorized final resolution is not settlement.

## Completion

Done means a reader can understand who decided, what was decided, and when it became effective without rereading the thread.

## Discipline

- Settle; do not re-decide. Disagreement returns to the object or a new linked object.
- Never treat Comment as approval or reuse stale approval after a revision changes.
- Never author/update a brief or substitute for the required reviewer.
- If resolution posting succeeds but close/merge fails, return the existing URL and missing action; resume it rather than duplicating.

## Communication style

- Explain in the user's language with simple, direct wording.
- Lead with the result; put technical details after it.
