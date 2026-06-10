---
date: 2026-06-10
status: crystallized → plugins/shape/skills/position (ADR-035, same day)
---

# `position` — a shape verb for converging product canon from multi-source feedings (full design, pending crystallization)

> **Crystallized 2026-06-10** with a user reframe: position = the skill for **writing core (principle-wise) documents** of any subject — the invariant is the artifact class (user-ratified · principle-altitude · self-contained), not the topic "product positioning". See ADR-035 + the SKILL.md; this note keeps the founding design + field validation.

> Source: TrackMate positioning campaign (trackmate repo, 2026-06-10). One long session went from "what is TrackMate" through four paradigm shifts (Artifact Feed → chat-first → workbench → Cursor-frame), an authority surgery (three core docs demoted to thoughts), a first-principles re-layering (`/shape:elicit` + `/shape:mockup`), and landed `docs/core/positioning.md` as a single-root principle tree. The session exposed a repeatable engine no existing verb owns. Design converged with Paul; **agreed to crystallize as `shape:position` later** — this note holds the full design so nothing is lost to the context window.

## The gap

shape has verbs for converging one concept (`elicit`), rendering a decision (`mockup`), triaging what to build next (`align`), and syncing docs to shipped reality (`reconcile`). **Nobody owns the campaign that converges what a product IS** — many feedings of heterogeneous material, across days, landing a canon layer. In the session this was improvised; it worked, but three moves had to be discovered the hard way (one via a real failure).

## The three kernels (what the skill itself carries)

1. **Ingest-assess (吸收紀律)** — every feeding runs the same move: tag provenance/authority → classify each piece as *genuinely new / already metabolized / conflicts with a locked decision* → respond with a fixed-shape **delta report** (new / metabolized / conflict / needs-ruling), never wholesale absorption. Stance: the material provides divergence, the skill provides convergence + **guarding** (conflicts get blocked, e.g. a multi-agent "control room" idea vs the portfolio invariant "reasoning lives only in the orchestrator").
2. **Altitude test (海拔儀)** — "survives any implementation change = principle / one means among several = approach / needs validation = bet / above principles = axiom". Companion smell: **a list that is conversation sediment** — accreted bottom-up by "is this important?" instead of grown top-down from axioms ("important ≠ same layer"). Accumulated altitude drift triggers a single-root tree restructure. (In the session: 7 self-declared "core principles" → only 2 survived the test; the doc was rebuilt as axiom → first principle → 4 derived principles → approaches → bets.)
3. **Two-tier landing (雙層落地)** — `core/` = canon: self-contained at its altitude, high-level, **only what the user explicitly confirmed**, carries a superseded/evolution log + open questions. `thoughts/` = dated hypotheses with status headers ("direction confirmed / details unverified") and ⚠ conflict markers. **Self-containment invariant**: the canon doc must give the complete high-level picture without opening any thought.

## Input modes are plural (Paul's explicit correction)

Do NOT canonize "pasted AI conversation" as the input — that was this campaign's accident. Modes, each mapping to a *default* authority level (user can override):

| Mode | Default authority |
|---|---|
| User's own statement | canon candidate |
| External AI conversation (any LLM) | direction = user-steered (canon candidate); details = unvetted (hypothesis) |
| Existing docs (briefs, old positioning, portfolio specs) | dated facts — check staleness |
| References (competitors, mockups, prototypes) | grounding material, not claims |
| Live discussion in-session | escalatable to elicit |
| Memory / past transcripts | true-when-written, re-verify |

## Graduation model (not scaffolding)

`position` guarantees ONE file: `core/positioning.md` (the trunk). The rest of `core/` (primitives, architecture, framing docs — cf. crate's mature 5-file core) is **graduated**, not scaffolded: a thought passes the freeze test (explicit user sign-off, or validated by implementation/dogfood) → re-run the altitude + authority gates → it becomes its own `core/<domain>.md`; positioning keeps a high-level section + link (layered self-containment). Never pre-open empty core files — that re-commits the original sin (*hypotheses dressed as canon*, which is exactly what forced the session's demotion surgery).

## Boundary with `reconcile` (the sharpest cut; Paul probed it directly)

They are **mirror verbs**, not one verb with two cases:

