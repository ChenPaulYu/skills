# ADR 062 — a live-LLM-cost signal: aware while writing, notify at the gate — not an auto-cheap default

**Status**: accepted — implemented 2026-07-08 (nav `0.8.1` · shape `0.7.1`)
**Extends**: [ADR-058](058-shape-cost-tiers.md) (shape cost tiers) · [ADR-059](059-cost-tier-marketplace-wide.md) (cost tier marketplace-wide) — same "whose money, which axis" question, a new axis.

## Context

Real incident, 2026-07-01: a private R&D backend's research feature had a dead fan-out path (an `Agent`/subagent tool call stripped by `--bare`) fixed same-day. The fix flipped the path from a no-op to a live one — 3–6 researcher subagents (`claude-sonnet-4.6`, up to 50 turns each) per dig call. Iterative re-testing across ~30 commits that day (each closed by a do → verify loop, hands-on real-app checks in dogfood's style) burned tens of dollars in a few hours. Root-caused by cross-referencing local Claude Code session logs against `git log` timestamps in the affected repo — the fan-out fix commit landed at the exact minute the usage burst began.

ADR-058/059's cost tier prices a *different* axis: the orchestrating **skill's own** token cost (which model runs the skill's reasoning, screenshot/video capture economy). It says nothing about the cost of the **feature under verification/dogfood** when that feature's own implementation calls a live paid LLM API — an axis invisible to a skill unless it's told to look for it. That axis recurs at its highest frequency in `nav:do`'s **unconditional** verify gate (every small change, not just occasional dogfood sessions) — and, by inheritance, in `nav:plan` Stage 4 and `nav:refactor`'s improve-phase, which both execute a sub-agent under "follow `/nav:do`'s discipline."

The user's explicit requirement (stated after two rounds of narrower proposals): this is **aware-while-writing + notify-at-the-gate**, not an automatic switch to a cheaper path. The skill doesn't get to unilaterally decide "use a mock instead" — it names what it noticed and what it's about to hit, and the user decides. This mirrors a pattern `nav:do` already has (`No test suite at all → flag it loudly`) rather than inventing a new one.

## Decision

1. **Root: `nav:do`'s 乙 (ambient awareness) gains a new signal** — alongside right-grain / header convention / N+1 / LOC thresholds: *this change wires up, un-mocks, or raises the fan-out/turn budget of a path that calls a live LLM API* (an agent-spawn tool re-enabled, an SDK client no longer stubbed, an effort/turn/researcher-count knob raised).
2. **Root: `nav:do`'s check gate #3 (verify gate, unconditional) notifies on that signal** — before exercising, name what would be hit (which live call, roughly how expensive: model, turn/fan-out count) and confirm once. Suggest (don't force) a cheaper substitute — mock the SDK client, pin the feature's own cost knob to its floor — for iterative fixes, reserving one full-cost run for the final confirmation.
3. **Inherited, no separate edit**: `nav:plan` Stage 4 and `nav:refactor`'s improve-phase sub-agent step both dispatch by explicitly citing "follow `/nav:do`'s discipline" / "follows `/nav:do`'s check" — the same mechanism ADR-023/008's inject↔check citation already uses. Fixing the root propagates to both by reference.
4. **Independent instances (shape's own real-app-driving steps, not inherited from `nav:do`)**, each gets its own notify line in the same "flag it, don't auto-swap" spirit:
   - `shape:dogfood` — a new caveat alongside the existing harness-artifact caveat: flag once per session if the feature under dogfood itself calls a live paid LLM, then drive most of the intent list at the feature's own cheapest sufficient setting, reserving one full-cost pass for the final experience check.
   - `shape:build` step 4 — a non-visual item's behavioral check gets the same flag before running, instead of silently re-running full-cost per item across a plan.
   - `shape:setup` — the verification chain's Core statement gets one sentence: a smoke leg that would hit a live paid LLM endpoint gets flagged before curling.
5. **Explicitly NOT decided here**: production-side cost governance for a shipped feature (rate limiting, per-user quota, auth, spend caps) is the product's own code, not a skill concern — that's a separate, `/nav:do`-scoped conversation on the product repo, not a marketplace skill change.

## Consequences

- **No new mechanism** — this rides the same "surface, don't silently act" idiom `nav:do` already uses for the missing-test-suite case, and the same inherit-by-citation structure ADR-023/008 already established for `plan`/`refactor`. Nothing new to learn.
- **The signal is a heuristic, not a detector** — no skill can reliably prove a code path calls a live LLM; the three named tells (SDK client un-mocked, agent-spawn tool re-enabled, fan-out/turn knob raised) are a starting list, expanded as new cases are seen.
- **Registration** — one bullet added to `plugins/nav/CLAUDE.md` (near the inject↔check / cost-tier bullets) and one to `plugins/shape/CLAUDE.md` (near the cost-tier bullet), each pointing here; this file is the single owner of the criterion text, the plugin CLAUDE.md files list only their own instances (rule ① — mirrors ADR-059's split). `nav` `0.8.0 → 0.8.1`; `shape` `0.7.0 → 0.7.1`; manifests regenerated; validator green.
- **Reversal is one line per instance** — a flag that proves too noisy in practice is removed from its SKILL.md + this ADR amended; no protocol changes ride on it.

## Out of scope

- Auto-detecting every live-LLM-call shape — hand-curated heuristic list, same posture as ADR-059's hand-curated cost-tier list.
- Any change to a specific product's own code (rate limits, quotas, auth, spend caps) — out of scope for a marketplace skill; a real finding there is the product repo's own `/nav:do` work.
- A hard default-to-cheap behavior — considered and rejected per the user's explicit correction; the skill notifies, the user decides.
