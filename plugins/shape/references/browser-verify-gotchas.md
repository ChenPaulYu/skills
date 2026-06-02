# browser-verify gotchas — React + Vite apps

> Two non-obvious traps when verifying a running **React + Vite (HMR)** app through a
> browser-automation CLI (the slot's default, `agent-browser`). Each produces a *false signal* —
> a verify that looks done but isn't (#1), or a real render that looks broken (#2). Read before
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

---

*Origin: distilled from repeated rediscovery during browser-verify passes. Stack-neutral — applies
to any React 18/19 + Vite project, not a specific app.*
