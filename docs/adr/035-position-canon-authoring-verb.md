# ADR 035 — `position`: the canon-authoring verb (writing core, principle-wise documents)

**Status**: accepted
**Date**: 2026-06-10
**Relates to**: [ADR-008](008-subagent-reuse-via-transcript.md) (meta-skill orchestrates by protocol, never calls), [ADR-013](013-diagnosis-folds-into-elicit.md) (same-engine razor), [ADR-014](014-reconcile-amend.md) / [ADR-017](017-reconcile-maintains-plans.md) (reconcile's charter — the mirror), [ADR-018](018-promotion-gate-is-evidence-not-session-count.md) (evidence gate), [ADR-034](034-think-plugin.md) (first-principles, the self-audit instrument)

## Context

A day-long TrackMate campaign (2026-06-10) exposed a verb no existing skill owns: **authoring the canon layer** — converging many heterogeneous feedings (user statements, pasted GPT conversations, screenshots, old prototypes) into `docs/core/*.md`-class documents, and keeping them honest as they accrete. Two characteristic failures occurred in the wild and required surgery: *hypothesis dressed as canon* (three core docs demoted after unvetted GPT details were written in 定稿 voice) and *conversation sediment* (a 7-item "principles" list that contained 2 principles). The campaign design was first landed as an observation (`2026-06-10-position-verb-canon-campaign.md`); the user then ordered crystallization with a reframe.

## Decisions

### 1. Doc-class framing, not topic framing (the user's reframe)

`position` is **the skill for writing core (principle-wise) documents** — not "product positioning". Evidence: the same engine produced two canon docs of unrelated subjects in one day (`position.md` — product identity; `design.md` — visual/interface). The invariant is the **artifact class** (user-ratified · principle-altitude · self-contained), not the subject. Consequence: future canon docs (a frozen primitives.md, an architecture.md) are the same verb, and the file/verb names align (`position.md` ↔ `/shape:position`).

### 2. Graduation, not scaffolding

position guarantees one core file; every further core doc **graduates** from a thought when the user freezes it (explicit sign-off or built-reality validation), re-running the authority + altitude gates. Never pre-open core files — canon means frozen, and early campaigns have nothing to freeze. Field-validated same day: `thoughts/ui-positioning.md` → `core/design.md` was the first live graduation. The negative case is equally field-tested: three core docs scaffolded upfront were all demoted.

### 3. The position/reconcile mirror (who owns canon when)

```
position:   decisions freeze top-down    (authority → canon)      before code exists
reconcile:  reality ratified bottom-up   (reality → decisions)    after code ships
```

Three arguments, in increasing force: (a) **evidence source differs** — reconcile's engine diffs docs against built reality; pre-code it has nothing to scan, while position's freeze is a conversational event; (b) **knowledge ownership (Parnas)** — graduation needs the freeze test + canon conventions, both position kernels; placing it in reconcile leaks the canon bar into two modules; (c) **decisive** — reconcile's charter refuses decision-acts (ADR-014: amend never rewrites a decision), and canonization IS a decision-act. One line: **position births canon, reconcile keeps it true.** Handoff = first line of implementation code, after which reconcile maintains everything position birthed.

## Evidence gate (ADR-018)

One full campaign, but unusually dense: the engine re-fired across two canon docs in one day · graduation executed live · the altitude instrument ran twice (initial layering + same-day re-audit of an accreted doc) · two instruments were discovered in flight and folded in (**churn alarm** — a second flip on the same decision means form-layer debate, lift to the rule; **first-principles pre-landing self-audit**, per ADR-034) · the user explicitly ordered crystallization and supplied the reframe. Promoted on evidence quality, not session count.

## Guardrails

- **Campaign-level summons only** — never fires on everyday product chat; the whenToUse states this.
- Meta-skill per ADR-008: elicit / mockup / first-principles are borrowed by protocol (reuse-via-transcript), never invoked.
- Authority over altitude when unsure: altitude mistakes restructure; authority mistakes poison — default to thoughts.

## Consequences

- shape gains a fourth converge-family verb (`mockup` · `elicit` · `dogfood` · `position`); plugin → 0.4.0.
- The `position = candidate (planned, raw)` entry in `plugins/shape/CLAUDE.md` is superseded by a built entry.
- The founding observation gains field-validation + crystallized status; the TrackMate session transcript is the founding eval case.
