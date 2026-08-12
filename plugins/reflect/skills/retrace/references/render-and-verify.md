# retrace — outline content, render spec, browser-verify, report

> Moved verbatim from the pre-ADR-109 SKILL.md body. The SKILL.md Stance carries the operative
> gates (the outline correction gate; dated, browser-verified, bounded artifact); this is the
> elaborated content spec for the outline, the render's required information architecture, the
> interaction and visual rules, the verify checklist, and the closing report shape, loaded on
> demand.

## Step 3 — Put the causal outline in front of the user

Before writing HTML, present a compact outline in the user's language. Lead with the current conclusion, then include:

1. **Scope + evidence basis** — arc, date/SHA, evidence tier, important gaps.
2. **Stages** — each stage's prior state → pressure → evidence → decision → status.
3. **Bridge after every stage** — one sentence beginning from what remained unresolved and ending at why the next stage became necessary.
4. **Witness plan** — the concrete example/media/interaction that will make each abstract stage inspectable.
5. **Current boundary** — what is true now, what is proven, and what remains unresolved without deciding the roadmap.

Ask the user to correct stage boundaries, intent, missing decisions, and bridges. **Stop here until they accept or correct the outline.** If the same outline was already explicitly accepted earlier in the live context, reuse that acceptance and proceed; do not make the user approve twice.

On correction, update the outline first. User testimony may promote an Inferred historical reason to Recorded; label it as a user statement rather than pretending it came from git.

## Step 4 — Render the corrected retrace

### Choose the output home

Use the location the user names. Otherwise:

1. reuse an established project artifact/fileserver convention when one is evident;
2. else write `docs/retraces/<YYYY-MM-DD>-<topic>/index.html`;
3. keep local media beside it and link with relative paths.

Create a **dated snapshot**, not a silently maintained second source of truth. Put a head-readable HTML comment at the top with: what the retrace covers, current status, generation date/SHA, evidence basis, and whether a later artifact supersedes it.

### Required information architecture

Render one standalone interactive HTML page, plus local media files only when needed:

1. **Current-position lead** — where the arc ended and the shortest plain-language explanation of why.
2. **Stage navigator** — scan the whole path without reading every detail.
3. **Causal stages** — the six fields, provenance, status, and source links.
4. **Visible bridges** — each stage ends with the pressure that opens the next; no unexplained jump.
5. **Concrete witnesses** — embedded beside the claim they support, not collected in an evidence appendix the reader must cross-reference.
6. **Current boundary** — proven / implemented-but-unverified / decided-but-unbuilt / unresolved, kept separate.
7. **Evidence ledger** — sources, gaps, generation date, and SHA.

### Interaction follows the claim

Use interaction only when it transfers understanding:

- before/after toggle for a changed data shape;
- insert/edit/reset control for an identity or mutation claim;
- placement/voice/state switch for alternative resolutions;
- clickable matrix or chart for measured comparisons;
- audio/video controls for perceptual evidence;
- expandable technical layer when plain language should lead.

Decorative animation, fake controls, and charts that merely repeat prose do not count. Keep every interaction deterministic and make its state visible.

### Visual and language rules

- Match the project's established artifact palette, typography, spacing, and theme behavior when available; otherwise use a quiet neutral system.
- Write the human-facing artifact in the user's requested or conversational language; preserve identifiers, commands, and source text in their real form.
- Lead with plain language and place technical detail behind progressive disclosure.
- Use responsive layout, keyboard-operable controls, visible focus, sufficient contrast, and reduced-motion support.
- Keep the page self-contained: inline CSS/JS, no external runtime or CDN dependency. Local media may remain separate.

## Step 5 — Browser-verify and activate

An HTML file on disk is not a delivered retrace. Verify it in a real browser before handoff:

1. load with zero console errors;
2. exercise every decision-critical control and confirm visible state changes;
3. check desktop and narrow/mobile layouts;
4. confirm source links and local media resolve;
5. confirm audio/video metadata and playback controls load when present;
6. verify plain/technical or language/theme controls when included;
7. scan every stage-to-stage bridge for an unexplained jump.

Then hand over a reachable URL:

- local shared-display session → open the artifact and provide the local path/URL;
- remote/headless session → use an existing project fileserver/artifact convention when configured, otherwise start one reusable static server and provide its HTTP URL.

Do not claim media verification from a `200` response alone when the browser failed to decode it.

## Step 6 — Report the boundary, then stop

Return:

- the live artifact URL;
- the arc and evidence tier it covers;
- the date/SHA freshness stamp;
- any Inferred/Unknown bridges the user should treat cautiously;
- verification performed.

Do not convert unresolved items into a roadmap, edit product decisions, or start implementation. If the user wants to choose next, that is `shape-align` or `shape-elicit` depending on whether the decision is already made.
