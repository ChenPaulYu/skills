# ADR-156 — Topic-owned ADRs, edited in place

Status: accepted · 2026-11-18

## Decision

An ADR exists to stop a rejected alternative from being re-proposed. Write or
update one only when alternatives were weighed and a later session would
plausibly propose the rejected one again. Other changes explain themselves in
the commit message.

One ADR owns one topic. When the decision changes, edit that ADR in place so it
states the current decision and its reasons. Git keeps the history. A new number
is for a new topic, not for revising an old one. Statuses are `accepted`,
`trial` and `retired`.

ADRs 001–155 predate this rule and stay as written. When a topic next changes,
fold its live ADRs into one topic ADR and mark the old files `retired` with a
pointer. There is no mass migration.

`docs/observations/` is closed to new entries. A correction goes to the skill or
CLAUDE.md it fixes; a pattern with no clear owner becomes a workspace idea.
`docs/findings/` and `docs/out-of-scope/` are unchanged.

## Evidence and alternatives

By 2026-11-18 the repo held 155 ADRs, 20 of them from the previous seven days,
and 21 of the last 40 commits touched `docs/adr/`. Rules required an ADR for
every new skill, rename and shared-rule change, so ADR count tracked commits
rather than decisions. 87 ADRs had no reference from any skill, plugin guide,
root guide or README, and skill bodies cited 5. Reading one current rule could
require following a chain such as ADR-152 → 153 → 155. Observations stopped in
August with 64 of 86 still `raw`, because corrections already went straight to
their destination.

Append-only supersession suits audited team records. Here the readers are the
owner and agents, who need the current rule; Git already preserves its
evolution. Deleting the ADR directory outright was rejected because some
decisions do recur as proposals (for example, reinstating a reviewer sub-agent,
ADR-123). Review on 2027-02-18: if no ADR has blocked a repeat proposal by then,
move reasons beside their rules, rejected proposals to `docs/out-of-scope/`,
and freeze `docs/adr/`.
