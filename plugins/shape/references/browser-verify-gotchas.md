# browser-verify gotchas — React + Vite apps

> Three non-obvious traps when verifying a running **React + Vite (HMR)** app through a
> browser-automation CLI (the slot's default, `agent-browser`). Each produces a *false signal* —
> a verify that looks done but isn't (#1), a real render that looks broken (#2), or a pass that
> "succeeds" yet silently degrades the whole machine for every pass after it (#3). Read before
> trusting a screenshot or a console scan on a React+Vite stack.

## 1 — Setting a controlled input doesn't fire React's `onChange`

**Symptom.** You `fill`/`type` into a field, the DOM `value` updates, but the app's submit stays
disabled / the bound state never changes — the verify is stuck on an input that *looks* filled.

**Why.** A React **controlled** input's value is driven by state. React patches the node's `value`
setter and tracks the last value it wrote; a plain `.value = …` (or a synthetic key event that
doesn't go through that descriptor) bypasses the patched setter, so no `input` event reaches
React's delegated listener and `onChange` never runs.

**Fix.** Set through the **native prototype descriptor**, then dispatch a bubbling `input` event:

```js
const input = document.querySelector('<selector>');
const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
setter.call(input, '<value>');
input.dispatchEvent(new Event('input', { bubbles: true }));
// now click the (no-longer-disabled) submit control
```

Use `HTMLTextAreaElement.prototype` for a `<textarea>`. Drive this via the CLI's `eval`, not
`fill`/`type`.

## 2 — "An error occurred in `<X>`" with no underlying error = HMR artifact

**Symptom.** The console scan shows React errors — `An error occurred in the <Foo> component.
Consider adding an error boundary…` — for several components, yet every element still renders
correctly.

**Why.** The captured console buffer **accumulates across the whole session** (it isn't cleared on
reload). During editing, Vite Fast-Refresh re-applies modules; a boundary that *"Could not Fast
Refresh"* (e.g. an incompatible export in a hot-updated file) throws **transiently** and recovers
on the next full reload. Those throws linger in the buffer, bracketed by `[vite] hot updated:` /
`[vite] invalidate … Could not Fast Refresh` lines — edit-time ghosts, not runtime bugs.

**Discriminate.** It's a real bug only if it holds up under *all* of these:

| Check | Real bug | HMR artifact |
|---|---|---|
| An underlying `TypeError`/`ReferenceError` message accompanies the "error occurred" line | yes | **no** — the boundary warning stands alone |
| Survives a **clean full reload** (not just an in-place HMR cycle) | yes | no — gone after reload |
| The affected component fails to render (boundary fallback shown / element missing from DOM) | yes | no — element is in the DOM |
| Lines are bracketed by `[vite] hot updated` / `Could not Fast Refresh` | no | **yes** |

**Verify clean.** Reload, then grep the console for an *actual* error message
(`TypeError|ReferenceError|cannot read|is not`); if that's empty **and** the expected elements are
in the DOM, the boundary warnings are ghosts. Confirm renders by asserting element testids exist —
not by trusting a clean console.

## 3 — Repeated verify passes leave zombie browsers + piled-up test runs that saturate the machine

**Symptom.** After several browser-verify / smoke cycles the *whole machine* grinds — load average
in the dozens-to-hundreds, swap full, even unrelated apps stutter. The verify itself "passed", but
the box is now degraded and the *next* pass is slow or flaky for reasons that have nothing to do
with the code under test.

**Why.** Two leaks compound, and both are invisible because they're headless / backgrounded:

- agent-browser drives a headless **Chrome for Testing**. A renderer that lands on a busy paint
  loop (a waveform / canvas card re-rendering every frame) pegs a full core; if the browser isn't
  *cleanly closed* at the end of the pass, that renderer keeps spinning after the verify returns.
  Several abandoned passes = several permanently-pinned cores you never see.
- An IDE test-runner **watch** (e.g. the VS Code Vitest extension's continuous run) re-runs the
  whole suite on *every save*, spawning one worker per core each time. Stacked on the zombie
  browsers, RAM exhausts and the machine starts swapping — which slows *everything*, not just the
  dev loop.

**Discriminate.** When the box feels slow, check whether it's leaked verify processes vs. a real
workload: `uptime` (load average **≫ core count**) + `sysctl vm.swapusage` (near-full swap) +
`ps -Aceo pcpu,comm -r | head` showing `Chrome for Testing … (Renderer)` near 100% or a fan of
`node (vitest N)` workers = leak, not a code problem.

**Fix / hygiene.**

- **Close the browser at the end of every verify pass** (agent-browser's close/quit) — don't just
  walk away. A headless leak is silent; nothing on screen tells you it's still burning a core.
- Don't run an IDE test-**watch** *and* manual verify passes at the same time. Turn off
  continuous / watch-on-startup during a browser-verify session.
- Sweep zombies when needed: `pkill -f "Google Chrome for Testing"` + `pkill -f vitest`. Leave the
  real dev server (Vite + backend) alone — match on the *verify* artifacts, not all `node`.

---

*Origin: distilled from repeated rediscovery during browser-verify passes. #1/#2 are React+Vite
specific; #3 is stack-neutral (the leaking processes are agent-browser + whatever test-watch the
project runs).*
