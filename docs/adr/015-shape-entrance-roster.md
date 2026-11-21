# ADR-015 — Shape and Seek entrances

Status: accepted · updated 2026-11-21

## Decision

Shape has four verbs in this trial. Add captures an idea, defines planned work or
updates its original record, including a session save. View reads current progress,
priorities, blockers and next actions without changing state. Next independently
loads the necessary state and advances already-authorized ready work; it does not
require View first. Tend connects the selected repo/home and performs scoped
maintenance. An idea or priority never grants implementation authority.

Seek holds four small independent methods: elicit, mockup, probe and dogfood.
They can finish in chat or scratch. Their placement does not require a workflow
sequence, persistent record or automatic invocation. Nav owns engineering and shipping.

Records keep the existing workspace schema. Default to updating the original task.
Save independent ideas/thoughts when requested or useful beyond a single task. Retain
a comparison or experiment's full artifacts only for a requested save or concrete
future reproduction. No existing workspace is migrated or cleaned as a side effect.

## Evidence and alternatives

The previous ten-entry roster made separate status and wrap steps overlap on one task.
Bounded fresh-agent DAW trials showed a session stop could incorrectly pause a task;
the merged Task explicitly preserves its status. Real-use, connection and maintenance
comparisons worked with brief protocols and directly, so they do not justify many
always-visible entrances. Next addresses cross-task continuation and remains a pilot.

A single decision orchestrator was considered, then rejected in favor of directly
usable methods. A four-skill full-method comparison did not establish a general
advantage over brief instructions or direct execution. Seek therefore uses short
methods and keeps benefits provisional rather than claiming validated necessity.

Rejected alternatives include an automatic session cursor, mandatory new documents
for every phase, and treating recorded priority as permission. Existing user choices,
human acceptance, legacy context and untracked evidence remain explicit constraints.

## Three-entrance rebuild verification (prior version)

Shape 0.36.0 and Seek 0.1.0 were generated for Claude, Codex and Cursor. Three fresh
`gpt-6.2-sol` sessions at medium reasoning exercised the final Shape entrypoints in
isolated repositories. Task verified a working change and saved only the original
task, retaining active status and the owner's listening gate. Next skipped a blocked
higher priority, fixed and tested the approved gain behavior, then stopped after the
requested one item. Tend reused the matching repo among same-title registrations,
updated the generated instruction owner, and preserved every file/date on repetition.
The session independently inspected diffs and reran the gain test. These are integration
smokes, not an ablation or proof of a general skill advantage.

The compatibility validator reported 16 skills; 49 Node tests and 31 workspace-reader
tests passed. The catalog was driven at 1280×900 and 390×844, including node selection,
Chinese descriptions and the four-plugin count. The reader's historical source path
remains available to existing clients without exposing another skill entrance.

## Four-entrance trial

The owner selected Add, View, Next and Tend after trying to place idea capture inside
the merged Task entrance. Task/Track obscured the distinction between writing and
looking. The previous three-entrance tests establish bounded execution and record
preservation, not that one combined entrance is easiest for the owner to summon.
The four-entrance trial makes that intent visible and keeps progress saves within
Add and the already-authorized execution flow, without restoring a Wrap entrance.
The workspace schema and existing records are unchanged.

Shape 0.37.0 was exercised by four fresh `gpt-6.2-sol` sessions at medium reasoning.
Add saved a new idea, queued a separate unauthorized planned task and updated the
original active task, preserving its human listening gate and project priorities.
View reported blocked/ready work and the known test failure without changing any
project file. Next independently skipped a blocked priority, fixed and tested only
the approved gain behavior, and stopped at the one-item bound. Tend reused the real
registration, edited the generated instruction source and verified an unchanged
repeat. The session independently checked repository diffs, byte-compared View's
files with their baselines, checked new record types/authorization and reran the gain
test. Compatibility reported 17 skills; 49 Node tests and 31 reader tests passed.
These checks cover bounded behavior, not the owner's long-term ease of choosing
among the four entrances. The four-entrance arrangement remains a usability trial.
