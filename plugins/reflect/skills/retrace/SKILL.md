---
name: retrace
description: "Reconstruct why a long development arc moved from one stage to the next, then render the user-corrected causal path as a concrete interactive artifact. Summoned only; distinct from present-state catchup, a current-codebase tour, an ordinary recap, and an evaluative process retro."
disable-model-invocation: true
---

# retrace — follow the evidence-backed path back into the work

Restore a person's understanding of **how the work arrived here**. A chronological recap lists rooms; retrace reconstructs the corridor between them. Each transition must show what remained broken, what evidence exposed it, what was decided, how far it landed, and why that result forced the next turn. A plain recap already handles chronology by default (why `reflect-summarize` was retired, [ADR-079](docs/adr/079-retire-reflect-summarize.md)); retrace earns a separate door only through the mechanisms below — drop them and this is that retired skill under a nicer name.

Optional focus from the user: **$ARGUMENTS** (a feature, architectural arc, date range, or workstream; otherwise infer the smallest coherent arc from the request and confirm it in the outline).

**Summoned, not automatic.** A long session is not permission to generate a report. Run only when the user explicitly asks for retrace or equivalent causal re-entry.

**One controlled write.** The skill reads project evidence, presents a causal outline for correction, and only then writes a dated interactive artifact. It never edits code, plans, decisions, canon, or the evidence it cites. Do not commit unless the user asks.

## Stance

- **Evidence ownership.** Durable state wins for **what shipped**; an explicit user statement or recorded decision wins for **why it was intended**; code shape alone never proves historical rationale; a later document describing current policy doesn't prove why an earlier turn happened. Contradictory sources stay visible — never averaged into a smooth story. Read in order: explicit intent → decision record → shipped state → concrete witnesses, tolerating whatever evidence tree the project actually has (standard / ad-hoc / sparse). Full evidence protocol: `references/evidence-and-stages.md`.
- **Six-field causal stages, every bridge tested.** Each stage needs **prior state → pressure → evidence → decision → status → next pressure**, and the sixth field must survive three checks: does the evidence support the pressure? does the decision respond to it? does the next pressure arise from the result, not mere adjacency? If any answer is no, split the stages, reorder them, or label the bridge unsupported — never a decorative arrow over a missing cause. Match a concrete witness to each stage's claim wherever evidence exists; no witness exists → say so, a decorative chart is not evidence. Full table + witness-matching: `references/evidence-and-stages.md`.
- **Provenance duty.** Apply one provenance label to every rationale/bridge claim:
  - **Recorded** — an ADR, thought, plan, commit body, finding, or explicit user statement records the reason.
  - **Inferred** — the claim is a bounded interpretation of source/diff/test sequence, not an explicit decision record.
  - **Unknown** — available evidence cannot support the causal claim.

  Do not let “implemented” imply “decided,” “verified” imply “committed,” or “current code” imply “original intent.” Show the exact status supported by the evidence.
- **Outline correction gate.** Before writing HTML, present a compact outline in the user's language (scope + evidence basis, stages, the bridge after every stage, witness plan, current boundary — full content spec: `references/render-and-verify.md`). Ask the user to correct stage boundaries, intent, missing decisions, and bridges. **Stop here until they accept or correct the outline.** If the same outline was already explicitly accepted earlier in the live context, reuse that acceptance and proceed; do not make the user approve twice. On correction, update the outline first. User testimony may promote an Inferred historical reason to Recorded; label it as a user statement rather than pretending it came from git.
- **The artifact is dated, browser-verified, and bounded.** A snapshot, not a silently-maintained second source of truth — a head-readable comment states what it covers, current status, generation date/SHA, evidence basis, and whether a later artifact supersedes it. Verify in a real browser (zero console errors, every decision-critical control exercised, desktop + narrow layouts, links and media resolve) before handoff, then report the current boundary honestly: proven / implemented-but-unverified / decided-but-unbuilt / unresolved. Do not convert unresolved items into a roadmap or start implementation — that's `shape-align` or `shape-elicit`. Full render spec, interaction/visual rules, and verify checklist: `references/render-and-verify.md`.

Neighbor boundaries (`reflect-catchup`, `nav-tour`, `shape-mockup`, `shape-align`/`shape-elicit`, planned `reflect-retro`) + the full anti-pattern table: `references/boundaries-and-anti-patterns.md`.

## Completion criterion

Retrace is complete only when:

- the arc is bounded and its evidence tier is self-reported;
- every stage carries all six fields;
- every rationale/bridge is Recorded, Inferred, or Unknown;
- status does not conflate decided, implemented, verified, and committed;
- the user corrected or accepted the outline;
- abstract claims have concrete witnesses when evidence exists;
- the interactive artifact is dated, browser-verified, and reachable;
- the current boundary and evidence gaps remain explicit;
- no code, decision, plan, or canon artifact was modified.

If the user stops after the outline, report “outline aligned; artifact not yet rendered.” Do not call the retrace complete.

## Communication style

- Explain in the user's language with simple, direct wording.
- Lead each update with one plain sentence; use a metaphor when it clarifies the causal model.
- Put precise technical detail after the plain explanation and only where evidence needs it.
- During a long render/verification pass, keep the user updated at least once per minute.
