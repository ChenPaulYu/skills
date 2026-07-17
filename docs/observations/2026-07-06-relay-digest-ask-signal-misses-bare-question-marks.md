---
date: 2026-07-06
status: landed
---

# digest's "waiting on others" only recognizes explicit `@name` flags, but real thoughts sometimes ask via inline ❓ markers with no `@` tag

> **TL;DR**: digest computes "waiting on others" strictly from `@`-flagged asks with no review back. But in practice, a reply can carry genuine open questions (marked ❓ inline) directed at a specific person without a formal `@` tag on them — the closing line says "these are the ones I really want your take on," which *is* an ask, just not one the skill's detector recognizes. Left to agent judgment, this is inconsistently caught.

## What prompted it

A thought (a member-to-member review thread) closed with three ❓-marked open questions for a named counterpart, plus "the rest you can just agree, no need to reply point-by-point" — i.e. explicit, scoped asks, but expressed via ❓ instead of `@name`. digest's spec (strictly: unresolved `@`-flag = waiting) would count this thread as already closed/FYI, since the reply itself carries no `@` tag. Surfacing it as "waiting on others" required an ad hoc judgment call rather than following the documented rule.

## The signal

Two independent fixes would each close the gap, and either is small and locatable:

- **In `digest`'s "Compute from the thought-stream" step**: also scan for inline ❓ markers as a secondary ask-signal (not just `@name`), so a reply with open ❓s directed at someone gets surfaced under "waiting on others" even without a formal flag.
- **Or, in `relay:review`/`relay:report`'s authoring guidance**: state explicitly that ❓ alone (without `@name`) does *not* register as an ask to digest — forcing authors to always pair a real open question with `@name` if they want it tracked, and treat bare ❓ as rhetorical/optional.

Either resolves the ambiguity; right now neither is written down, so the behavior is undefined and depends on whichever agent computes the digest that day.

## Evidence so far

- **Only case (2026-07-06, a private relay repo)**: a review thread closing with 3 ❓-marked asks to the counterpart, no `@` tag, required manual judgment to surface as open.

(One case → would have stayed `raw`; landed same-session instead, see Update below.)

## Update (2026-07-06) — fix landed same session, took the digest-side option

Of the two fixes named above, went with **teaching `digest` to recognize the fuller ask definition** rather than tightening authoring discipline — because re-reading `relay/CLAUDE.md` → *Resolution & decisions* showed the canonical ask definition was **already** "an `@`-flag, a `change`, or a `comment` with a real question" (not `@`-only); `digest`'s own `SKILL.md` had simply under-restated that broader rule as `@`-only in its "Waiting on others" step. So this was a restatement bug, not a missing protocol decision — no change needed to `report`/`review`'s authoring rules.

Patched `plugins/relay/skills/digest/SKILL.md`: the "Also compute what you're waiting on" bullet (Step 2), the "Waiting on others" description + diagram comment (Step 3), and the anti-patterns table now all say a thought counts as an open ask if it's the thread's latest non-closing entry **and** carries an `@`-flag, a `change`, **or** a `comment` posing a real question — not `@`-flag alone.

## Links

- Skills: `/relay:digest` (patched), `/relay:review`, `/relay:report` (canonical ask definition already correct in `relay/CLAUDE.md`, untouched).
- Related: [[relay-conflates-converge-sync-discuss]] (another case of relay's signal vocabulary being underspecified for real usage).
- Fixed in: `plugins/relay/skills/digest/SKILL.md` only — `plugins/relay/CLAUDE.md`'s canonical definition needed no change.
