---
date: 2026-06-24
status: raw
---

# a relay member can hold more than one role; `project.yml`'s `<handle>: <role>` should document the list form, and consumers must read roles list-aware

> **TL;DR**: `/relay:register` and `launch` document a member as `<handle>: <role>` — a scalar. But real membership is multi-role (e.g. an owner who is also the primary developer). YAML expresses this as a list (`<handle>: [owner, developer]`), and because relay skills are agent-read markdown (not a rigid parser) a list "just works" — but only if the skill *says so* and the consumers (settle's owner-check, `@role` routing) are told to read it list-aware. Undocumented, the agent has to improvise whether a list is safe.

## What prompted it

Assigning a project owner who is also the lead developer. The skill's scalar `<handle>: <role>` had no documented way to say "both," so the safety of `[owner, developer]` had to be reasoned out on the spot.

## The signal

The fix is small and locatable: in `register` Step 3 / `launch`'s `project.yml` shape, document that a role may be a single token **or a list**, and add a one-line note that role-consumers must be list-aware:

- `settle`'s "is the runner owner?" check → `owner ∈ roles`, not `roles == 'owner'`.
- `@role` routing (`@developer`, `@owner`) → a member matches if the role is in their list.

Cheap because the consumers are agents reading the YAML, not brittle code — but worth stating so the behaviour is intended, not improvised per session.

## Evidence so far

- **Only case (2026-06-24, project setup)**: `boyuchen: [owner, developer]` written; safety inferred from "skills are agent-read," not from any documented rule.

(One case → stays `raw`. Promote when a second project needs multi-role, or when a settle/routing run has to interpret a list.)

## Links

- Feeds [ADR-050](docs/adr/050-relay-plugin.md). Skills: `/relay:register`, `/relay:launch`.
