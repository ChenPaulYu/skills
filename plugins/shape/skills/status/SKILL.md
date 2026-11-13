---
name: status
description: "Recover current project work and next actions from original records and fresh code evidence. Set priorities only when explicitly requested; reading status never authorizes implementation."
---

# status — load the working picture

Read `references/workspace-records.md`. Locate the project and mapped repositories;
report standard records, non-standard readable records, or absent evidence. Read its
priorities, open tasks and linked decisions/probes/ideas without promoting saved ideas
or inconclusive probes into approved implementation.

Read `references/record-interface.md` when presenting records. Use the optional bundled
workspace launcher (commands in that reference) for JSON; an explicitly requested graph uses `view PROJECT --output
<fresh-file-outside-home-repo>` and returns a disposable offline HTML snapshot. Serve
private views on localhost and provide a URL; data is a snapshot, not a new state owner.
Read its diagnostics. Export does not authorize editing the source records.

## Reconstruct before deciding

Check existing baton.md/HANDOFF.md as well as readable plan/TODO records when there is
no mapped workspace or when they retain unique live context. Read
`references/session-handoff.md` for legacy locations and fields. If both notes exist,
inspect both and report conflicts; do not migrate, overwrite or discard either.
A missing note falls back to readable records, then files/Git; name that fallback.
A SHA mismatch means potentially stale; matching HEAD does not account for dirty work.

Inspect current files, HEAD, staged/unstaged diffs, untracked work and relevant history
in the explicitly mapped code repos. A delete/add pair may be a move. Commit titles
and a successful build alone do not establish completion. Enrich with recorded intent
and rejected approaches; label inference, missing reasons and unknown state honestly.

Lead with where work stopped and an executable next action. Distinguish implemented,
verified, blocked, deferred and unknown. Preserve simultaneous open tasks; do not reduce
a project to the latest conversation. Mention rejected approaches as closed choices.

## Priorities require an explicit request

A plain status request is read-only. When the user also asks to choose now/next/later,
verify carried work, reuse their existing priority decisions and ask only for missing
choices. Show the intended delta; update project.md priorities or the original legacy
board, preserving all still-live work and explaining deferred/cut items. Do not silently
normalize legacy documents. For legacy board detail, read `references/legacy-priorities.md`
and `references/legacy-blueprints.md`; migration remains separate explicit work.

A resumed implementation needs the user's scope. No new checkpoint, state file or handoff
is created. Keep existing handoffs while reasons/work remain live; retirement belongs to
a separately authorized tidy after durable transfer and recovery checks.
