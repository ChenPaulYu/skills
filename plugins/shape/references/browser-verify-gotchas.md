# browser-verify gotchas — the shared slot's field manual

> Hard-won traps when verifying a running app through a browser-automation CLI (the slot's
> default, `agent-browser`). Each is a **false signal** (a verify that looks done but isn't, or a
> real render that looks broken) or a **silent cost** (a pass that "succeeds" yet degrades the
> user's machine). Organized **universal first**, then by app-shape (audio · transform-canvas),
> then by stack (React + Vite). Read before trusting a screenshot or a console scan.
>
> This is the single owner of browser-verify mechanics for every consumer of the slot
> (`/shape:mockup` · `/shape:align` · `/shape:build` · `/shape:dogfood` · `/nav:refactor`'s browser
> pass). Per-project CLAUDE.md keeps only project-specifics (ports, the dev script); the universal
> mechanics live **here**, not re-learned per project.

## Universal — any app driven through agent-browser

### U1 — Isolate the session: `--session <name>`
Two concurrent agent sessions share the default daemon — one navigates the other's page mid-test, so clicks land on a different document and verifies go haywire for reasons unrelated to the code. Always launch with `--session <task-name>` isolation.

### U2 — Assert state, never DOM text
`textContent.includes("…")` lies when content is **always-mounted but clipped** (a motion-grow container keeps children in the DOM while collapsed; a closed dock still contains its text). Assert **state** — measure element rects, read explicit probes, check that a testid exists — not text presence. A clean console + present text is not "it rendered."

### U3 — Measure before you toggle
A retried `eval` snippet that re-clicks a toggle (chevron, expander) leaves open/close state **opposite** to your assumption; subsequent coordinate clicks then miss (target beyond viewport). Guard toggles: `if (rect.height < 50) click()` — never blind-toggle.

### U4 — Drive by selector, not pixels
`mouse move x y; mouse down` misses when the target scrolled below the fold or a CSS `transform` moved it. The robust fallback: `agent-browser eval` + `querySelector(…).click()` (or dispatch a real `MouseEvent` / `contextmenu` with explicit `clientX/Y`). Prefer selector-driven clicks whenever layout is dynamic. (Caveat: a synthetic `.click()` has **no user activation** — audio paths need real input; see A2.)

### U5 — Poll, don't single-shot
Some UI only exists in a mode the snapshot can't reach (a rich-text NodeView renders only in *edit* mode; a freshly-created card's waveform needs a beat to decode). Many "it's broken" readings are "checked too early / in the wrong mode." Poll (`for i in 0..5: sleep 300ms; re-read`) before asserting broken.

### U6 — Rule out the data before blaming the code
A "bug" is often **stale mock/seed data** surfacing once a UI path becomes reachable (e.g. a seed citing 0:42–0:55 on a 32-second dev audio file → silent playback). Verify the data / the belief before assuming the code is wrong. (Sibling: *verify the belief before acting on it.*)

### U7 — The daemon wedges → kill + reopen
Screenshots stop landing, commands auto-background, `eval` returns `about:blank` — the daemon is stuck. `pkill -f agent-browser` + a fresh `open` recovers every time. Reset early; don't keep probing a wedged session. (A wedged daemon *announces itself*; the teardown leak in U8 does not.)

### U8 — Teardown is the half that silently skips — `close` at the end of EVERY pass
`open` is pulled by a need (you must *see* the thing); `close` is pulled by **nothing in your loop** — pass-end is a silent non-event, and the cost (a headless `Chrome for Testing` renderer pinning a core) lands on the **user's** machine, invisible from inside the tool. One session left **12 Chrome-for-Testing procs, one at 90% CPU**; only noticed when the user said the laptop got slow. `close` dropped it to zero instantly.

- **Knowledge ≠ trigger.** A rule in *this* doc is **polled** — it fires only if the executing path happens to read it. So the real fix is to make `close` a **walked step** in whatever you actually run: the slot contract's `open → drive → screenshot → compare → close`, and any project's smoke rule written as a *sequence ending in `close`*. A note here is necessary, not sufficient.
- **If you sweep zombies or build a reaper, key on PROVENANCE, not a CPU heuristic.** agent-browser spawns a separate binary — `Google Chrome for Testing` under `--user-data-dir=…/agent-browser-chrome-<uuid>` — so filter on *that* and you can never touch the user's real browser. A CPU threshold would kill a browser the user is actively using. **Prefer a notifier** ("N stale verify browsers — run `agent-browser close`") **over an auto-killer**: making the invisible visible *is* the fix; killing is a separate, riskier choice.
- **Manual sweep:** `pkill -f "Google Chrome for Testing"` (+ `pkill -f vitest` if an IDE test-watch is stacked on top — see R-note). Leave the real dev server (Vite + backend) alone — match the *verify* artifacts, not all `node`.

