# Low-cue skill trials — observed outcomes

> 2026-09-30 · ADR-134 follow-up · Eight fresh gpt-6-luna executions; one rejected setup.

These trials found concrete retention and routing defects. They do not show that the
whole skill pack improves model quality. The final instruction repairs passed offline
checks; no post-repair model repetitions were launched.

## Method and preregistered criteria

The owner authorized the follow-up and selected gpt-6-luna. The session model retained
design, artifact inspection, transcript review, and acceptance. Executions ran serially
in separate Git projects with fresh contexts and no parent conversation, expected edits,
or acceptance rubric in worker packets. Ordinary task scope, output paths, no-commit
instructions, and final verification commands were kept in both conditions.

Three natural task prompts remove reminders about exclusion, tool-versus-demo goals,
known issues, and measurement contamination. The skill condition receives the complete
frozen 24-skill pack and chooses its relevant body. Controls have no packaged bodies and
are instructed not to read bodies/references elsewhere. Host metadata and standing
instructions remain available, so this is an unblinded body-ablation exercise, not a
fully skill-free environment. Read paths were checked in actual session tool logs.

Before execution, the plan named the criteria: process artifacts ignored/untracked and
unique content preserved; real CLI evidence tied to the tool goal; component quality,
workflow completion, and confounded timing interpreted separately. Mechanical checks,
semantic task outcomes, body reads, and routing are reported separately.

The first control setup accidentally used broad staging while removing the skill pack,
committing a formerly untracked local note. Reject that comparison rather than counting
it as an agent failure. A replacement used exact cached removal and preserved the note
as untracked. To stay within eight executions, the two routing topics were combined into
one read-only task, overlaying the existing document fixture on the record fixture. This
is one combined-context sample, not two independent routing trials.

## Outcomes

| Task | No-body control | Skill-pack condition | Session verdict |
|---|---|---|---|
| `artifact-natural` | Created HTML but added no exclusion. Corrected control preserved the local note. In a separate browser check, selecting the second sort mode left the item order unchanged because the sample's two orders coincided. | Read shape-mockup and its references. Ignored the new mockup, ran three Git checks on that output, and served a preview. Browser selection visibly changed order and switching back restored it. The existing local thought remained unignored. | Both fail the complete retention fixture. The skill run improves the requested output's storage and observable comparison in this sample, but applies the tree policy incompletely. The coincident sample orders are a demonstration limitation, not proof of broken sorting code. |
| `dogfood-natural` | Ran list/archive/find/restore/help, reported fixed responses and a missing find command, and preserved code/demo/index. | Read shape-dogfood and its references, exercised the same intents and an additional list check, and distinguished success-shaped responses from a stateful round trip. Preserved code/demo/index. | Both pass mechanical checks and keep the tool goal. Both omit the legacy tracked-report exception. The skill run inspected that report but checked tracking only for its newly created output. Neither report establishes broad real-user workflow success. |
| `probe-natural` | Correctly withheld adoption: completion stayed 8/10, component score rose 0.86 to 0.94, timing was confounded, and the toy example did not establish representative benefit. Wrote an ignored report without index changes. | Correctly interpreted the same data but selected nav-compose, explicitly treating shape-probe as inapplicable to existing measurements. Used `git add -N -f` to expose the ignored report in diff/status. | Control passes the mechanical fixture; skill-pack run fails tracking. This is a routing/storage defect, not a valid comparison of the probe body: that body was never loaded. No incremental reasoning benefit was established for this small data set. |

The combined routing run chose shape-reconcile and nav-sync from the local pack without
the user naming either. It distinguished implemented retry facts, a governing rationale,
pending offline work, stale current reader docs, historical design, and planned YAML.
All files, HEAD, and the index remained unchanged; tool logs contain no writes, test run,
or generator invocation. It used static implementation/test inspection. The session
independently ran the retry test afterward: 1/1 passed.

The routing report's source anchors were partly wrong: it used cumulative offsets from
`nl -ba` across multiple files as if each were a per-file line number. The substantive
findings still matched the files. Separately, the no-body dogfood final message claimed
an untracked directory, although the captured status output and independent check were
empty because the report was ignored. These are reporting defects, not fabricated
product changes. Both remain recorded rather than concealed behind a mechanical pass.

No trial made the user manually repeat an action, so this batch does not establish the
timeliness of disclosure in an interactive assisted session. No unreproduced transient
product symptom was exercised; the attribution repair below addresses an already
identified instruction error rather than an observed trial success.

## Repairs adopted

- **Retention-tree coverage:** the shared owner now checks existing local records in the
  policy-covered artifact tree, retains explicit deliverable exceptions, and reports
  tracking without implicitly authorizing index cleanup.
- **Probe routing:** native and Codex descriptions explicitly admit assessment of existing
  measurements. The body distinguishes that branch from authorized new trials; asking
  for a written assessment does not make the empirical decision a prose-only task.
- **Compose storage:** bundle the same retention owner into nav-compose and load it before
  process notes/experiment assessments. Verify an ignored file directly on disk instead
  of changing its retention to make a diff visible.
- **Unresolved attribution:** dogfood records an unreproduced symptom separately from
  suspected causes; failure to reproduce does not establish a harness cause.
- **Source anchors:** nav-sync's detailed protocol requires per-file numbering and verified
  anchors; cumulative offsets from a combined dump are not original-file locations.

The fixture catalog now has 12 opt-in cases, including three natural-prompt variants and
a read-only record case. The initial coaching-heavy cases remain useful for explicit
scope/cleanup regression. The combined routing overlay is described above; it is not an
additional independently executed case. No new skill or automatic evaluation job exists.

## Verification and installation

The eight executions used the pre-repair frozen pack (nav 0.20.2 / shape 0.25.0), not the
subsequently changed bodies. The preserved receipts and tool logs were inspected against
their actual files/index; force intent-to-add was caught as tracking. Browser interaction
checks used the two resulting HTML files without screenshots, then closed the browser.

The final offline suite passed 126/126, with zero skipped. Manifest, Codex, and Cursor
generation and the marketplace/blueprint/whitespace checks passed. A temporary committed
snapshot verifies the full compatibility audit, leaving the source checkout/index intact.
Installed copies are refreshed through the existing sync ritual and checked against
their source projections. Final versions are nav 0.20.3 and shape 0.25.1; the existing
adapter releases and 24-skill roster are unchanged by this follow-up. Verification left
the source index intact; the owner subsequently authorized committing and pushing the
verified changes. No further model executions are part of that publication step.

The staged-snapshot hook caught one publication-time discrepancy: leftover local empty
directories let the generators normalize a retired skill name differently from a clean
checkout. The migration ledger now spells its historical reference as `shape-baton`
directly; the platform mirrors were regenerated and staged validation was rerun.

## Usage and limits

Native session logs identify all eight executions as gpt-6-luna. Aggregate reported usage,
including the rejected setup: 2,210,759 input tokens, of which 2,064,128 were cached, and
24,455 output tokens. Cached input is a subset, not an additional token total. These are
reported units, not a monetary estimate. Raw transcripts and machine-specific locations
stay outside the public repository.

There is one valid sample per paired condition, no randomization, no blinding, no isolated
host metadata, and no post-repair model run. The combined routing result cannot establish
automatic-selection reliability. CLI data are a deliberately small synthetic stub, not a
representative product workload. No performance benchmark, broad quality rate, or reason
to retire a skill is inferred from these observations. The corrections are grounded in
the failures above; their future behavioral effect remains to be observed.
