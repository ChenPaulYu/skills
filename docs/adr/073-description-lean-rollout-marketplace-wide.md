# ADR 073 — description lean-but-honest convention: rollout to remaining 30 skills

**Status**: accepted
**Date**: 2026-07-13
**Rolls out**: [ADR-065](docs/adr/065-description-lean-but-honest-pilot-frame.md)'s convention, pilot-accepted (15/15) on `frame` alone, to the rest of the marketplace
**Also lands**: `blueprints/thoughts/2026-07-13-fixed-structure-learning-curve.md`'s 藥方三 ("表述翻轉" / intent-first framing), carried along per that thought's own note that it should ride this rollout rather than open separate work

## Context

ADR-065 piloted the two-load description convention on `frame` (5 skills, 58.8% of original length, 15/15 cue-preservation, accepted by a Fable/Paul acceptance pass) and explicitly left rolling it out to the remaining skills as "a separate, later decision gated on that acceptance" — recorded as a `blueprints/plan.md` Next item. That gate is now cleared. Paul asked to plan the rollout and execute it via Sonnet sub-agents (dispatch-tier default per `CLAUDE.md`'s ★ Dispatch tiers: judgment stays with the session model, disciplined execution goes to the cheap hand).

## Decision

Dispatched 5 Sonnet sub-agents, one per remaining plugin (`nav` 7 skills, `reflect` 4, `relay` 7, `research` 4, `shape` 8 — 30 total), each rewriting only the frontmatter `description` field of its plugin's `SKILL.md` files, per ADR-065's method:

- **Model-invoked skills**: lean-but-honest — leading verb front-loaded, one trigger sentence per distinct branch/mode, every NOT/vs boundary sentence kept verbatim or near-verbatim, 1–2 existing native Chinese trigger quotes kept where present, honest about scope.
- **User-invoked skills** (`disable-model-invocation: true` — `nav:refactor`, `reflect:catchup/observe/park/summarize`, `shape:build/setup`, 7 total): drop the "Fires on ..." trigger-phrase list entirely — the model never routes off these, so the list was dead weight the frame pilot didn't touch (only `frame` skills are model-invoked). This rollout is the first pass applying that half of the convention.
- **表述翻轉** folded in throughout: every rewrite opens with the user's intent/verb ("Check whether...", "Align on...", "Converge a decision by...") rather than the skill's internal mechanism, per the fixed-structure thought's 藥方三.

Each sub-agent independently ran a cue-preservation check (2 English + 1 Chinese baseline trigger per skill) and reported before/after character counts; the "check" step re-read every diff (confirmed exactly one line — the `description` field — changed per file, 30 files/30 lines, `git diff --stat`), independently recomputed all character counts, and spot-checked seven representative rewrites across all five plugins for tone and boundary-sentence integrity. Full table + disclosed judgment calls: `docs/findings/2026-07-13-description-diet-rollout.md`.

## Why

- The pilot's gate (real-usage acceptance, not just a static check) was already cleared by the earlier Fable/Paul pass — re-running a second full acceptance pass for 30 more skills would re-litigate a convention already accepted, not test something new.
- Per-plugin batching (5 agents, not 30 or 1) matched each agent's context to a plugin's actual cross-reference density — `reflect`'s four-way triads, `research`'s critique/provenance mirror pair, `shape`'s elicit/mockup/position/reconcile lattice — so boundary sentences got kept by an agent that could see the whole plugin, not edited blind one skill at a time.
- Carrying 藥方三 along this rollout (rather than a separate pass) matches the fixed-structure thought's own instruction and rule ① — one rewrite touching the same lines, not two passes leaving the same field dirty twice.
- Dropping the 7 user-invoked skills' trigger lists closes a gap ADR-065 named but didn't execute (context said 6 such skills exist; the actual count is 7 — `reflect:park` also carries `disable-model-invocation: true` and wasn't enumerated in ADR-065's context, corrected here).

## Consequences

- 30 `SKILL.md` files across `nav`/`reflect`/`relay`/`research`/`shape` have rewritten `description` frontmatter; bodies, `name`, `model`, and `disable-model-invocation` fields untouched (verified via diff).
- Marketplace-wide description-field total: 22,484 → 14,347 characters (63.8% of original, ~36% reduction) across all 35 skills, combining this rollout's 30 with the frame pilot's 5.
- `node scripts/validate-codex-skills.mjs` passes clean — description-only edits don't disturb registration or manifest gates (expected; the validator checks slug presence and site-map version tokens, not description prose length).
- `docs/findings/2026-07-13-description-diet-rollout.md`: new file, full per-skill table + disclosed judgment calls (near-synonym drops, missing-boundary-sentence gaps, ZH-quote losses on user-invoked skills).
- `blueprints/plan.md`: this Next item moves to Shipped.
- `blueprints/thoughts/2026-07-13-fixed-structure-learning-curve.md`: status line updated — 藥方三 now landed alongside 藥方一/二/四 (ADR-071).
- `platforms/codex/descriptions.json` remains untouched (same boundary ADR-065 drew) — whether the Claude and Codex projections should converge to one shared text is still open for a later session.
- Individually flagged, not silently dropped: `reflect:observe` lacks an explicit "Distinct from /reflect:X" boundary sentence (unlike its three siblings); `shape:setup` lost its two native Chinese trigger quotes as a side effect of the user-invoked drop rule (recoverable from git history if wanted back). See the findings file for the full list.

## Notes

No separate live-trigger-accuracy acceptance pass was run for these 30 skills (unlike the frame pilot, which had one). This rollout extends an already-accepted convention rather than re-testing it; if a routing regression surfaces in real usage, the fix is a targeted re-edit of that one skill's description, not a rollback of the convention itself.
