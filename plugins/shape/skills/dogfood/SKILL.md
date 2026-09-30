---
name: dogfood
description: "Use a built feature through its real browser or CLI workflows to find friction and missing intent coverage. Use for dogfood 一下, 用起來怪怪的, or checking real usage; undecided comparative claims belong to /shape:probe."
---

# Dogfood — use the feature, improve its design

Drive the real interface against user intents and return findings tied to actual
requests, responses, or screenshots. A demonstration output is evidence about the
tool; improving that output is a separate task unless the user requests it.

## Workflow

1. **Anchor the target.** State the tool/feature and what this run must reveal about it.
   Build a short intent list from the user's purpose. Reuse an explicit goal instead of
   asking again; keep that goal when the conversation shifts to demonstration feedback.
2. **Establish scope and conditions.** Account for destructive/external effects and paid
   paths before driving. Honor existing approval for the same scope, use the cheapest
   sufficient representative setting, and ask only for missing authority or material cost.
   A full-cost finale is not automatic. Read `references/dogfood-protocol.md` for detailed
   capture, findings, and examples, and `references/development-artifacts.md` before
   writing artifacts or changing Git state.
3. **Drive and capture.** Use the real browser, CLI, or endpoint with representative data;
   docs and imagined usage are not execution evidence. Capture friction points and dead
   ends, rather than every routine step; record video only when requested. Provide a
   usable result/comparison when firsthand human assessment is needed.
4. **Attribute findings.** Tie every friction or missing path to its intent and capture.
   Distinguish tool design, agent misuse/knowledge, demonstration quality, and harness
   artifacts. Reconfirm apparent problems at realistic viewport/data conditions before
   proposing a product change. Unreproduced findings remain unresolved: record the observed
   symptom separately from suspected causes until evidence supports an attribution.
5. **Report against the target.** Show what worked, friction, missing intents, interventions,
   and unrun checks. Explain what each finding implies for the tool's design. Stop when
   the intended evidence is sufficient; polishing a song, document, or demo indefinitely
   does not extend the tool evaluation.

## Gates

- **Assisted use versus independent observation.** In normal user assistance, disclose a
  known problem promptly. Withhold hints only in an explicitly agreed independent or
  blind trial, record interventions, and label coached results separately. A dogfood
  request alone does not authorize making the user repeat work to test an agent.
- **Evidence before product changes.** Dogfood reports findings. If the broader request
  already includes fixes, return to the execution workflow after confirming the cause;
  otherwise stop with the report. Better demo quality alone does not prove a missing API.
- **Scope follows intent.** Report declined/unavailable intents honestly. A diagnosis or
  preference pick does not authorize implementation, reprioritization, or a new paid run.

Frontend driving uses shape's browser-verify slot (default `agent-browser`, with the
project's override). If unavailable, use an available project-bound equivalent; otherwise
report the blocked check and ask only for missing installation authority or scope.

## Continuation

Complete already-authorized follow-up work without a generic approval menu. Unresolved
choices can use shape-elicit or shape-mockup; shape-align owns priorities, nav-do small
decided fixes, and nav-plan substantial builds. No automatic companion invocation.

Explain the outcome in the user's language, leading with the point and adding technical
detail only where it helps judge the evidence.
