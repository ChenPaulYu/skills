---
date: 2026-06-16
status: raw
---

# A "where does X go?" layout question that won't settle is usually a missing model in disguise — elicit-drill *under* it beats mockup-ing the surface

> Source: TrackMate testbed — a session that opened on "where do the two review bands sit?" and ended with a whole git-as-engine history/version model.

## What prompted it

The session began as a `/shape:mockup`-shaped layout question: where do two review bands sit relative to the lanes. A mockup got built. But the placement kept *not settling* — each arrangement raised "but then what is this band, really?". Switching to `/shape:elicit` and drilling **under** the surface ("is this even a tab? what IS a version? is the graph a git DAG or something else?") is what unlocked it: the real question was never placement, it was an undefined version model. Once the model converged, placement fell out trivially.

## The signal

**A surface UI/placement question that resists a clean answer is a symptom: the model underneath it is undefined.** Mockup-ing harder renders more candidates for a question whose *frame* is wrong. The move is to drill — `/shape:elicit` going from "which option" → "what IS this thing / should it exist" — until the missing model surfaces; then the original placement is a near-trivial projection of it.

This sharpens the elicit↔mockup boundary from the *answering* side: mockup is right when the candidates are real and the frame is settled; when candidates keep destabilizing each other, that instability **is** the tell that the frame (the model) is what's actually unsettled → elicit first, mockup after.

## Evidence so far

- **Only case (2026-06-16, TrackMate)**: "review bands placement" → elicit drilled through review-as-peek-not-tab, fork=branch, take=commit, undo/restore/seal, single-truth=focus → the full history model. The *final* placement decisions (graph summoned on stage, timeline as transient review) became obvious once the model existed; they had been unanswerable for several mockup rounds before.

(One case → stays `raw`. Promote when a second session shows a stuck *visual* decision dissolving once the underlying model/ontology is drawn out by elicit — i.e. the pattern "render kept failing because the concept was missing" recurs. Relates to the mockup↔elicit boundary in `plugins/shape/skills/{mockup,elicit}` and to [[2026-06-10-first-principles-as-post-design-self-audit]].)
