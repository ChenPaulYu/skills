---
name: align
model: sonnet
description: "Align on what to build next: decide with you what's In progress, Next, or Future from current decisions and real work, then write the single maintained plan.md board. Fires on \"where are we\" or \"what should we work on next\". NOT /nav:plan (this triages forward; that grounds a spec into code) — and not a visual render, which is an on-demand /shape:mockup board snapshot."
---

# Align — decide what's next, render it

Recurring, lightweight alignment on **what to build next**. Read the converged decisions and the real state of the work, decide *with the user* what's now / next / later, and land it as `plan.md` — the one real, current artifact you point at, not a paragraph you re-read. Want to *see* it rendered? That's an on-demand `/shape:mockup` board snapshot, not align's job — align never maintains a standing HTML file.

## Stance

- **Decide *with* the user, don't author priorities silently.** Surface the now/next/later split; let them move things, add, cut.
- **Ground in reality before triaging** — read `thoughts/*.md` + the precedents tier (`precedents/index.md` / legacy `decisions.md`), and verify against the actual code (grep, `head -12` headers, `git log`) rather than trusting the plan's own claims.
- **Sync-confirm done-ness — align is a status *sync*, not a read-only re-render.** For every item the *current* `plan.md` lists as In progress / Next — **especially any marked "待驗 / TBD / not-sure-if-done / 待驗是否已做"** — go *confirm it against the code*, don't carry the unresolved claim forward. If grounding shows it shipped, **move it to ✅ Shipped** in the triage. A plan that still says "TBD: is X done?" *after* an align run is an align failure — the whole point is that the board reflects verified present reality. (This is item-*status* reconciliation, which is align's job; pruning a stale *thought doc* is still `/shape:reconcile`'s — don't conflate the two.)
- **Every carried item gets verified, mechanically — a sampled spot-check is not a sync (ADR-086).** The measured failure mode: a "refresh" that re-reads the board, reorders it, and carries every claim forward unverified — one real sweep then found **5 of 7 "Next" items had already shipped**, some for days. So: no 🚧/▶ item enters triage without evidence attached (a grep hit, a `head -12` header, a `git log` ref, a test name). When the board is long, fan the per-item verification out to cheap parallel sub-agents (`model: sonnet`, read-only) instead of skipping it — verification cost is the reason this step gets rationalized away, so make it cheap rather than optional.
- **No item vanishes silently (ADR-086).** Every item on the *previous* board must land somewhere visible in the new one — ✅ Shipped (with evidence), ⏸ Future (with the why/trigger), still in ▶ Next, or an **explicit, user-confirmed cut**. A reprioritization that quietly loses an item creates ghost work. If you're proposing to drop something, say so out loud in the triage — dropping is a decision the user makes, not a diff artifact.
- **Don't clean here.** Stale/implemented thoughts get *flagged*, not pruned — that's `/shape:reconcile`'s job, write-gated.
- **No new decisions during triage.** A decision that surfaces while aligning belongs in a `thoughts/` doc, via `/shape:elicit` or `/shape:mockup`.
- **Write-gated.** Show what you'll write (or a diff for an existing tree) before committing files.
- **One state, one maintained render.** `plan.md` is the single source of truth for status; a visual view is generated on demand by `/shape:mockup`, never a second maintained copy that can drift.

Full protocol — locating/scaffolding the `blueprints/` tree (incl. the dev-workflow-stub install), the tree layout, the four-step sequence, and the `nav:plan` seam + ADR-086 push/pull rationale: `references/protocol.md`. Tree/format spec: `references/blueprints-spec.md`. Read either when actually running align.

## Companion skills

- **`/shape:elicit`** — converges a conceptual decision into a new `thoughts/` doc (the WHAT align reads).
- **`/shape:mockup`** — converges a visual/structural decision into `mockups/`; also renders an on-demand board snapshot from `plan.md` + the precedents tier.
- **`/shape:reconcile`** — cleans out stale `thoughts/` (the cleanup align defers to).
- **`/nav:plan`** — the build-side sibling: grounds one blueprint item into a code-level implementation plan.
- **`/reflect:park`** — the *ephemeral* counterpart: a "stepping away right now" session cursor is park's `HANDOFF.md`, not a blueprints entry — align owns **durable** status, don't conflate the two.

## Communication style

- Explain in the user's language with simple, direct wording.
- Lead each reply with one plain sentence; use a metaphor when it clarifies the concept.
- Put precise technical detail after the plain explanation and only where it's needed.
