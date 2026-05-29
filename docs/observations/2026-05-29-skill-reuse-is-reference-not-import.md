---
date: 2026-05-29
status: raw
---

# Skills can't be modularized by import — the seam is reference + transcript-reuse, not a shared module

## What prompted it

While consolidating the rules (11→8), the question came up: `audit`, `plan`, and `doctor` all clearly contain "audit" logic — can they be made **modular** so the shared part lives in one place? The instinct is right (there *is* a shared concern), but the answer is shaped by a hard constraint that doesn't exist in normal code.

## The signal

**At skill runtime, only the triggered `SKILL.md` is loaded.** There is no `import { auditProtocol } from '../audit'` — a skill cannot reach into a sibling at trigger time. So the normal deep-module move (extract a shared module, import it everywhere) is *unavailable* at the skill layer. Every "modularity" decision for skills is downstream of this.

## What's actually overlapping — two kinds, each already handled

1. **The 8 rules (embedded verbatim in all 6 SKILL.md).** Deliberate duplication, per [ADR-001](docs/adr/001-plugin-shape-and-naming.md) #3 ("self-contained SKILL.md, no shared imports"). This is **rule ④ (right grain / no needless abstraction) applied to the plugin itself**: the shared-module abstraction is *impossible* here, so duplication + a "change the rules → edit every SKILL.md in the same commit" meta-rule is the correct grain. The 11→8 consolidation just exercised that cost: one canonical edit in `plugins/nav/CLAUDE.md`, propagated by hand to all six. Real cost, but bounded and mechanical.

2. **The audit protocol (lives once in `audit/SKILL.md`; used by `plan` + `doctor`).** Already modularized the *skill-native* way — by **reference + reuse-via-transcript** ([ADR-006](docs/adr/006-nav-plan-skill.md)), not by copy:
   - `doctor` Step 2: "Follow `/nav:audit`'s protocol fully … output exactly as `/nav:audit` would" — a pointer, not a duplicate.
   - `plan` Stage 1: scan the transcript first — if `/nav:audit` (Mode 2) already ran this session, **reuse its output**; only if not, run a *condensed* restatement of audit's tables inline. Plan's `SKILL.md` explicitly defends this: *"This isn't `/nav:audit` being called — it's plan instructing the agent to apply the same protocol inline. Self-contained per ADR-001 #3."*

So the architecture **is already modular**, just with the module boundary drawn at the *protocol-reference + transcript-reuse* seam rather than a shared file: `audit` is the atomic capability; `doctor`/`plan` are the composition layer (the atomic-vs-meta split from [ADR-003](docs/adr/003-five-skills-not-four-or-six.md)). That's rule ② (interface-first / one door) applied to the skills themselves — the meta-skills are the door over audit.

## The one candidate for going further (deferred)

Extract audit's mechanical-check tables + self-eval steps into a shared `references/audit-protocol.md` that `audit`/`plan`/`doctor` all load on demand — the way `map` loads `references/visual-spec.md`. That would remove even `plan`'s condensed restatement.

**Why not now:**
- `map`'s `visual-spec.md` lives *inside map's own dir* (only map loads it). A protocol shared across *three* skills is exactly the "reaching into siblings" fragility [ADR-001](docs/adr/001-plugin-shape-and-naming.md) #3 weighed and rejected. Doing it = **reopening that decision with a new ADR**, not a quick refactor.
- The gain is small: audit's protocol is *already single-sourced*; the only residual duplication is ~5 condensed bullets in `plan`. Trading the self-contained guarantee for ~5 lines fails rule ④.

## Trip-wire to revisit

If `plan`'s / `doctor`'s inline restatements of audit **grow** (more than a thin pointer) or start to **drift** from `audit/SKILL.md`, that's the signal to reconsider the shared `references/audit-protocol.md` — and at that point, write the ADR that revisits ADR-001 #3 for cross-skill reference docs (distinct from the rejected `_shared/` import idea: on-demand path-load, not sibling-reach-at-trigger).

## Evidence so far

- **Only case (2026-05-29, this marketplace session)**: surfaced during the 11→8 rule consolidation; verified against `plan/SKILL.md` Stage 1 (reuse-via-transcript + condensed restatement, line ~48), `doctor/SKILL.md` Step 2 (pointer), and ADRs 001 / 003 / 006.

(One case → stays `raw`. The pattern to watch is "restatement grows/drifts"; if seen, this becomes the bookmark for an ADR revisiting ADR-001 #3.)
