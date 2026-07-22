# ADR 103 — `nav:refactor` allows model invocation

**Status**: accepted
**Date**: 2026-07-22
**Refines**: [ADR-038](docs/adr/038-verb-is-the-only-door-for-its-deliverable.md), [ADR-072](docs/adr/072-invocation-direction-law-inventory.md)

## Context

`nav:refactor` carried `disable-model-invocation: true`, classifying it as user-only: a human could type `/nav:refactor`, but Claude could not load it through the `Skill` tool. A live attempt to route an already-requested structural refactor through the skill failed before its protocol loaded:

```text
Error: Skill nav:refactor cannot be used with Skill tool due to disable-model-invocation
```

That restriction conflicts with ADR-038's stronger rule: when the agent is already about to produce a structural refactor, the skill must be the door so its verbatim-move, diff, test, and real-app gates travel with the work. The invocation flag prevented that protocol from loading; it did not make the refactor itself safer.

## Decision

Remove `disable-model-invocation: true` from `nav:refactor`. The skill is now invocable by both the user and the model:

- the user may still type `/nav:refactor` directly;
- the model may load it through `Skill(nav:refactor)` when the requested work is a behaviour-preserving structural move;
- the existing skill-owned safety gates remain unchanged: verbatim moves, preview before writes, a test gate after every step, a real-app pass, and a stop below 90% confidence.

This is a narrow invocation ruling, not a marketplace-wide removal of explicit-only skills. Destructive-adjacent or timing-sensitive workflows such as `relay:migrate`, project setup/build campaigns, and the reflect cursor verbs retain their existing invocation policy.

## Rejected alternatives

- **Tell users to type the slash command every time.** This preserves the flag but breaks the verb-only-door rule whenever the model recognizes that a requested change is a refactor and tries to load the protocol itself.
- **Add `user-invocable: true`.** User invocation is already the default and does not permit the `Skill` tool to load a model-disabled skill.
- **Remove the flag from every explicit-only skill.** The observed conflict belongs to `nav:refactor`; other workflows have different side effects and timing constraints.

## Consequences

- `nav:refactor` moves from README's User-invoked bucket into the model-invoked nav list.
- The nav plugin releases as `0.11.0`: this adds an invocation path while preserving the refactor protocol.
- The generated Codex skill no longer receives an explicit-invocation-only compatibility paragraph, and the Codex capability inventory drops `nav-refactor` from that consumer set. Its short Codex description was reviewed and remains an accurate trigger, so it does not change.
