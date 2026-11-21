<!-- GENERATED from plugins/seek/references/browser-check.md by scripts/build-manifests.mjs; do not hand-edit. -->

# Browser checks

Use the project's browser helper override or, absent one, agent-browser. Check availability
before driving and report an unavailable tool as unverified; never auto-install it.
Use a unique session and scratch data. Open, act, capture at relevant decision points,
compare actual state with the expectation, and close on every exit path. Start and stop
only your own server. Screenshots are evidence paths, not proof an operation succeeded.

An available browser-verifier executor can run a bounded pass with URL, actions, expected
state and evidence destinations. Missing executor support means run the same pass inline.
Keep interpretation and acceptance with the session model. The host generates its
browser runtime from Seek's agents/browser-verifier.md.
