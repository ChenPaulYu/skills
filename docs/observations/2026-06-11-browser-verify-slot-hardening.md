---
date: 2026-06-11
status: raw
---

# Field-proven browser-verify hardening — four rules currently stranded in one project's CLAUDE.md, all universal

## What happened (TrackMate testbed, one afternoon)

A real-click audio verification descended into an hour of phantom failures. Untangling found four independent traps, each later codified into TrackMate's project CLAUDE.md:

1. **Session collision** — two concurrent Claude sessions shared the default agent-browser daemon; one navigated the other's page mid-test (clicks landed on a different document). Fix: `--session <task名>` isolation, always.
2. **Audio audibility** — tests played sound on the user's machine; user had to ask for silence. Fix: launch with `--args "--mute-audio"`.
3. **Text-presence false positives** — `textContent.includes(...)` asserted "dock open" while the dock was collapsed: always-mounted content (motion-grow keeps children in DOM, clipped) makes text assertions lie. Fix: assert *state* (measure rects / read probes), never DOM text presence.
4. **Toggle parity drift** — retried eval snippets re-clicked a toggle (chevron), leaving open/close state opposite to assumption; subsequent coordinate clicks hit empty space (y beyond viewport). Fix: measure-before-toggle (`if (h < 50) click`), never blind-toggle. Plus the earlier-known: synthetic `.click()` has no user activation — audio paths need real input (`mouse move/down/up`).

## The signal

These are **universal mechanics of the browser-verify capability**, not TrackMate quirks — any project with parallel sessions, audio, always-mounted DOM, or toggles will hit them. They currently live only in TrackMate's CLAUDE.md; the shared **browser-verify slot** (defined once in `plugins/shape/CLAUDE.md`, consumed by mockup/align/build/dogfood + nav's refactor browser pass) is the right single owner — exactly the slot's purpose (name the capability once, don't re-learn it per project).

## Where it could land

`plugins/shape/CLAUDE.md` browser-verify slot definition, four bullets: session isolation · mute · state-not-text assertions · measure-before-toggle (+ real-input for user-activation paths). Per-project CLAUDE.md keeps only project-specifics (ports, dev.sh).

## Evidence

- TrackMate CLAUDE.md UI-smoke convention (updated 2026-06-11, commit `31ea10d`) carries all four with their war stories; the session-collision diagnosis and the parity drift are in the 2026-06-11 session transcript (audition verification saga, resolved with playing=true via isolated muted real-click).
