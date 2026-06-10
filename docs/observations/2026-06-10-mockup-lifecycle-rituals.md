---
date: 2026-06-10
status: raw
---

# Mockup lifecycle rituals — scaffold-strip, story-scene master, and the agent must look at its own pixels

> Source: TrackMate visual-identity / pool / master mockup sessions (2026-06-10) — a full day of `/shape:mockup`-style work surfaced three refinements the skill doesn't yet codify.

## 1. Scaffold-strip(決策鷹架用完就拆)

The decision deck (top bar of live toggles: theme × accent × palette × presence…) is scaffolding. The day's full cycle worked like this and felt right:

1. toggles collect picks → 2. every pick recorded in the file-top `Pick:` comment as it lands → 3. once all picks are made, **strip the toggles and hardcode the picks** → 4. the file is restamped as 定稿樣本 (intent-as-of date, canon doc pointer).

Skipping step 3 leaves a "decided" mockup that still *looks* undecided — the user explicitly asked for the strip ("我現在不需要這麼多選項,我已經做好決定了"). Candidate addition to `shape:mockup`: after the pick, *strip the scaffolding*, don't just record the pick.

## 2. Story-scene master mockup(五幕累積)

After several topic mockups (identity / pool / find-ui), the converged whole was confirmed via ONE integrated master where a scene-stepper accumulates content (resting → find & keep → propose & apply → arrange → open pool). Walking the five scenes verifies the *product narrative*, which a static full screen can't. Pattern: **topic mockups converge decisions; a master mockup with cumulative scenes verifies the story.** The master then becomes the canon doc's 定稿樣本 pointer.

## 3. The agent must look at its own pixels

User said the sidebar 「沒質感」. The cause was only diagnosable after the agent screenshotted the render itself (agent-browser): four near-identical beiges fighting, flat type hierarchy, a CSS-specificity bug leaking stage-2 elements into scene 1 — none of it visible in the code. Two-step rule worth codifying:

- **Before handover:** screenshot the artifact yourself; look at it as a designer (greys, hierarchy, spacing), not just "did it render".
- **On taste feedback** ("ugly / cheap / off"): screenshot FIRST, diagnose from pixels in concrete design terms, then edit. Don't edit from imagination.

This is the browser-verify slot applied to mockups themselves, not just built features — today it also caught a real interaction bug the code-read missed.

## Related

- `2026-05-29-visual-decisions-converge-by-real-render.md` — the upstream principle; these are its lifecycle mechanics.
- `2026-06-08-browser-verify-teardown-is-the-skipped-half.md` — sibling verify discipline.
