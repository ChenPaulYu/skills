---
name: mockup
description: "Build an interactive comparison when the user wants to see or try alternatives before choosing. Use for mockups and behavior comparisons; implementation and persistent records require their own scope."
---


# Mockup — make the choice tangible

Identify the decision and the interaction that exposes it. Ground the comparison in
the real app, states and supplied data. Read the user's UI preferences and project
design canon before choosing presentation. Label simulated effects; use actual data
for waveforms, metrics and claims.

Build the smallest interactive artifact that lets the user try the same case in each
alternative. Make the decision-critical success, failure and cancel behavior run.
Preserve state on rejected operations and avoid suggesting that a preview default
is the user's choice. Keep irrelevant controls and styling out of the comparison.

Serve a clickable URL and verify the rendered interaction, using faithful input at
the relevant viewport. Read `references/browser-check.md` when driving a browser.
A file or screenshot alone does not establish an operable comparison.

Keep temporary comparisons in session scratch. The selected behavior and reason
belong in the existing task or decision when the user asks to save or an authorized
handoff requires them. Use `references/saving.md`. Retain the artifact itself only
when the request or a concrete future comparison needs it.

Stop exploring after a choice. Return to an already-authorized implementation scope
when appropriate; a comparison-only request ends with the usable comparison.

## Browser verification

Use the project browser override and the browser-check procedure. Verification can run
inline or through the available browser-verifier executor. Report actual interaction
coverage and any unverified behavior.
