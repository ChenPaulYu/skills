# retrace — evidence gathering + the six-field stage machinery

> Moved verbatim from the pre-ADR-109 SKILL.md body. The SKILL.md Stance carries the operative
> gates (evidence ownership, provenance-label duty, the outline correction gate); this is the
> elaborated evidence-order protocol, the tolerant-reader tiers, the six-field table, the bridge
> tests, and the witness-matching table, loaded on demand.

## Step 1 — Bound the arc and gather evidence

Name the arc in one sentence: its starting state, current boundary, and why the user needs to re-enter it. Prefer one coherent workstream over "the entire repository history." If the request could mean two materially different arcs, ask one scope question before gathering.

Read evidence in this order, tolerating what the project actually has:

1. **Explicit intent** — current conversation and direct user corrections.
2. **Decision record** — ADRs, thoughts, plans, findings, mockups, issue/PR discussion, commit-message bodies.
3. **Shipped state** — git log/status/diff, source, tests, schemas, CLI help, generated artifacts.
4. **Concrete witnesses** — commands and outputs, probe metrics, before/after data, screenshots, diagrams, audio/video, published artifacts.

Treat the project structure as a convention, not a contract:

- **Standard evidence tree** — consume its named decision/plan/finding folders directly.
- **Ad-hoc evidence** — read useful files wherever they live; do not require migration before retracing.
- **Sparse evidence** — reconstruct only what the sources support and mark the rest Unknown.

Capture the real date and current git SHA when available. Self-report the evidence tier in the outline and final artifact so the reader can judge confidence.

## Step 2 — Reconstruct pressure-bearing stages

Build the smallest set of stages that explains the arc. Every stage must contain all six fields:

| Field | Required answer |
|---|---|
| **Prior state** | What belief, design, or implementation entered this stage? |
| **Pressure** | What concrete friction, contradiction, or missing capability made it insufficient? |
| **Evidence** | What source or witness made that pressure inspectable? |
| **Decision** | What response was chosen, and which meaningful alternative was rejected? |
| **Status** | Was it discussed, decided, implemented, verified, committed, deferred, or superseded? |
| **Next pressure** | What remained unresolved and therefore forced the next stage? |

The sixth field is the bridge. Test every bridge:

1. Does the evidence actually support the pressure?
2. Does the decision respond to that pressure?
3. Does the next pressure arise from the result, or are two unrelated threads merely adjacent in time?

If any answer is no, split the stages, reorder them, or label the bridge unsupported. Never use a decorative arrow to hide a missing cause.

### Choose concrete witnesses

For every abstract stage, identify at least one inspectable witness when evidence exists. Match the witness to the claim:

- data-model claim → real before/after fields or types;
- editability claim → a small mutation that succeeds/fails visibly;
- renderer/runtime claim → command + measured output or playable media;
- persistence claim → saved identity/state beside fresh-process restoration;
- decision claim → source excerpt summarized within citation limits and linked to its owner;
- status claim → commit/test/diff evidence.

No witness exists → say so. A generic decorative chart is not evidence.
