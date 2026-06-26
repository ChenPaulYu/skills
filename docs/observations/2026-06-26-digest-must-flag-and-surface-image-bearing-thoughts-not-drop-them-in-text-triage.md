---
date: 2026-06-26
status: raw
---

# relay:digest is a TEXT triage that silently drops a thought's images — it must flag image-bearing thoughts and the acting agent must render/point, not paraphrase the picture away

> Source: 2026-06-26, after a relay report (a genUI/device design thought) carried screenshots + mockups; digest surfaced only "subject + the one-line ask", so the counterpart's agent had no signal that the substance was partly visual.

## What prompted it

A `report` embedded images (screenshots of a generated instrument, mockup frames) via the content repo's asset convention — the *authoring* side handles images fine. But `/relay:digest` presents a triage of **subject + one-line ask** ("the body is read on open"). It never says "this thought has images", and never tells the reading agent to surface them. So in an agent↔human relay, the human on the receiving end can be shown a text paraphrase while the actual visual payload — the whole point of that report — never reaches their eyes.

## The signal

**The gap is on the READ side, not authoring.** digest assumes "read on open" is enough, but for an image-bearing thought "read on open" by an *agent* doesn't mean the *human* SEES the picture — the agent can paraphrase it away. A text triage structurally can't represent a screenshot; if it doesn't *flag* the visual, the visual is lost in triage.

The skill-feedback bind (S · P · D):
- **S** = `relay:digest` (with the format-contract owner `relay/CLAUDE.md` and the authoring side `relay:report`)
- **P** = the "present, filtered for the viewer" step (and the open-flow that acts on a surfaced thought)
- **D** = while scanning each surfaced thought, **detect image references** (markdown images / asset-folder links) and **mark the pointer** ("📎 N images — open to view"); and state the **surface contract**: an agent acting on a flagged thought **renders the images to the human (or points them at the original file)**, never paraphrases the picture away. Stays read-only (detection only — digest still writes nothing).

Generalizes: any agent-mediated text-triage of human-facing content (a review queue, an inbox digest, a notification) has the same failure — visuals vanish unless the triage flags them. The fix is cheap (a regex for image refs + a render/point duty) and preserves digest's read-only discipline.

## Evidence so far

- **Only case (2026-06-26, relay genUI/device report with images)**: report carried screenshots/mockups; digest's text triage gave no image signal; surfaced as a gap during a relay-format pass. (Format-contract clause + report authoring line landed same day; digest's flagging duty is the remaining implementation.)

(One case → stays `raw`. Promote if a second image-bearing thought gets triaged text-only and the human misses the visual — that's the trip-wire to make image-flagging a tested part of digest's present step.)

## Links

- Implements the image clause added to `plugins/relay/CLAUDE.md` → *Format contract* + `relay:report` authoring (2026-06-26); the remaining arm is `relay:digest`'s detect-and-flag.
- Sibling read-side concern to [[2026-06-26-mockup-activation-should-detect-remote-session-and-serve-a-url]] (both: an agent-mediated surface that silently drops the visual unless it's made explicit).
