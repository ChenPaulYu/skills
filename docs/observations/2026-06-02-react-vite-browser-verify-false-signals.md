---
date: 2026-06-02
status: promoted
---

# Two React+Vite browser-verify *false signals* — a "filled" input that React never saw, and HMR console ghosts that look like crashes

> **Promoted →** `plugins/shape/references/browser-verify-gotchas.md` (the shared browser-verify slot, consumed by mockup/align/build). This file is the history; the reference is the live owner.
> Sibling: [[2026-06-01-browser-verify-audio-canvas-app-gotchas]] (audio/transform-canvas-specific gotchas) — these two are its **stack-generic** complement. Also an instance of [[2026-06-01-verify-the-belief-before-acting-on-it]].

## What prompted it

A session of `agent-browser` smoke-tests on a React 19 + Vite (HMR) app. Two verifications kept producing **false signals** — not app bugs, but "how to read the running thing correctly" knowledge I re-derived from scratch (the same re-derivation the [[2026-06-01-browser-verify-audio-canvas-app-gotchas]] session paid for in a different shape). Both are stack-generic (any React+Vite app), so they belong in the *general* browser-verify guidance the 2026-06-01 note explicitly predicted ("a small general nugget worth surfacing").

## The signal — two false signals, concretely

1. **A "filled" controlled input that React never saw → the verify stalls.** Driving a modal's text field with `fill`/`type` updated the DOM `value`, but the submit button stayed disabled and the bound state never changed. Cause: React patches the input's `value` setter and tracks the last value *it* wrote; a plain `.value =` (or a synthetic key event not routed through that descriptor) bypasses the patch, so no `input` event fires and `onChange` never runs. Fix that always worked — set through the native prototype descriptor + dispatch a bubbling `input`:
   ```js
   const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
   setter.call(input, value);
   input.dispatchEvent(new Event('input', { bubbles: true }));
   ```
   Driven via `eval`, not `fill`. Without it, you "test" a form that the app's state layer never received — a green-looking verify on a dead input.

2. **HMR console ghosts that look like crashes.** A console scan showed `An error occurred in the <Foo> component. Consider adding an error boundary…` for *several* components — yet every element rendered fine. Cause: the captured console buffer **accumulates across the whole session** (not cleared on reload); during editing, Vite Fast-Refresh re-applies modules and a boundary that *"Could not Fast Refresh"* (incompatible export in a hot-updated file) throws **transiently** and recovers on the next full reload. Those throws linger, bracketed by `[vite] hot updated` / `Could not Fast Refresh` lines — edit-time ghosts, not runtime bugs. Discriminate: it's real only if it (a) carries an underlying `TypeError`/`ReferenceError`, (b) survives a *clean full reload*, and (c) actually fails to render (fallback shown / element missing). If a reload + grep for a real error message comes up empty AND the expected testids are in the DOM, the warnings are ghosts. **Confirm renders by asserting testids exist, not by trusting a clean console.**

## Why it matters

Both are *asymmetric* failure modes that the obvious read gets backwards: #1 makes a broken verify look **passing** (worst kind — you ship believing it's tested), #2 makes a working app look **broken** (wastes a debug loop chasing a non-bug). Neither is caught by typecheck/lint/vitest — they only appear when driving the *real* browser, which is exactly why the project mandates an agent-browser smoke despite green jsdom tests.

## What it became

Already promoted — shipped as `plugins/shape/references/browser-verify-gotchas.md` under the shared browser-verify capability slot (mockup/align/build all consume it → past the N+1 trigger, so one owner, not three copies), with a pointer line in `plugins/shape/CLAUDE.md`. Written stack-neutral (no origin-project nouns) per the plugin's example convention. No ADR — a reference under an existing capability isn't a new skill or a family change.

## Evidence so far

Within one dense session each gotcha recurred (the controlled-input trap on every modal-input verify; the HMR ghosts across two reload cycles). Both are *structural* — they follow from "React controlled inputs" and "Vite Fast-Refresh + an accumulating console buffer", not from anything app-specific — so any future React+Vite browser-verify will hit them. Grounded (real session + the shipped reference), friction-tested (re-derived, not first-guess), principle-level (a generic read-the-signal-correctly rule) → cleared ADR-018's evidence gate for immediate promotion.
