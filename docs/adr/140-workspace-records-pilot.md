# ADR-140: Trial task-owned workspace records before retiring session entrances

Status: Accepted for an opt-in branch pilot; not a global migration.
Date: 2026-11-13

## Problem

A growing board mixes deferred ideas, decisions, execution state, and session
handoffs. Repeatedly copying progress into a board and a handoff creates competing
answers to where the work stopped. Git records code changes but rarely preserves
the reason a task paused or the exact unverified next action.

## Decision

Trial `project.md` plus linked Markdown records in an explicitly located workspace.
Tasks own progress, verification, blockers, and next actions. Projects own context
and user-chosen priorities. Typed links support idea → thought → mockup or probe →
task → plan, without making every stage mandatory. Graphs and active views derive
from the records. A private home repo can retain working text separately from a
public code repo; each storage owner's policy still governs.

Add three entrances for the pilot:

- `idea` captures a spark, including deferred possibilities, without authorizing work.
  It does not absorb `elicit`, which resolves a particular uncertainty.
- `status` reconstructs all live work from task records and actual mapped repository
  evidence. A read request changes neither priorities nor implementation.
- `wrap` saves the round into the original touched tasks. It creates no extra handoff.

The shared record convention lives in `plugins/shape/references/workspace-records.md`
and is bundled into these entrances. Existing align, park, and catchup remain
available for legacy projects during the pilot; they are not silently remapped or
deleted. This temporary roster is not the intended final count. Only after an actual
project can pause, save, and resume using fresh-agent evidence should their roles be
replaced, aiming for idea, elicit, mockup, probe, dogfood, status, wrap, reconcile.

## Boundaries and acceptance

Trial one real project. Preserve its existing blueprint files, binaries, and history;
do not mass-migrate records or publish private evidence. Missing or unconventional
records get a reported fallback, not a mandatory schema repair. A completed task does
not retire an adopted decision; a concluded probe may be inconclusive and create no
implementation authority. Reconcile remains the cleanup entrance, not a new recycle
or graduation ceremony.

Acceptance requires fresh code evidence, multiple paused tasks surviving a wrap,
and an isolated fresh Codex session resuming from the original records without chat
history or a new checkpoint. Machine-local activation and retiring old entrances
remain subsequent rollout decisions, not side effects of editing this branch.
