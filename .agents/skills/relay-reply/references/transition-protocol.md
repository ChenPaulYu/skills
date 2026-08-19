# Existing-object transition protocol

`reply` chooses exactly one transition before drafting prose.

| Transition | Meaning | Native mutation |
|---|---|---|
| `clarify` | Adds context/evidence; no responsibility moves | comment only |
| `answer` | Supplies requested input | comment; `needs-input` -> `awaiting-acceptance`; assign acceptor |
| `handoff` | Same completion rule, different current actor | comment; legal stage/assignee update |
| `fork` | New matter has its own completion condition | delegate object creation to `report` |

## Handoff authority and legal exits

Only the current assignee or stable settlement seat may hand off the same scope.

| Current stage | Generic handoff | Exit |
|---|---|---|
| plain assigned work | allowed | replace the one assignee; keep plain stage unless the next action is explicitly requested input |
| `needs-input` | allowed | replace the input owner, or deliver the answer normally |
| `awaiting-acceptance` | forbidden | only the acceptor disposes or sends back to `needs-input` |
| `awaiting-record` | forbidden | only successful recording removes the stage |

The response that supplies input never accepts itself. A receipt never answers a question, and an
answer never settles unrelated work.

## Recoverable mutation sequence

For `handoff`, preview the next action, unchanged `Done when`, performer authority, stable
settlement seat, target stage, target assignee, and exact comment. After author sign-off:

1. post the transition comment;
2. apply/remove the target stage labels;
3. replace the current assignee;
4. read back comment, labels, and assignee.

If a later step fails, return the existing URL and the exact missing mutations. Retry against that
object; never post a duplicate transition comment merely to get a clean run. The compact transition
line is human explanation only — digest never parses it to reconstruct state.
