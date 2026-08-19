# Follow-up routing — two axes, one owned child

Use this machinery only after a new comment or intent appears near an existing object. The
behavior-changing gates stay in `SKILL.md`; this reference carries the worked routing procedure.

## Axis 1 — object boundary

Ask whether the new matter has its own stateable completion condition.

| Answer | Route |
|---|---|
| No | It is clarification, evidence, or an answer for the existing `Done when`; send it to `reply` |
| Yes | It is independently trackable; create a linked follow-up Issue |
| Unclear | Ask for the completion condition or keep the emerging topic in a Discussion |

Topic similarity, dependency, chronology, and a changed owner do not decide this axis. A dependent
matter can still need a child; a different actor can still take the baton inside one unchanged
scope.

## Axis 2 — parent disposition

After a child exists, ask whether the parent can truthfully settle while the child stays open.

| Answer | Parent state |
|---|---|
| Yes | Settle the parent's own scope and list the child in `Follow-ups:` |
| No | Keep the parent open for its own unmet `Done when`; the child still tracks its own completion |

Never make child closure silently close the parent, or parent closure silently close the child.

## Fork mutation

Preview one recoverable mutation set:

1. Child Issue title and body, including `Origin: <source URL>` and one `Done when:`.
2. One verified native assignee and any initial stage label.
3. A source-object comment linking the child and stating whether the source remains open or is now
   ready for settlement.

Create the child first, read back its assignee/completion rule, then add the source link and read it
back. Reciprocal links are the v1 contract. Native sub-issue metadata may be added when available,
but its absence never blocks an otherwise valid fork.
