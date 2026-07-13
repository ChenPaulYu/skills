# ADR 072 — Invocation direction law: overlap inventory, partial landing

**Status**: accepted (partial — see Open item)
**Date**: 2026-07-13
**Source**: `blueprints/thoughts/2026-07-13-invocation-direction-law.md` (W5) — a proposal, not itself a decision; several of its own points are explicitly marked "留給 Paul" (left to the user) rather than ratified.

## Context

The thought proposes adopting `mattpocock/skills`' invocation direction law: a summoned-only skill (`disable-model-invocation: true`) should never be the target of a plain-prose recommendation from a model-invocable skill — only reachable via explicit "you can type `/X` yourself" framing or an `AskUserQuestion` offer-gate (ADR-007/015). Before landing anything, this ADR checks how much of that proposal already has an owner in this repo's existing rules, per the standing discipline that a repeated rule gets one owner, not a second copy.

## Inventory — the thought's four proposals against existing coverage

1. **Each skill visibly self-declares its invocation category** (thought's proposal 1; minimal form: bucket README's Invocation section into User-invoked / Model-invoked, mirroring `mattpocock/skills`' README). Checked: `README.md`'s Invocation section currently lists every skill flat under its plugin heading — no invocation-category bucketing exists anywhere in the repo, and no CLAUDE.md rule asks for one. **Gap, no owner. Landed** — new root `CLAUDE.md` bullet ("★ Invocation category is visible, not just in frontmatter").
2. **A directional cross-reference rule**: model-invocable skill prose may never plainly say "invoke `/X`" when `X` is summoned-only; must use an offer-gate or explicit user-typed framing instead (thought's proposal 2). The thought's own plain-prose audit found roughly a dozen loci across `nav:audit`/`do`/`map`/`plan`/`sync` and `shape:reconcile` (→ `nav:refactor`) plus `shape:dogfood`/`elicit`/`mockup` (→ `shape:build`) that would need re-wording under a strict version of this rule. Its own "開放題" section (lines ~157–163 of the thought) explicitly defers whether those loci count as violations, and whether the ones already routed through an `AskUserQuestion` offer-gate should be exempt, to Paul's judgment — unresolved by the thought's own author. **Not landed here.** Ruling on this would mean a cheap-tier executor silently deciding a dozen-locus policy question the thought itself reserved for the user; that's out of scope for this pass. The thought file stays in git history; picking this up is a future `/shape:elicit` session or a direct ruling, not a mechanical follow-up.
3. **The 6 summoned-only skills' descriptions drop `"Fires on …"` trigger-list language** (thought's proposal 3). Checked: [ADR-065](docs/adr/065-description-lean-but-honest-pilot-frame.md) (accepted the same day) already states this exact convention marketplace-wide — user-invoked skills' descriptions "drop the trigger-phrase list entirely," since the model never routes off a user-invoked skill's description. The actual rewrite of these 6 skills (`nav:refactor`, `reflect:catchup`/`observe`/`summarize`, `shape:build`/`setup`) is already queued as a Next item in `blueprints/plan.md` ("description 減重推廣到其餘 29 skill"). **Fully absorbed — no new owner needed.**
4. **The relationship to `blueprints/thoughts/2026-07-02-elicit-summon-widen-not-autofire.md`** (thought's proposal 4 / background). Pure narrative explaining why `elicit` stayed model-invocable despite being a natural candidate for lock-down. Not a rule — nothing to land.

## Decision

Land proposal 1 only, as one root `CLAUDE.md` bullet citing this ADR. Proposal 2 is explicitly **not** ruled on — left open. Proposal 3 needs no new bullet (already owned by ADR-065 + the plan.md Next queue). Proposal 4 is narrative context, not a rule.

## Why

- Rule ① (one owner) cuts both ways here: proposal 3 already has an owner (ADR-065), so restating it would be the exact copy-leak the marketplace's own conventions exist to prevent.
- Proposal 2 is a genuine gap in written policy, but the thought's own text shows its author hadn't settled the dozen-locus question — landing a strict rule here would misrepresent an open call as closed, which is worse than leaving it visibly open.
- Proposal 1 is a mechanical, low-risk gap (a missing README grouping) verifiable by inspection, not a judgment call — safe to land without further ratification.

## Consequences

- Root `CLAUDE.md`: one new Authoring-conventions bullet ("★ Invocation category is visible, not just in frontmatter").
- `README.md`: the actual bucketing of the Invocation section into User-invoked / Model-invoked is **not executed in this commit** — added as a `blueprints/plan.md` Next item so the stated convention doesn't silently go unapplied.
- `blueprints/thoughts/2026-07-13-invocation-direction-law.md`: status line → "graduated (partial) → ADR-072 — proposal 2's directional-rule scope remains an open policy question, carried forward, not resolved." (Deliberately not a bare "graduated" — that would read as full resolution, which proposal 2 isn't.)

## Open item

Proposal 2 (the directional cross-reference rule and its dozen contested loci) remains genuinely undecided. Whoever picks it up next should re-read the thought's own "開放題" section in full before ruling — this ADR does not pre-judge it, and no wording in `nav:audit`/`do`/`map`/`plan`/`sync` or `shape:reconcile`/`dogfood`/`elicit`/`mockup` was changed by this pass.