## Audio apps

### A1 — Mute it (your tests play sound on the user's machine otherwise)
Simplest: launch with `--args "--mute-audio"`. When an engine builds its own graph that the flag misses, patch **both** backends — and an app usually has both:
- **WebAudio** (e.g. a waveform engine): reroute `AudioNode.prototype.connect` so anything connecting to `destination` goes through a 0-gain node — installed via `--init-script` so it runs *before* the graph builds.
- **MediaElement** (a plain `new Audio()` player): patch `HTMLMediaElement.prototype.play` to force `muted = true`.

Muting only one leaves the other audible — confirm which backend the sound came from.

### A2 — Audio needs REAL input (user activation)
A synthetic `.click()` has no user-activation gesture, so audio won't start (browsers gate autoplay on it). Drive playback with real `mouse move/down/up`, not `eval(…).click()`. This is in tension with U4 (selector-click for *placement*) — use selector clicks for navigation, real input for the activation that starts sound.

## CSS-transform (pan/zoom) canvas

### T1 — `position:fixed` is offset under a transformed ancestor
Any `transform` on an ancestor makes it the **containing block** for `fixed` descendants — so a `fixed; left:x; top:y` menu measures from the canvas origin (+ header offset + pan + scale), not the viewport, and lands far from the cursor. **Fix in-app: portal the menu to `document.body`.** Check proactively in any transform-canvas app. (Selector-over-coordinate clicks — U4 — matter most on a transformed canvas.)

## React + Vite (HMR) specifics

### R1 — Setting a controlled input doesn't fire React's `onChange`

**Symptom.** You `fill`/`type` into a field, the DOM `value` updates, but submit stays disabled / bound state never changes — the verify is stuck on an input that *looks* filled.

**Why.** A controlled input's value is driven by state; React patches the node's `value` setter and tracks the last value it wrote. A plain `.value = …` (or a synthetic key event) bypasses the patched setter, so no `input` event reaches React's delegated listener and `onChange` never runs.

**Fix.** Set through the **native prototype descriptor**, then dispatch a bubbling `input` event:

```js
const input = document.querySelector('<selector>');
const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
setter.call(input, '<value>');
input.dispatchEvent(new Event('input', { bubbles: true }));
// now click the (no-longer-disabled) submit control
```

Use `HTMLTextAreaElement.prototype` for a `<textarea>`. Drive via the CLI's `eval`, not `fill`/`type`.

### R2 — "An error occurred in `<X>`" with no underlying error = HMR artifact

**Symptom.** The console scan shows React errors — `An error occurred in the <Foo> component. Consider adding an error boundary…` — for several components, yet every element still renders correctly.

**Why.** The captured console buffer **accumulates across the whole session** (not cleared on reload). During editing, Vite Fast-Refresh re-applies modules; a boundary that *"Could not Fast Refresh"* throws **transiently** and recovers on the next full reload. Those throws linger, bracketed by `[vite] hot updated:` / `[vite] invalidate … Could not Fast Refresh` lines — edit-time ghosts, not runtime bugs.

**Discriminate.** It's a real bug only if it holds up under *all* of these:

| Check | Real bug | HMR artifact |
|---|---|---|
| An underlying `TypeError`/`ReferenceError` accompanies the "error occurred" line | yes | **no** — the warning stands alone |
| Survives a **clean full reload** (not just an in-place HMR cycle) | yes | no — gone after reload |
| The component fails to render (fallback shown / element missing) | yes | no — element is in the DOM |
| Lines bracketed by `[vite] hot updated` / `Could not Fast Refresh` | no | **yes** |

**Verify clean.** Reload, then grep the console for an *actual* error (`TypeError|ReferenceError|cannot read|is not`); if empty **and** the expected testids are in the DOM, the boundary warnings are ghosts.

**R-note (test-watch amplifies U8).** An IDE test-runner **watch** (e.g. the VS Code Vitest extension) re-runs the whole suite on every save, spawning a worker per core. Stacked on zombie verify browsers (U8), RAM exhausts and the machine swaps. Don't run a continuous test-watch *and* manual verify passes at once.

---

*Origin: distilled from repeated rediscovery across browser-verify sessions (audio + transform-canvas apps, multi-session testbeds, React+Vite stacks). Universal/audio/transform rules apply on any stack; R1/R2 are React+Vite-specific. Promoted here from four field observations so every slot consumer inherits them instead of re-learning per project (the slot's whole purpose).*
