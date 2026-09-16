---
name: catchup
disable-model-invocation: true
description: "Reconstruct where this project's work stopped and what comes next, using its handoff and current evidence. Not a general codebase tour, project reprioritization, or permission to resume implementation."
---

# catchup — recover the current working picture

Tell the user where the work stands and why, even after the conversation is gone.
Summoned, not automatic. Scope the reconstruction to the requested project or area.

Before consuming the handoff, read `references/session-handoff.md` for its location,
five fields, and evidence rules. This bundled reference is shared with shape-park;
neither skill depends on the other being installed.

## Reconstruct, then report

1. Check the existing handoff before reconstructing from scratch. Report the
   location and evidence tier: **standard note**, **non-standard readable note**,
   or **absent**. Compare any recorded SHA with current `HEAD`: a mismatch means
   possibly stale, not useless; no SHA means freshness is unknown.
2. Verify current status with files, git status/diff and relevant history, then
   the project's board or decision notes when available. A matching SHA does not
   account for uncommitted changes. Check staged and untracked work too. A cluster
   of deleted plus untracked files may be a move: inspect the actual layout before
   declaring work lost. Without a note, fall back to readable plan/TODO artifacts,
   then git and files; report which fallback supplied the picture.
3. Enrich with live conversation when present, especially intent and rejected
   approaches. Use current evidence for what exists, not commit titles alone.
   If there is too little signal, say what is unknown; do not invent progress.
4. Report goal, done, now, open, and next in the user's language. Distinguish
   implemented, verified, and committed state. Keep the report decision-level,
   with concrete paths or commands only where they help resume. Mention rejected
   approaches as closed, not as unfinished tasks.
5. Leave the note when any described work is still live or its rationale exists
   only there. It may be cleared only when the described work is verifiably
   finished or superseded **and** any still-relevant rationale is retained in
   durable evidence. A stale SHA or a summary in this chat alone is insufficient.
   If clearing it, report the exact file and whether git can recover it; leave a
   tracked deletion for the project's normal commit. When unsure, retain it.

Apart from that narrowly checked cleanup, this is read-only. Do not commit, change
priorities, or start implementing the reported next action. shape-park saves a new
stopping point; shape-align decides durable priorities with the user.
