# ADR 079 — Retire `reflect:summarize`

**Status**: accepted
**Date**: 2026-07-14
**Source**: ratified by Paul 2026-07-14.
**Precedent cited**: [ADR-021](021-retire-nav-doctor.md) (`nav:doctor` retirement — the razor for when a wrapper/verb earns too little to justify a standalone door).

## Context

`reflect` held four skills, framed as two read/write pairs (`plugins/reflect/CLAUDE.md`, pre-this-ADR): `catchup`/`park` work the **cursor** (where the session is, and why); `summarize`/`observe` work the **knowledge** (what happened, and what's worth keeping). `summarize` was the read side of that second pair — "a complete, objective account of what THIS session did," neutral and exhaustive, the raw input `observe` distills.

The family's own value-guardrail (`plugins/reflect/CLAUDE.md` §"The value-guardrail") requires every member to force a structure the default would skip — the same gate `think` uses (ADR-034). Measured against that bar, `summarize` fails the **No-Op test** (the marketplace's named prose-failure vocabulary, repo-root `CLAUDE.md`): an instruction that changes nothing relative to default behaviour. Asking a model "summarize this session" **already produces** a complete, neutral, chronological recap — attempted → done → decided → changed — without any skill scaffolding. `summarize`'s "forced structure" (Complete + Objective + Grounded, `SKILL.md` Step 2) restates what unprompted default behaviour does anyway; it doesn't force anything a bare request would skip.

Compare its siblings, each of which clears the bar via **real machinery** the default doesn't supply for free:

- **`catchup`** — the **three-tier consumption priority** (check `HANDOFF.md` first, compare its SHA against `HEAD`, downgrade to "possibly stale" on mismatch, fall back through plan artifacts to pure git-reconstruction) plus a **fixed five-shape report** (goal · done · now · open · next) that a bare "where are we" doesn't reliably produce — a default catchup-style answer paraphrases chat memory, which breaks across `/clear`; this skill's whole value is grounding in durable state instead.
- **`park`** — **writes** a file: the mirror five-shape cursor + a fresh git SHA into `HANDOFF.md`, gated by a write-gate (show the content before overwriting) and an overwrite-not-append discipline with a measured failure mode behind it (`docs/findings/2026-07-13-park-ab-experiment.md` — naming rejected paths explicitly eliminated a real class of reader error). A default "leave a note" doesn't do any of that.
- **`observe`** — the **candidate-first protocol**: surface 2-5 candidates, classify each as own-learning vs. skill-feedback by two *different* selectors (durability-and-news-to-the-user vs. the S/P/D counterfactual bind), route by write-access (local KB vs. scrubbed upstream PR), and never auto-write. None of that is what a default "what did we learn" produces — a default response either invents a single answer or hands back the user's own already-stated thoughts, exactly the failure `observe`'s selectors guard against.

`summarize` has no analogous mechanism. Its "moat" — complete, neutral, chronological, grounded-in-git — is precisely the shape a competent default recap already takes when asked directly. It is the shallowest member of the family by a wide margin, and the family's own framing (two read/write pairs) was already asymmetric: `catchup`/`park` each have machinery `summarize`/`observe` doesn't share equally, since only `observe` on that side does real distillation work.

## Decision

**Retire `reflect:summarize`. Delete `plugins/reflect/skills/summarize/` (`git rm -r`).** `reflect` goes from four skills to **three**: `catchup` · `park` · `observe`.

The family reframes from "two read/write pairs" to **one read/write pair (the cursor) plus a standalone distiller**: `catchup`/`park` remain orient-read / orient-write; `observe` is distill-write with no read-side twin — it scans the live session directly rather than consuming a prior recap artifact.

### What users do instead

- **A full session recap** — just ask for one ("summarize this session," "what did we do"). That request already produces the complete, neutral, chronological account `summarize` used to scaffold; there is no skill-shaped gap to fill.
- **Where the work stands now** — `/reflect:catchup` (grounded, fixed-shape, survives `/clear`).
- **A durable, reusable learning** — `/reflect:observe` (candidate-first, user picks, writes to the knowledge base). `observe` no longer treats a prior `/reflect:summarize` run as an optional input; it scans the session directly, which is what it already did when summarize hadn't been run first.
- **A cursor to hand off before stepping away** — `/reflect:park`.

