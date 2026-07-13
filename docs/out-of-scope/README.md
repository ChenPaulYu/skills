# Out-of-scope — rejection ledger

> **Why this exists**: a mechanism for institutional memory of what was proposed and **rejected**, so a future session (agent or human) doesn't re-litigate a closed question from scratch. Adopted from the `mattpocock/skills` precedent of a `.out-of-scope/` directory. Rationale: [ADR-066](docs/adr/066-out-of-scope-rejection-ledger.md).

## The hard rule: deferral ≠ rejection

**A deferred item does not belong here.** "Not now, later" and "no, and here's why" are different facts with different owners:

- **Deferred** — parked in the plan/ADR that deferred it (e.g. a plan's own "Out of scope (deferred)" section, or an ADR's "Consequences"). It stays open; a future session may pick it up without needing to argue against anything.
- **Rejected** — a proposal that was considered and turned down for a stated reason. **This** is what gets a file here. Re-proposing it should require addressing the stated reason, not just re-asking.

If you're unsure which one you're looking at, check the source's own language: "revisit later" / "not in this pass" / "future work" = deferred, stays where it is. "Rejected" / "we chose not to" / "considered and turned down" = belongs here.

## Format — one file per rejection

Each rejected proposal gets its own file, named `docs/out-of-scope/<short-slug>.md`, with these fields:

- **Rejected proposal** — one line naming exactly what was proposed.
- **Reason** — why it was turned down, in the source's own words where possible.
- **Source** — the ADR / issue / session this was decided in, with a verbatim quote and a path (so a reader can verify the rejection actually happened, not just trust the ledger's paraphrase).
- **Date** — when the rejection was made (not when the ledger entry was written, if different).

## Consuming this ledger

Before proposing a new skill, a new mechanism, or re-opening a design question, check this directory first (root `CLAUDE.md`'s "New skill" maintenance rule points here). Finding a match doesn't forbid re-proposing it — it means the re-proposal should engage with the stated reason, not silently repeat the original pitch.

## Entries

- [`skills-dont-invoke-each-other.md`](docs/out-of-scope/skills-dont-invoke-each-other.md) — literal skill-to-skill invocation (auto-call), rejected in favor of offer + reuse-via-transcript.
- [`changesets-release-automation.md`](docs/out-of-scope/changesets-release-automation.md) — Changesets-based release automation, rejected as low-yield for this repo.
