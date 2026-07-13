# ADR 065 — description two-load convention — lean but honest (pilot: frame)

**Status**: accepted
**Date**: 2026-07-13
**Amends**: the "Frontmatter `description`" bullet in root `CLAUDE.md`'s Authoring conventions (was: "broad but honest")
**Pilot scope**: `plugins/frame` — 5 skills (`first-principles`, `orthogonal`, `dialectic`, `graft`, `analogize`)

## Context

34 skills' frontmatter `description` fields total 22,272 characters that sit in context on every turn regardless of whether a skill fires (median 641 chars, longest `frame:analogize` at 972). A Codex sidecar (`platforms/codex/descriptions.json`) already carries a ~240-char-per-skill compressed projection of the same 34 descriptions, built for Codex's own context budget (ADR-064) — proof a much leaner version can still carry the routing job, only Claude's own frontmatter hasn't benefited from it. Separately, 6 skills already declare `disable-model-invocation: true` (`reflect:catchup/observe/summarize`, `shape:build/setup`, `nav:refactor`): the model never reads a user-invoked skill's description to decide whether to fire it, so a trigger-phrase list there is pure dead weight.

## Decision — the two-load model

A skill's `description` field pays one of two different costs depending on how the skill is invoked, and the writing convention should target the cost that's actually being paid:

1. **Model-invoked skills pay a context-load cost** — the description sits in every turn's context, competing for budget, whether or not the skill fires. The convention for these: **lean but honest** — leading word (the verb) front-loaded, one trigger sentence per distinct branch/mode (no stacking near-synonym quotes), NOT/vs boundary sentences kept (they're load-bearing disambiguation, not padding), honest about scope (no pushy cross-domain claims).
2. **User-invoked skills (`disable-model-invocation: true`) pay a cognitive-load cost instead** — a human reads the description when choosing to invoke the skill by name; the model never routes off it. These skills' descriptions **drop the trigger-phrase list entirely** — a plain-language statement of what the skill does is sufficient, since there's no routing job to do.

This is not "shrink everything" — it's "spend the field's characters on the load it's actually paying for."

## Pilot: `frame` (5 skills)

Rewrite starts from `platforms/codex/descriptions.json`'s existing ~200-char projection for each skill (already proven to carry the routing job under a harder budget than Claude's) and **expands** — not from the ~650–972 char long-form version by deletion, since starting point determines the shape of the result (a deletion pass tends to preserve the original's structure and padding; a from-scratch expansion from a lean base does not). Each rewrite keeps the NOT/vs boundary sentence and 1–2 of the highest-frequency Chinese trigger phrases.

**Measurement**: total `frame` description character count, before vs after, via a one-line script reading each `SKILL.md`'s frontmatter `description` field. **Target**: ≤ 60% of the pre-pilot total (i.e. ≥ 40% reduction). **Trigger-preservation check**: a baseline matrix of representative trigger sentences (drawn from the pre-rewrite description, 2 English + 1 Chinese per skill where the frontmatter already carried a native Chinese quote) is checked against each rewritten description for a surviving routing cue (same word, synonym leading word, or an explicit branch sentence) — any sentence that loses its cue forces a fix to that skill's description, never a silent drop of the baseline sentence. Full baseline + result table: `docs/findings/2026-07-13-description-diet-pilot.md`.

**What this pilot does not decide**: whether real-world trigger accuracy holds after the rewrite (a live-usage question, not a static text-preservation check) is left to a separate acceptance pass by Fable/Paul — the execution here only verifies that a routing cue for each baseline sentence still exists in the new text. Whether to roll the convention out to the remaining 29 skills is a separate, later decision gated on that acceptance.

## Why

- The dual-load framing (model reads it every turn vs. human reads it once, choosing) is the single fact that both explains why 22k chars of always-loaded description is a real cost, and why 6 of the 34 skills are exempt from the trigger-phrase requirement altogether — restating "broad but honest" without this distinction conflated two different economies into one rule.
- Piloting on one plugin (5 skills, not 34) bounds the risk of a bad convention shipping wide before it's been checked against real trigger phrasings, matching the project's own "test before marketplace-wide" precedent (ADR-058 → ADR-059).
- Starting the rewrite from the Codex sidecar's shape (not the long-form original) is deliberate: mattpocock/skills' writing-great-skills theory holds that a description's *shape* — what's said first, what's cut, what's never included — encodes the writer's model of the routing job; editing down from a padded original inherits the padding's structure.

## Consequences

- `plugins/frame/skills/{first-principles,orthogonal,dialectic,graft,analogize}/SKILL.md`: `description` frontmatter field rewritten; skill body unchanged.
- Root `CLAUDE.md`'s Authoring conventions "Frontmatter `description`" bullet rewritten to state the two-load principle in one sentence and point here for the full rationale + pilot method.
- `docs/findings/2026-07-13-description-diet-pilot.md`: new file, the pilot's baseline matrix + before/after character counts + cue-preservation results.
- `platforms/codex/descriptions.json` is **not** touched by this pilot — whether the Claude and Codex versions should converge to one shared text is left open for a later session, once the pilot's trigger-accuracy verdict is in.
- Rolling this convention to the other 29 skills is explicitly **not** decided here — see the pilot scope above.
