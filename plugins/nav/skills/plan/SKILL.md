---
name: plan
description: "Turn a spec/feature description into a codebase-grounded plan: ground against touched domains, clarify ambiguity, then write a plan artifact (Context · Approach · Critical files · Verification). Fires on \"make a plan for this spec\" / \"幫我寫好 plan\" / \"scope this feature against the codebase\". Read-mostly — writes only the final plan file with location consent, and is the companion to /nav:audit (Mode 2 is the read-only quick check, this is the full workflow)."
---

# Plan

Turn a spec into a codebase-grounded plan: ground the affected domains, clarify the ambiguities a spec always has, then write a plan artifact the user (or a future agent) can execute against — an artifact, not a chat report. It's the full version of what `/nav:audit <spec>` (Mode 2) starts: Mode 2 stops at the gap-analysis report; plan continues into dialog and a written artifact.

## Stance

- **Four stages: Ground → Clarify → Plan → Offer.** Stage 1 is read-only grounding — scan the transcript for a same-session `/nav:audit <spec>` Mode 2 run and reuse its gap analysis before re-deriving anything. Stage 2 is interactive dialog. Stage 3 writes one file. Stage 4 offers execution, never auto-runs it.
- **Route visual/interaction ambiguity to a render, not a question.** Colour, spacing, gesture feel, whether an affordance should exist — these can't be settled in prose. Hand off to `shape:mockup`, fold the picked design back into the plan. A mockup settles *look*, never *real-engine behaviour* (audio, gesture physics, live data) — plan a post-build smoke test for that separately.
- **Ask only high-signal clarifying questions (3-5), never a spec dump back at the user.** Scope boundaries, contract changes, edge cases, silent trade-offs, existing-code coupling — not things you could answer yourself, not multiple questions about the same gap. An unanswered question becomes a labeled **open question** in the plan, never a guess.
- **Confirm output location first — don't write blind.**
  - **If the repo has a `blueprints/` tree** (the shape convention; commonly `docs/blueprints/`), default to **`blueprints/plans/<YYYY-MM-DD>-<short-slug>.md`** — co-locating the grounded plan with the intent it came from (`thoughts/` · `plan.md` · `overview.html`), so the whole arc (decision → status → grounded plan) lives in one tree. Create `blueprints/plans/` if absent.
  - **Otherwise**, default to `docs/plans/<YYYY-MM-DD>-<short-slug>.md`. If the repo has another obvious convention (e.g. `docs/specs/`), prefer that; ask once if unclear.
  - This is a **soft** preference — `nav` never *requires* `blueprints/` (it runs fully standalone); it just prefers that home when the tree is present, per the soft `nav → shape` rule (ADR-012/017).
- **The plan is the artifact.** A plan that lives only in the conversation is gone next session — write the file, then summarize to chat: location, line count, key open questions, what step 1 entails.
- **Offer next action, don't make the user type the next command.** Present an `AskUserQuestion` with a sub-agent default (recommended), inline execution, or save-only. Dispatching a sub-agent **injects** the grounding it can't re-derive (Critical files, existing seams to reuse, the N+1 trigger) and **checks** the returned diff (same-domain parallel impl, seam/facade intent, header hygiene, board sync) before accepting "done" — see ADR-008. Guarded, one-shot: skip when there's no executable step 1 yet, and never re-offer after a decline.
- **Honest about uncertainty.** A guessed file role or an unresolved question gets said out loud in the plan, not smoothed over — rule ⑦.

