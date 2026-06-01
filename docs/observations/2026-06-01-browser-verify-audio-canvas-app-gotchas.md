---
date: 2026-06-01
status: raw
---

# Browser-verifying an audio + pan/zoom-canvas web app: a recurring set of agent-browser gotchas that cost ~6 re-tries in one session

## What prompted it

Repeatedly using `agent-browser` to smoke-test a React music-canvas app (Crate: wavesurfer waveforms, a CSS-transform pan/zoom canvas, TipTap editor chips). The *feature* verifications were valuable and caught real bugs — but I hit the **same handful of environment gotchas over and over** (muting the wrong audio backend, coordinate clicks missing, the daemon wedging, fixed-position elements offset by the canvas transform). Each cost 1–3 wasted tool calls. None are app bugs; they're "how to drive *this kind of app* under agent-browser" knowledge that I re-learned from scratch each time.

## The signal — the gotchas, concretely

1. **Two audio backends, mute both.** wavesurfer (waveform engine) uses **WebAudio** → silence it by monkey-patching `AudioNode.prototype.connect` to reroute anything connecting to `destination` through a 0-gain node (installed via an `--init-script` so it runs *before* the graph builds). But the app's *other* player (`useAudioPlayer`) is a plain `new Audio()` → **MediaElement**, silenced by patching `HTMLMediaElement.prototype.play` to force `muted=true`. I conflated them several times and "muted" the wrong one. **You need both patches.**

2. **Coordinate clicks are unreliable on a transformed canvas / below the fold.** `mouse move x y; mouse down` frequently missed: the target had scrolled below the viewport, or the pan/zoom `transform` moved it. The robust fallback that always worked: `agent-browser eval` + `querySelector(...).click()` (or dispatch a real `MouseEvent`/`contextmenu` with explicit clientX/Y). Drive by selector, not pixels, whenever the canvas is transformed.

3. **`position:fixed` is offset under a CSS-transformed ancestor.** A right-click menu rendered with `fixed; left:x; top:y` landed far from the cursor, because *any* `transform` on an ancestor makes it the containing block for fixed descendants → the menu measured from the canvas origin (+ header offset + pan + scale), not the viewport. **Fix in-app: portal the menu to `document.body`.** Worth checking proactively in any transform-canvas app.

4. **The daemon wedges; `pkill -f agent-browser` + reopen is the reset.** Screenshots stopped landing, commands auto-backgrounded, `eval` started returning `about:blank`. A clean kill + fresh `open` recovered every time. Cheaper to reset early than to keep probing a stuck session.

5. **Some UI only exists in an interaction mode jsdom/read-mode can't reach.** The TipTap `@moment` chip only renders as a clickable NodeView in *edit* mode (read mode shows a plain markdown link); a freshly-created card's waveform needs a beat to decode before playback state is observable. Polling (`for i in 0..5: sleep 300ms; read state`) beat single-shot assertions — several "it's broken" readings were just "checked too early / in the wrong mode".

6. **Mock-data inconsistency surfaces as a "bug" only once the UI path becomes reachable.** Fixing the chip so it rendered then exposed that the seed cited 0:42–0:55 on a 32s dev audio file → silent playback. Two layers of "bug" that were actually stale mock numbers, not code. (Sibling observation: *verify the belief / data before assuming code.*)

## What it could become

A **project-local skill or a CLAUDE.md "browser-verify slot" note for Crate** — the per-project binding the shape plugins already gesture at ("browser-verify capability slot, default agent-browser, per-project override"). It would encode: the dual-mute init-script, "drive by selector not pixels on the canvas", the portal check, the daemon-reset reflex, poll-don't-snapshot, and "rule out mock data". Not a *general* skill — it's specific to audio + transform-canvas apps — but exactly the kind of thing that should live next to the project so the next session doesn't pay the ~6-retry tax again.

Also a small **general** nugget worth surfacing in any browser-verify guidance: **on a CSS-transformed canvas, prefer selector-driven `.click()` over coordinate clicks, and expect `position:fixed` to need a portal.**

## Evidence so far

One intense session, but the same gotchas recurred 2–6× each within it, and they're structural (they follow from "audio app" + "transform canvas" + "rich-text NodeViews"), not incidental — so any future session on a similar app will hit them again.
