---
date: 2026-06-16
status: raw
---

# Dogfooding on COPIED real data turns the data's own artifacts into false bug-findings — ground each finding against current code, and re-check on a FRESH entity

> Source: a visual-polish `/shape:dogfood` of Crate's canvas cards, driven on a throwaway *copy* of a real 9-card crate. 4 visual "findings" — 3 dissolved on grounding; only 1 was a real code defect.

## What prompted it

To dogfood the card visuals I needed a full mix of card kinds, so I copied a real crate's graph (`crate-0299`: concept/media/track/clip/note) into a throwaway and drove that. The session surfaced 4 visual findings. The user OK'd fixing them. But grounding each against the *current code* (the disciplined half) walked back **three of the four** — they were properties of the copied data, not code bugs:

- **#2 "citation chip prints the start time twice"** (`Accordion 0:11 0:11–0:25`). Real? No. The seed's mention nodes carried an **old label format** baked in (`data-label="Accordion 0:11"`); current code (`pickerData.ts:94`) generates `layerName · trackTitle` — no duplicated time. A stale-data artifact.
- **#4 "a caramel circle is clipped at the media thumbnail's corner."** Real? No. Seed card coordinates showed **no card overlapped the media** (clip at (338,929), media at (1447,410)); media cards have no such element in code (the `w-7 rounded-full` is a clip/track *play button*). The orange nub was **content of the YouTube thumbnail image itself**.
- **#1 "inline citation chips disrupt the paragraph's vertical rhythm."** Real? No — the body already uses `leading-[1.85]` (~26px line) and the chip is ~20px, so it sits *inside* the line; no expansion. The perceived looseness was the (intentional) generous leading + the data-widened chips from #2.
- **#3 "REFERENCES · 0 empty section always shows."** Real? **Yes** — `ConceptCard` gated the footer on `!collapsed` only. The one finding that survived; fixed (summon-on-select like the tag row).

Earlier the same session, an F5-style false finding had already appeared (paste-link "doesn't resolve a title" — but the dogfood had used a *fake* video id). So: **same failure mode, three+ times in one session.**

## The signal

`/shape:dogfood`'s engine is "drive the real build and trust what you see." But when the *data* you drive is a **copy of a real record**, the copy carries that record's **authored/legacy artifacts** — old serialization formats, hand-placed layouts, embedded media content — and those render in the live UI as things that *look like defects*. The screenshot is real; the "bug" is in the bytes you seeded, not the code. Trusting the capture (the skill's correct default) backfires precisely here.

This is a **distinct class of artifact** from the one `/shape:dogfood` already warns about. Its caveat says *discount the **harness's** own artifacts* (short viewport, synthetic pointer, sparse fixtures). That's about the **rig**. This is about the **seed**: real-but-stale/authored *data* is a third source of false signal the caveat doesn't name.

The move (the disciplined half that saved it):

1. **Ground every finding against *current* code before fixing** — grep the generator (`pickerData.ts` for the label), check the data shape (card coords for the "overlap"), read the existing CSS (`leading-[1.85]`). ~2 min each; here it cancelled 3 of 4 "fixes."
2. **The sharpest discriminator: does it reproduce on a FRESH entity?** A defect reproduces when you create a *new* card; a seed artifact only shows on the copied one. Inspecting only the copy can't tell them apart — make a fresh one. (#3 was confirmed real by seeding a brand-new 0-ref concept; #2 was killed by seeing current code emits a different label.)
3. **Report the walk-back honestly** — "3 of 4 were data artifacts, here's the grounding" — don't quietly fix non-bugs (that violates surgical-change discipline: editing correct code to chase a phantom).

The deeper atom: **a real screenshot is not a real bug.** Dogfood's "trust the capture" is about *experience* (is the flow smooth?), which the capture faithfully shows; it is **not** authority on *code correctness* (is this a defect?), which only grounding against current code + a fresh repro establishes. Copied-real-data quietly swaps one question for the other.

## Evidence so far

- **Only case (2026-06-16, Crate visual dogfood)**: 4 findings, 3 false (stale label format · YT-thumbnail content + no-overlap · existing generous leading), 1 real (`!collapsed`-only references gate). Plus a prior same-session F5 (fake video id). Grounding was cheap (grep `pickerData.ts`, read card coords, read CSS) and each walk-back was code-confirmed, not hand-waved.

(One session → stays `raw`, but unusually strong: the failure mode recurred 3–4× *within* the session, and each walk-back was grounded in a concrete code/data fact, not a guess. Trip-wire to promote: a second session where dogfood-on-copied-data fabricates a finding — then `/shape:dogfood`'s "discount harness artifacts" caveat should be widened to name **seed-data artifacts** explicitly, with "re-check on a fresh entity" as the counter-move.)

## Relations

- Sibling — same family (verify-before-act), different *source* of the false signal: [[2026-06-01-verify-the-belief-before-acting-on-it]] verifies the **user's belief**; this verifies a **finding from a capture on copied data**. Both: ground the claim in code before designing/fixing around it.
- Extends `/shape:dogfood`'s "discount the harness's own artifacts" caveat (rig artifacts) to a new class (**seed/data artifacts**). Candidate input to a future tightening of that skill's caveat — not an ADR yet.