```
position:   decisions freeze top-down    (authority → canon)      before code exists
reconcile:  reality ratified bottom-up   (reality → decisions.md) after code ships
```

- **Evidence source differs**: reconcile's engine judges docs *against built reality* (pre-code it has nothing to scan); position's graduation is a *conversational event* (the user freezes a decision mid-campaign).
- **Knowledge ownership (Parnas)**: graduation needs the freeze test + canon conventions — both are position's kernels; moving it into reconcile = information leakage (two modules encoding the canon bar).
- **Decisive**: reconcile's own charter refuses decision-acts ("AMEND never rewrites a *decision*; defers to elicit"). Canonization IS a decision-act → belongs in the decision verb.
- Division of labor after code exists: reconcile maintains everything position birthed (core fact-drift AMEND, stale-thought PRUNE, shipped-hypothesis GRADUATE into decisions.md). One line: **position births canon, reconcile keeps it true.** Handoff = first line of implementation code.

## Other boundaries

- vs `elicit`: elicit converges ONE concept to one line in one sitting; position is a multi-feeding campaign landing a whole canon layer. position hands its convergence moments to elicit **by protocol** (meta-skill, ADR-008 reuse-via-transcript — like `build`), and structure-sync moments to `mockup`.
- vs `align` / `nav:plan`: both downstream — position converges what the product *is*; align triages what to *build next*; nav:plan grounds a spec into code.
- Output location = per-project slot (a `docs/core/` if the repo has one, else `blueprints/`), same pattern as shape's browser-verify slot.

## Anti-patterns (all lived or near-missed in the source session)

- Writing unvetted details in canon voice (→ caused the actual demotion surgery)
- Conversation-sediment lists (collecting by importance, not by layer)
- Canon that needs links to be complete (self-containment broken)
- Full-rewrite per feeding (should be surgical edits; the evolution log survives only that way)
- Treating one input mode as the norm
- Agreement-absorption: the more authoritative the source, the more the guard matters

## Exit condition

The campaign closes when the open-questions list is the only thing still moving. Re-summonable: later feedings and graduations are new (smaller) campaigns.

## Crystallization TODO (later)

- `skill-creator` scaffold at `plugins/shape/skills/position/` — kernel = the three moves; `whenToUse` must scope to *campaign-level* positioning (low-frequency; don't fire on everyday product chat).
- ADR-034: the verb's birth — graduation model + the position/reconcile mirror boundary.
- First eval case: the TrackMate session transcript (a complete worked example incl. the failure).

## Field validation(2026-06-10 afternoon — the engine ran for real, same day)

- **Graduation executed (first live case):** `thoughts/ui-positioning.md` → `core/design.md` after the user ratified five visual picks — the freeze test (explicit user sign-off) worked as designed; the thought got a graduated stamp, the canon got a self-containment clause.
- **Altitude audit re-fired on a second doc:** design.md had accreted all day; the same 原則/作法/賭注 test (UI flavor: "survives a UI redesign = core; would be redrawn = form → thought") split it cleanly, plus the user supplied a weighting the engine should respect (「style 和 layout 最重要,其他都還好」— canon's center of gravity is the *user's*, not the taxonomy's).
- **New kernel detail:** canon docs accrete *during* the campaign, not just at feedings — the engine needs a **periodic altitude re-audit** of its own canon (a pre-code reconcile-ish maintenance pass), not a single landing-time check.
- **Rename ripple:** canon file renamed (positioning→position) to match the verb — cross-reference updates touched 7 files; the skill should own reference-integrity on canon renames.

## Related

- `2026-06-02-first-principles-positioning-check.md` — adjacent but distinct: that's a single *level-claim check* move (research positioning); this is the whole product-canon campaign engine. The level-check could become one instrument inside position's ingest-assess.
- `2026-05-29-thought-mode-how-paul-converges.md` — the volley pattern position's feedings follow.
- `2026-06-03-reconcile-needs-graduate-and-a-decisions-tier.md` — the other half of the mirror boundary.
- `2026-06-10-churn-is-an-altitude-alarm.md` · `2026-06-10-first-principles-as-post-design-self-audit.md` — two instruments discovered while the engine ran.
