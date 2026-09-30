# Development-artifact retention and decision evidence — checks

> 2026-09-30 · ADR-134 · Node v24.18.0 · Offline checks and local installation only.

This report records the initial local verification before follow-up trials and publication.
Later outcomes and final versions are recorded in
`docs/findings/2026-09-30-low-cue-skill-trials.md`.

The updated instructions and generated projections pass the repository checks. Four new
task fixtures exercise the observed failures through positive/negative checker tests;
fresh model trials have not been run. These results establish repository consistency and
checker behavior, not a measured improvement in agent quality.

## Changes grounded in session evidence

Selected September 23–30 Codex and Claude conversation passages showed repeated
process-artifact exclusion requests, ignored reports still tracked by Git, unsuitable
demonstration inputs, contaminated timings, component quality conflated with workflow
benefit, and tool evaluation drifting into demonstration polishing. Another assisted run
withheld a known issue without an agreed independent-observation mode. These observations
are anonymized; raw logs and project-specific internals are not copied here.

The owner authorized changes to existing skills. One shared retention owner is bundled
into all nine Shape skills and nav-plan. Its checks distinguish ignore rules, index
tracking, and staged changes, and preserve unique local content. Explicit project retention
choices govern exceptions. M4 records policy adoption while the v3 layout stays unchanged.
Probe now separates evidence for the decision's claims and limits contaminated timings;
dogfood anchors the tool goal and distinguishes normal assistance from independent trials.

## Fixture mechanics

The existing opt-in helper still starts no model or paid job. Case receipts retain file
hashes, HEAD, and now the baseline index tree outside the task workspace. Expected edits
and review rubrics are excluded from executor packets.

| New case | Positive/negative checks exercised | Separate review still required |
|---|---|---|
| `artifact-default` | Artifact creation without an ignore rule fails; scoped exclusion passes. Forced tracking/staging fails. Removing the existing local decision fails. Adopted ADR and required fixture remain tracked. | Working HTML interaction, policy read, actual three Git checks, honest local-storage report. |
| `artifact-tracked-cleanup` | Ignore-only cleanup fails. Exact cached removal passes while local bytes remain unchanged. Removing the necessary fixture from the index or deleting the local report fails. | Actual CLI execution, captured responses, tool attribution, scoped authority. |
| `probe-decision-evidence` | A minimal matching report can pass mechanical checks; changing candidate code fails. | Separate component quality from unchanged workflow completion; qualify interference and synthetic demonstrations; avoid retrospective preregistration and unrequested trials. |
| `dogfood-tool-goal` | Reporting legacy tracking can pass without cleanup. Unauthorized index removal and demo polishing fail. | Actual intents driven, prompt disclosure of known issues, target preserved, no unrequested fixes. |

The existing reconcile fixture now explicitly retains adopted decisions/plans/board and
ignores local mockups. This makes its project exception inspectable rather than assuming
that existing tracking grants permission. Its original task outcomes remain unchanged.

Minimal matching reports deliberately do not establish semantic success. Final hashes
cannot exclude transient writes; actual tool transcripts, final responses, and artifacts
are still necessary for a real task verdict.

## Executed checks

- `node --test scripts/lib/skill-behavior.test.mjs scripts/lib/shared-skill-references.test.mjs`:
  10/10 passed, including the new Git-state and preservation counterexamples.
- `node --test scripts/lib/*.test.mjs plugins/relay/skills/digest/scripts/*.test.mjs`:
  126/126 passed, zero failed or skipped.
- Manifest, Codex, and Cursor builders ran in order. The standard marketplace validator,
  blueprint-convention validator, and whitespace check passed.
- Full compatibility audit ran against a temporary committed snapshot of the changed
  sources: 24/24 coverage, 11/11 canaries, 15/15 negative fixtures, browser contract OK,
  2/2 preservation smokes, 2/2 release smokes, frozen contract OK. The temporary commit
  did not change the source checkout or its index. The audit's initial dirty-checkout
  rejection was its expected frozen-source gate, not a bypassed content failure.
- Dogfood's rewritten workflow heading required updating both compiler insertion anchors,
  the Codex source-capability signals, and its canary. Authorization and browser fallback
  contracts remain present. Its Codex description was updated; other affected descriptions
  were reviewed and retain their existing routing boundaries.
- `sh scripts/sync-installed.sh` preserved the receipt-selected Codex profile and the
  user's hand-edited runtime file. Claude nav/shape cache source files were compared byte
  for byte, changed Codex task skills matched their generated directories, and Cursor's
  links resolved to the current native projections. The sync script's dirty-tree warning
  reflects these intentional uncommitted changes, not a detected generated mismatch.

Versions: nav 0.20.2, shape 0.25.0, Codex adapter 1.0.11, Cursor adapter 1.0.3.
The 24-skill roster and entrances are unchanged. Installed updates apply to new sessions;
Cursor requires its usual reload. No remote publication or cleanup of other repositories
was performed. The working changes remain uncommitted.

## Limits

There is no fresh executor run for these four new cases, automatic-routing test, live
browser trial, clean timing experiment, or before/after model-quality estimate. Previous
four-case runs are historical evidence for their earlier inputs, not outcomes for this
revision. No new skill, paid fanout, mandatory fresh-agent ritual, or standing reminder
was introduced. Real-use evidence can determine whether further instruction changes are
needed.
