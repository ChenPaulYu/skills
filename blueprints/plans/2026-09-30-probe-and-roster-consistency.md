# Probe and source-roster consistency — plan

> Generated: 2026-09-30 · Grounding: `95ceba0` · Owner-authorized implementation and bounded follow-up trials

Status: complete. The bounded trials finished with mixed outcomes; a second retention
gate correction has offline verification only.

## Context

Probe's body admits existing measurements, but its reference still universally requires
preregistration and a new cost nod. Codex/Cursor namespace conversion enumerates all
skill directories, while emission and the public catalog require SKILL.md. A retired
empty directory caused the staged snapshot to disagree with local generation in ADR-134.

## Approach and critical files

1. Update `plugins/shape/skills/probe/SKILL.md` and its protocol: distinguish existing
   evidence from new trials; report absent original criteria honestly and carry existing
   authorization forward within the same paid scope. Keep experimental design gates.
2. Expose the catalog's existing source-directory predicate from `scripts/lib/catalog.mjs`.
   Adopt it in both builders for namespace membership and emission; empty/resource-only
   directories and non-file SKILL.md entries cannot register a skill. Preserve ordering
   and active-skill behavior. Add regression coverage for the observed discrepancy.
3. Bump Shape and both adapter releases, regenerate owner-derived surfaces, and run
   focused/full offline and compatibility checks. No new skill or evaluation service.
4. Freeze the corrected pack. Reuse `probe-natural` and `artifact-natural`; add a natural
   two-turn dogfood case over the existing CLI fixture. Store receipts/rubrics outside
   execution workspaces and retain anonymized outcomes in `docs/findings/`.

## Preregistered verification

- Source registration: empty and resource-only directories leave emitted files and
  namespace conversion unchanged in Codex and Cursor; a real added skill remains visible.
- Existing measurements: actual probe-body selection; no fabricated preregistration,
  new trial, product/index change, or force-tracking. Assess completion/quality/timing
  separately and qualify synthetic inputs. A semantic pass is separate from routing.
- Artifact retention: new mockup and existing local thought both ignored; unique local
  records, adopted ADR, and required fixture preserved; inspect the three Git sources.
- Dogfood: real CLI evidence; disclose the documented missing path in normal assistance,
  report legacy tracking without cleanup authority, and keep the tool-evaluation target
  when the follow-up criticizes demonstration quality. No product/demo edits or fabricated
  stateful success. Inspect both turns and final files/index personally.

Three fresh gpt-6-luna contexts, four execution turns maximum. This is an unblinded,
single-sample post-repair check with host metadata still present, not a causal quality
estimate or selection reliability rate. No automatic extra paid repetitions.

## Completion

Required offline checks pass; each observed model outcome and limit is recorded, including
failures. Synchronize installed copies and verify source bytes. Keep implementation and
acceptance on the session; workers own only their disposable task workspaces.
The earlier commit/push request was completed for the previous change. After reviewing
this implementation, the owner separately authorized its commit/push and machine install
refresh; those steps add no further model trials.

## Completion evidence

Focused tests 20/20 and the full suite 128/128 pass. Generator residue invariance is
verified in real Codex/Cursor runs, and marketplace/blueprint/compatibility checks pass.
The three contexts used four gpt-6-luna turns. Existing-measurement routing passes this
sample; artifact-tree coverage fails; dogfood continuity is partial and its capture
allowlist required a fixture correction. Preserve original outcomes and the independent
corrected recheck. A sharper shared retention gate is not retried through the model.
Evidence and limits: `docs/findings/2026-09-30-probe-and-roster-followup.md`.
