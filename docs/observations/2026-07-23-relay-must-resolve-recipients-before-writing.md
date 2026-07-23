---
date: 2026-07-23
status: promoted
---

# Relay must resolve a recipient from attested identity data before creating an owned object

> Source: A `relay-report` session that needed to send a standalone tell from a project repository into the shared Accord repository.

## What prompted it

The agent correctly classified the message as an assigned Issue, but the project repository did not contain a `relay.yml` mapping the human-facing recipient to a GitHub account. It guessed `GreenTed`, then `Rytho`, before the user corrected the intended account to `rythocorp`. The agent also initially created the Issue in the project repository instead of Accord, requiring deletion and recreation.

## The signal

`relay-report` currently requires a concrete owner but does not define a safe recipient-resolution protocol. That makes the strongest part of the Accord model, native ownership, depend on an unaudited username guess.

At the point where `report` distills the owner, it should:

1. Resolve the Accord repository using the established repository-resolution chain.
2. Read that repository's `relay.yml` or another explicitly documented, attested roster when one exists.
3. Match the user's human-facing name or role to the GitHub account in that roster.
4. If no mapping exists or more than one match remains, stop before preview or creation and ask the user to name the GitHub account.
5. Never infer a recipient from display-name similarity, an organization name, or a previously seen handle.

The same resolved repository must be used as the creation target unless the user explicitly names another repository. Recipient resolution and destination resolution are one preflight check: both must be known before the author-signoff preview.

## Evidence so far

- **Only case (2026-07-23, standalone Ricercar tell)**: Missing recipient mapping led to two incorrect handle guesses and an Issue created in the wrong repository. The user corrected both the destination (`Accord`) and the account (`rythocorp`).

Promoted in the Relay 2.2.0 change: the shared contract now owns default-workspace and identity resolution, `launch` owns the local workspace pointer plus PR-gated roster initialization, and `report` must resolve both before author sign-off.

## Likely destination

- `plugins/relay/CLAUDE.md` — canonical workspace resolver, roster schema, and no-guess law.
- `plugins/relay/skills/launch/SKILL.md` — verified local default plus reviewed roster initialization/update.
- `plugins/relay/skills/report/SKILL.md` — destination and recipient preflight before object creation.
- `docs/adr/101-relay-attested-reference-roster.md` — ratified ownership and state/reference/config boundaries.
