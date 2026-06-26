---
date: 2026-06-26
status: raw
---

# shape:mockup's "activate + hand over a URL" should detect a REMOTE/headless session and default to a served http://localhost URL — `open` + file:// silently assumes a local display

> Source: 2026-06-26, rendering brand-identity mockups via /shape:mockup; the runner was on a remote server, so `open <file>` / a `file://` link was useless — the user had to interrupt with "我在遠端 server，請直接給我 url".

## What prompted it

The "Activate it — open + hand over a URL" step defaults to the platform opener (`open` on macOS) plus a `file://<abs-path>` link, and only mentions starting a static server "if the artifact needs an HTTP origin (fetches, modules — rare for a self-contained mockup)". But on this session the trigger for needing a served URL was **not** the artifact — it was a self-contained HTML — it was that **the runner had no local display** (remote server). `open` does nothing useful there, and `file://` points at a path the user can't reach. The user had to stop and ask for an http URL.

## The signal

**The "needs HTTP origin" condition the skill names is artifact-centric; the more common real trigger is environment-centric — the runner is remote/headless.** A `file://` hand-off only works when the agent and the human share a machine with a display. The skill's default silently bakes in that assumption.

The skill-feedback bind (S · P · D):
- **S** = `shape:mockup`
- **P** = the "Activate it — open + hand over a URL" hand-off step
- **D** = before defaulting to `open`+`file://`, detect a remote/headless session (no local display — e.g. SSH/`$SSH_TTY`, a known remote-dev container, or just ask once) and in that case default to **starting a throwaway static server and handing over `http://localhost:<port>/<file>`**. Add the corollary: for a *series* of mockups in one session, start ONE server and reuse it (this session served 3 mockups + an export preview off a single `python3 -m http.server`).

Why it matters: the whole point of the skill is that the user clicks the *live* thing. A dead `file://` link to a remote path defeats the skill's core ("a file written to disk is not yet a decidable artifact"). The remote case isn't exotic — agent-in-cloud / remote-dev is increasingly the default runner.

## Evidence so far

- **Only case (2026-06-26, lutherie identity mockups)**: agent handed a `file://`/`open` flow; user on a remote server interrupted to demand an http URL; switching to `python3 -m http.server` + a `localhost` URL fixed it, and the one server was reused across the whole mockup series.

(One case → stays `raw`. Promote if a second remote-runner mockup session repeats the file://-then-asked-for-url round-trip — that's the trip-wire to make "detect remote → serve a URL" the documented default in the Activate step.)

## Links

- Feeds `plugins/shape/skills/mockup/SKILL.md` → "Activate it — open + hand over a URL" + the shared browser-verify slot in `plugins/shape/CLAUDE.md`.
- Relates to the general "runner ≠ local-display" assumption that also touches `/run` and any open-in-browser hand-off; candidate for a shape-wide convention if it recurs outside mockup.