## What is honestly lost

`summarize` did guarantee one thing a bare request does not strictly guarantee: a **fixed, named shape** — Goal / What was done / Decisions made / What changed / Open-unresolved, in that order, every time — plus an explicit discipline against praise/spin/re-litigating decisions ("Objective" in its Step 2). A default recap, asked for casually, can drift toward a selective highlight reel or slip in editorializing ("nicely done," "the right call") that `summarize`'s Step 2 explicitly forbade. For a one-off "catch me up on what happened," that gap is negligible — the user can just ask for it plainly and correct the shape in the moment. It would matter more for a **repeatable, structured artifact handed to a third party** (e.g., a handoff report to someone who wasn't in the session, or a recurring audit trail) where consistency of shape across many invocations, not just one, is the actual requirement — and where "ask nicely" doesn't scale because there's no one in the loop to notice drift.

## The ADR-021 razor, applied

ADR-021 retired `nav:doctor` because an orchestrator over too little (`audit → sync`, both cheap and clear to call directly) added ceremony without earning its own door. The razor generalizes past orchestrators: **a skill survives only if it forces a structure the default would skip.** `nav:doctor` failed it by orchestrating two calls a human could sequence themselves in one sentence; `summarize` fails the same test one layer further in — it doesn't even orchestrate multiple calls, it just restates what a single unprompted response already does. Same razor, thinner target.

## Re-entry condition

Not a permanent door-closing. If a **recurring need for a structured recap artifact** emerges — e.g., handoff reports to a third party (someone outside the session), a compliance/audit trail requiring consistent shape across many sessions, or any use where "ask for a summary" demonstrably drifts in shape often enough to matter — the verb can return, but only with **real machinery** behind it: not a restatement of default behaviour, but something like a validated template + a drift-check, or an integration point (where the recap actually gets *sent*, not just displayed) that a bare request can't replicate. Until that need is observed (not hypothesized), `summarize` stays retired.

## Consequences

- `plugins/reflect/skills/summarize/`: **deleted** (`git rm -r`).
- `plugins/reflect/CLAUDE.md`: roster reframed to three skills / one pair + a distiller; the value-guardrail section's `summarize` entry removed; a line pointing at this ADR.
- `plugins/reflect/.claude-plugin/plugin.json`: version `0.4.0` → `0.5.0` (skill-roster change); description rewritten to name three skills, not four.
- `plugins/reflect/skills/catchup/SKILL.md`, `plugins/reflect/skills/park/SKILL.md`, `plugins/reflect/skills/observe/SKILL.md`: `/reflect:summarize` cross-references removed or replaced with a plain "just ask for a recap" statement.
- `README.md`: `/reflect:summarize` line removed from the trigger table and the skills list; `reflect` plugin-table row and Invocation section updated to three skills.
- `docs/site/index.html`: `summarize`'s node/edges/CONV entries removed; `reflect` DOMAINS card + graph-node blurb updated (both languages) to v0.5.0 / three skills; global skill count 36 → 35; rev 73 → 74, dated 2026-07-14, new CHANGED entry naming this retirement, prior rev-73 CHANGED entry relabeled FIXED per the file's own convention; ADR count 78 → 79.
- `platforms/codex/descriptions.json`: `reflect-summarize` entry removed.
- `.agents/skills/reflect-summarize/` and its `AGENTS.md` entry: removed by regenerating via `scripts/build-codex.mjs` (never hand-edited).
- `.claude-plugin/marketplace.json`: `reflect`'s hand-owned description updated (it named `summarize` explicitly — a stale surface pointing at a deleted skill is the same "stale surface = lie" failure this repo's gates exist to catch); `version` field re-derived by `scripts/build-manifests.mjs`.