Full four-stage protocol (grounding detail, the visual-vs-verbal boundary, the plan template, Stage 4's option table, the 8 rules, and the anti-pattern table): `references/plan-protocol.md`.

### Stage 4 — Offer next action (don't make the user type the next command)

After Stage 3's file write + summary, present implementation options via `AskUserQuestion`. The user *picks*; you do not pre-decide. This step exists because suggesting "next session: run `/nav:refactor`" in chat text leaves the user to remember the command and type it; one click is friendlier. The discipline ("don't auto-execute") is preserved by the question itself — the user must affirmatively choose.

**Default 3 options** (adjust labels per the plan's nature):

| # | Option | What happens if picked |
|---|---|---|
| 1 | Launch sub-agent to execute step 1 *(Recommended)* | Invoke `Agent` with `subagent_type=general-purpose`. **Inject (→)** what a fresh sub-agent can't re-derive: the plan file path, step 1's scope, the verification expectation from Stage 3's Verification table, **plus the grounding Stage 1 already produced** — the Critical files + their roles, any existing impl/seam the step should *reuse rather than re-add* (e.g. "the formatting helper already lives in the module's utils — import it, don't rewrite it"), and the **N+1 trigger** (second consumer of an inline util = extract a primitive, don't copy). If step 1 is behaviour-preserving (a move), instruct the sub-agent to follow `/nav:refactor`'s discipline (verbatim move + test gate); if it changes behaviour, instruct it to follow `/nav:do`'s discipline (inject → execute → check) with an **unconditional verify gate** — run the stack's tests + a real-app pass on the *new* behaviour, not only when the step is a refactor. **Check (←)** when it reports back, *before* accepting "done": read the diff and run the integration pass — same-domain grep for a parallel impl; seam/facade rules read at intent, not over-read into a wall; header hygiene, meaning a new load-bearing file has a header and a changed role is updated same-commit; **board sync** — if a `blueprints/plan.md` item tracks this work and the step closed or materially advanced it, the item is updated in the same change (the push half of ADR-086, same rule as `/nav:do`'s fourth gate). STOP if any fails. See [ADR-008](docs/adr/008-inject-check-at-handoff.md). |
| 2 | Execute step 1 in this session | Continue inline in the current session. The user sees each move; review gates remain manual. |
| 3 | Save plan only — I'll come back later | Skill ends. The plan file is the artifact. If stepping away for a while (not just to the next turn), it's fine to mention `/shape:baton` can also save the session's cursor into `blueprints/baton.md` — offered, never auto-run; skip the mention if the environment's harness already provides its own handoff/compaction mechanism. |

The dispatched sub-agent defaults to cheap tier (`model: sonnet`); a judgment-dense single step can be escalated on the spot (see root CLAUDE.md's Dispatch tiers).

**Why the sub-agent is the recommended default**: it enforces clean context (= the "separate session" discipline at the architecture level, not just by convention) and frees the planning session's context for review work the user might still want to do.

**Optional extra option — visual summary of the plan (guarded):** when the plan carries visual / structural decisions **and** `shape:mockup` is available, add an option **"Render a visual summary (→ `/shape:mockup`)"** — an interactive diagram of the approach + affected files, a decidable glance before execution (and a reusable verify target later). This is the **same cross-family edge** Stage 2 already uses (the offer is an *ask*, never auto). **Guard it:** omit the option if `shape:mockup` isn't installed (a broken option is worse than none) or the plan is purely non-visual. It's a **soft nav→shape recommendation**, never a hard dependency. `nav:plan` works fully without shape. (See [ADR-012](docs/adr/012-nav-plan-offers-visual-summary.md).)

**Skip Stage 4 if**:
- The plan has no executable step 1 yet (only open questions remain → user needs to answer first).
- The user already said "just write the plan, don't ask what's next" earlier in this conversation.

**One-shot, no nagging**: if the user picks "Save plan only", do not re-offer later in the same session. The discipline cuts both ways.

## Companion skills

- **`/nav:audit`** — Mode 2 is the read-only quick check this skill continues past.
- **`/nav:refactor`** — typical next step when the plan's Approach lists structural moves.
- **`shape:mockup`** *(sibling family)* — the cross-family edge: visual/interaction ambiguity in Stage 2 routes here.

## Communication style

- Explain in the user's language with simple, direct wording.
- Lead each reply with one plain sentence; use a metaphor when it clarifies the concept.
- Put precise technical detail after the plain explanation and only where it's needed.
