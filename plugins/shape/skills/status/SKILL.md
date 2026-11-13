---
name: status
description: "Recover a project's current work and next actions from its task records and fresh code evidence. Reading status is not permission to implement or change priorities."
---

# status — load the working picture

Read `references/workspace-records.md` first. Locate the selected project, report the
evidence tier and repository mapping, then read its priorities and open tasks. Read
linked thoughts, plans, probes, and deferred ideas when they explain this work; do
not treat an inconclusive probe or a saved idea as an approved feature.

When presenting work records, read `references/record-interface.md` for metadata,
opening conclusions and visible Relations. Report missing fields or conflicting
projections without modifying records during a read-only request.

Verify the mapped code repositories with current files, HEAD, status, staged/unstaged
diffs, and relevant history. Commit messages alone do not prove completion. Treat
dirty/untracked files as live evidence; a recorded SHA may be stale even when it
matches HEAD. Reconcile mismatches in the report, without silently editing records.

Lead with where work stopped and the concrete next action. Distinguish implemented,
verified, blocked, deferred, and unknown. Preserve simultaneous open tasks instead
of reducing the project to the last conversation. Explain why a task was paused
when the record supplies it; label missing reasons as unknown.

A status request is read-only. If the user also asks to decide priorities or resume
work, honor that scope after reconstructing the picture; unresolved priority choices
remain the user's. Do not create a checkpoint, board snapshot, or handoff file.
