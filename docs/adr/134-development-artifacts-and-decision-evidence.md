# ADR-134 — Keep process artifacts local and test the decision's claim

> 2026-09-30 · Status: accepted · Supersedes the committed-by-default process-artifact
> policy in the blueprint/mockup convention; v3 layout and skill entrances unchanged.

## Context

An owner-authorized review of September 23–30 local Codex and Claude development records
found repeated corrections with transferable causes:

- Several product repositories accidentally tracked experiments or dogfood evidence.
  One already had an ignore rule, but previously tracked reports still reached Git.
- Shape's blueprint/mockup references prescribed committing process artifacts, contradicting
  the owner's repeated local-retention instructions.
- A toy input did not expose the difference the owner needed to judge. Another trial's
  elapsed times were contaminated by simultaneous compilation/testing. Better component
  accuracy was also treated as proof of workflow value without measuring that claim.
- A tool-design evaluation drifted into polishing its demonstration output. A known issue
  was withheld to observe an agent, making the owner repeat work without an agreed blind trial.

These are anonymized observations from selected conversation passages, not a census of
all sessions, verified performance numbers, or proof that every skill invocation failed.
The owner confirmed exclusion as the default and authorized these existing-skill changes.

## Decision

### Retention has one owner and follows purpose

`plugins/shape/references/development-artifacts.md` owns the policy. The existing manifest
builder bundles it into all nine Shape skills, nav-plan, and nav-compose, making each directory standalone.
Bodies point to it before artifact writes/cleanup rather than restate its full procedure.

Without an explicit user/project exception, blueprints, mockups, dogfood captures, and
one-off experiment scripts/results remain local and Git-ignored. Maintained product docs,
adopted ADRs, reusable examples, regression tests, and necessary fixtures are judged by
their role. Existing tracking alone neither grants retention authority nor authorizes cleanup.
This marketplace's maintained doctrine remains governed by its explicit repository rules;
this change is not a bulk untracking operation on this or other repositories.

Check ignore rules, tracked content, and staged additions/updates independently. Authorized
cached removal preserves disk content; report legacy tracking when cleanup is not authorized.
Preserve unique local material and inbound references. Git recovery is a claim to verify,
not a property of every file on disk. Local retention is not cross-machine backup.
M4 records policy adoption without changing the v3 structural fingerprint.

### Probe measures the claim under comparable conditions

Separate correctness, output quality, and workflow value. Choose representative inputs
for real-use decisions, expose demonstration selection, and deliver an inspectable
comparison when human assessment matters. Timings require comparable competing load,
warmup/cache/startup states; interference limits the result rather than proving a winner.
Fresh-agent trials remain an option for the relevant uncertainty, not a mandatory ritual.
Preregistration applies to new trials, never retroactively to previously observed data.

### Dogfood stays anchored to the tool

Name the tool and evaluation goal, drive real intents, and distinguish tool design, agent
misuse, demo quality, and harness artifacts. Normal assistance discloses known issues;
agreed independent observations log interventions and distinguish coached outcomes.
Stop when the intended evidence is sufficient. Broader authorized fixes continue through
execution workflows; a demonstration alone does not create a new implementation mandate.

## Verification and limits

Four new cases extend the existing opt-in fixture system: local artifact defaults,
ignored-but-tracked cleanup, probe evidence limits, and assisted tool evaluation.
The checker adds Git-specific outcomes; negative tests require cached removal to preserve
local bytes and reject forced staged additions or removal of necessary fixtures.
Semantic rubrics remain outside worker packets and require transcript/artifact review.

The owner-authorized low-cue follow-up adds natural-prompt variants. An observed partial
application (new output ignored, existing records unchecked) sharpens tree-wide policy
coverage without granting index cleanup authority. A routing miss makes existing-measurement
assessment explicit in probe's description and bundles retention into compose as well.
Unreproduced dogfood symptoms remain unresolved until evidence supports a cause. Document
sync's reference clarifies per-file anchors after a cumulative-line-number error. Trial
outcomes and body-ablation limits live in `docs/findings/2026-09-30-low-cue-skill-trials.md`.

Actual commands and results are recorded in
`docs/findings/2026-09-30-development-artifacts-and-evidence-checks.md`. Offline checks
exercise fixture mechanics and generated instructions, not fresh model behavior, automatic
routing, broad reliability, or a measured before/after improvement. Paid model trials
remain opt-in; no new skill or standing reminder is introduced.
