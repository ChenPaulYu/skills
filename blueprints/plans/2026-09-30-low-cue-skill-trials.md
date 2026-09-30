# Low-cue skill trials — plan

> Generated: 2026-09-30 · Source: owner-authorized follow-up · Grounding: `fcac75d` plus the verified, uncommitted ADR-134 changes

Status: complete. Eight executions finished; seven valid task runs remain after rejecting
one setup. Findings and instruction repairs are recorded; behavioral improvement after
the repairs remains untested.

## Context

The four ADR-134 fixtures explicitly remind the model of several desired behaviors.
Offline checks verify outcomes and preservation but do not establish spontaneous use.
Dogfood also prematurely assigns unreproduced findings to suspected harness artifacts.

## Resolved questions

- The owner requested gpt-6-luna for execution. Judgment and acceptance stay with the session.
- At most eight independent task runs: three skill-body/no-body pairs and natural routing
  coverage. The body ablation retains the host's ambient metadata/instructions; it
  is not a claim of an entirely skill-free model or a causal estimate of all context.
- Keep ordinary task goals and scope in prompts; remove coaching about exclusion, known
  problems, attribution, and measurement contamination. Rubrics stay outside worker packets.
- This is a small exploratory sample, not a reliability rate. Unexpected findings remain
  recorded; no extra paid repetitions launch automatically.

## Approach

1. Reuse the isolated fixture preparer/checker and preserved project inputs. Add three
   natural-prompt variants and keep their acceptance checks outside the task workspace.
2. Freeze the current skill pack per trial. Run the paired tasks in fresh contexts, denying
   skill-body reads only for the control condition. Run natural record/document tasks
   without naming their desired skill. Preserve final files and reported tool evidence.
3. Inspect artifacts, changes, Git states, and execution evidence personally. Distinguish
   a mechanical pass, correct task outcome, skill read, and routing claims.
4. Fix demonstrated or already identified in-scope instruction problems, starting with
   unresolved dogfood attribution. Update versions/projections, validate, and sync copies.
5. Record actual outcomes and limitations in the maintained findings convention.

## Critical files

- `scripts/fixtures/behavior/cases.json`: natural-prompt task variants.
- `plugins/shape/skills/dogfood/SKILL.md`: unresolved attribution wording.
- Probe's description/body, nav-compose's bundled retention pointer, and nav-sync's
  per-file-anchor reference: corrections grounded in actual task failures.
- `docs/findings/2026-09-30-low-cue-skill-trials.md`: anonymized observations and verdict.
- Plugin manifests and generated Codex/Cursor/catalog copies: consistency and installation.

## Verification

Before runs, preregister artifact exclusion/preservation, real CLI evidence/goal retention,
and correct interpretation of existing measurements as the three decision criteria.
Record early disclosure only when sequence evidence exists. For routing, inspect actual
skill reads; naming a skill alone is insufficient. Rerun fixture checks and relevant tests,
then marketplace/blueprint validators. Keep external scratch transcripts out of this public
repository. Run no further trials without new need and authority.

## Out of scope

Remote publication, changes to other repositories, new skills, benchmark infrastructure,
scheduled model evaluation, or broad reliability claims.

## Execution correction

The first artifact control's setup accidentally staged its previously untracked note
while removing the packaged skill. Reject that run as a comparison; repeat with exact
cached removal of skill files, preserving the original untracked note. To keep the
eight-run ceiling, combine record/document routing into one read-only task. This covers
both boundaries in one context, not two independent routing samples.

## Completion evidence

The session inspected the actual tool logs, files, Git states, and two HTML interactions.
The paired tasks exposed incomplete artifact-tree coverage and an existing-measurement
routing/storage defect; combined routing preserved read-only scope but misnumbered some
source anchors. The full outcomes and limits live in
`docs/findings/2026-09-30-low-cue-skill-trials.md`.

Repairs ship in nav 0.20.3 / shape 0.25.1. The offline suite passed 126/126, the full
compatibility audit passed in a temporary committed snapshot, and marketplace,
blueprint, and whitespace checks passed. Installed Claude/Codex files matched source
bytes; Cursor links target the current generated plugins. No further model trials were
performed. The owner subsequently authorized committing and pushing the verified changes.
