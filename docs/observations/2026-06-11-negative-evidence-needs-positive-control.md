---
date: 2026-06-11
status: raw
---

# "0 hits" is the most dangerous evidence shape — mechanical checks need a positive control before negative verdicts act

## What happened (twice in one session, TrackMate testbed)

1. **reconcile / audit dead-module sweep**: a grep-based inbound-import scan reported **every file** as 0-inbound. Cause: `grep` aliased to `ugrep` with different semantics. The agent noticed the absurdity (everything dead) and discarded the round — survivable because the false negative was *implausibly broad*.
2. **audit's dead-file verdict**: a *targeted* dead-code check (`grep -rn "<component-name>" … | grep -v` after a `cd` that had silently failed — the harness resets cwd between Bash calls) returned zero references → reported as a ❌ violation → user approved → **`git rm` executed**. Only the typecheck gate (a module-not-found error — the engine module still imported it) stopped a wrong deletion from shipping. This false negative was *plausibly narrow* — nothing about "one 48-LOC scaffold file, zero refs" looked absurd.

## The signal

audit/reconcile's discipline says *cite evidence* — but evidence from an agent-composed shell pipeline can be silently corrupt (tool aliasing, cwd resets, quoting). The asymmetry: a false **positive** (flagging a healthy file) costs a review glance; a false **negative** ("no references / no citations / no usages") feeds **destructive actions** (delete, prune, retire). The current skill texts treat all mechanical evidence equally.

**Rule candidate: any negative finding that gates a destructive action requires a positive control** — before trusting "0 hits", grep a string you *know* exists (e.g. the file's own name in its own header, or a known importer) through the same pipeline; pipeline returns 0 for the control → the pipeline is broken, not the codebase. Cheap (one extra grep), kills the class. Complementary backstop (which saved this case): destructive acts stay inside verify gates — `git rm` then typecheck before commit.

## Where it could land

- `nav/audit` SKILL.md (mechanical checks note) + `shape/reconcile` (evidence step): one sentence each — "negative evidence gating a destructive action needs a positive control through the same pipeline."
- Both already share the spirit (`mark uncertain rather than assert`); this makes it mechanical for the deletion-shaped case.

## Evidence

- TrackMate session 2026-06-11: discarded all-0-inbound round (disclosed in the audit report's self-eval); the wrong `git rm` reverted in a specific commit ("audit's dead-code call … was wrong — a cwd-broken grep"). Cross-ref: same session's stale-cache observation — third tooling-environment trap of the day (alias · cwd reset · cache).
