# Artifact activation

This is the editable owner of artifact activation (open or serve, then hand over a URL). The manifest builder bundles it into `shape-mockup` and `frame-tinker`; the text below is moved verbatim from mockup's protocol.

## Activate it — open + hand over a URL (don't just write the file)

A file written to disk is not yet a decidable artifact — the user has to *see* it. So after
writing, **activate it and surface a clickable URL in the chat**, the way a good scaffold does:

- **First check: local session or remote/headless one?** `open <file>` and a `file://` link only
  work when the agent shares a machine *with a display* with the human. On a remote server /
  cloud dev box / container (no local display — a `file://` path the user can't reach), don't
  hand a dead link: start a throwaway static server (`python3 -m http.server` in the artifact's
  dir) and hand over `http://localhost:<port>/<file>`. For a *series* of mockups in one session,
  start ONE server and reuse it. (The environment, not the artifact, is the usual trigger for
  needing a served URL.)
- **Local session** → **open it** with the platform opener (`open <file>` on macOS, `xdg-open`
  on Linux, `start` on Windows) and hand over a clickable `file://<absolute-path>` link.
- An artifact that needs an HTTP origin (fetches, modules, anything `file://` blocks — rare for a
  self-contained mockup) also forces the served-URL path, regardless of local-vs-remote.
- Prefer a real origin over a screenshot: the whole point is that the user can hover / click /
  flip the live thing. A screenshot is a transient supplement, never the hand-off.
