# atlas export — protocol (產物③ authoring law)

> Validated across four studies before landing. The **cross-artifact hard rules**
> (gate-before-write, two-pass only, numeric magnitudes, gate honesty, 常見誤解 provenance)
> live in [`compile-loop.md`](compile-loop.md) — they bind here and are deliberately NOT
> restated; this file owns only what is atlas-specific.

The export is a **compile**: study artifacts in, teaching fixture out. Re-runnable at any time;
each run is a full re-render of current understanding with stable identity. It is a
**re-creation** (教學是再創作), not a transcription — but every fact must survive verification
against the pinned source checkout.

## Inputs

| Kind | Where | Role |
|---|---|---|
| Seed | `studies/<name>/{_index.md,index.md}` mental-model section | what the study believes the system is |
| Seed | `studies/<name>/tour/`, `notes/`, `mockups/` | taught narratives, walked paths |
| Seed | `studies/<name>/understanding.md` **Corrected** table | becomes 「常見誤解」 annotations |
| Ground truth | `studies/<name>/source/` @ the pinned SHA | the ONLY citable authority |
| Mechanical | `scan-repo.mjs` output | magnitudes + import edges — never model-authored |
| Prior | existing `studies/<name>/atlas/fixture.json` (if any) | stable IDs + provenance carry-over |

## Birth gates (progressive fixture)

| Study level reached | Fixture may contain |
|---|---|
| Repository | `repo` scale only (tiers · modules · imports · magnitudes) |
| Runtime / System | + coarse behaviors (few steps, head-only narration) marked `"provisional": true` |
| Behavior | + full behaviors for the paths actually studied: routes, cargo edges, three-tier narration |
| Code | + `peek` refinement and 常見誤解 annotations at line precision |

Un-studied territory is omitted, never faked — the shell renders it as 「這條路 study 還沒鋪」.

## The two passes

**Pass 1 — creation (strong tier).** Reads seeds, defines module/tier structure, authors the
fixture per the rules below. May flag uncertainties inline as `"unverified": true` but must never
silently invent.

**Pass 2 — verification (cheap tier).** Re-opens the source for EVERY claim: line ranges bracket
the named symbol; `io` matches the real signature; edges correspond to real calls/returns/signals;
imports and magnitudes match `scan-repo.mjs` output. Produces a defect list; loop back to Pass 1
until zero defects. Verification has no taste opinions — fidelity only.

**Runner.** The interactive session orchestrates: dispatch Pass 1 → run
`validate-fixture.mjs` → dispatch Pass 2 → loop → final green. Standard inject↔check
bracket applies at each hand-off.

## Authoring rules (the spec, digested)

1. **Interface first.** Node `io` = what it takes → what it provides, from the real signature;
   `summary` = the service in one 繁中 sentence. Implementation belongs to the drawer, never
   the card.
2. **Cargo, not verbs.** Edge labels name what travels (`ModelResponse`, `agent, input`) —
   `kind`: `call` (parameters go down) · `return` (a value comes back) · `signal` (control, not
   data).
3. **Three narration tiers.** `head`: one sentence, bold conclusion. `body`: 2–4 sentences —
   what happens, why it matters, 該注意什麼 (include the one detail a reader would miss).
   Module `zh`: a role gloss with attitude (「引擎室 · 所有邊匯於此」), not a category label.
4. **Stable IDs.** lowerCamel of the symbol (`runSingleTurn` → keep the study's established id
   if a prior fixture exists). IDs never change across compiles.
5. **Provenance.** `meta.generatedBy` = `atlas-export vN @ <date>`, `meta.studyRef`, and per-
   behavior `"compiledAt"`, `"studyGate"` fields.
6. **Revision allowed.** A re-compile may rewrite earlier prose when deeper study corrected it;
   it may never drop a studied behavior without being told to.
7. **Language.** 繁體中文（台灣用語）for all learner-facing strings; identifiers, paths, code
   stay English; gloss non-common terms at first use.
8. **Budget sanity.** A behavior route is a curated walk (≈6–17 steps), not a call-graph dump;
   modules per repo poster ≈ 8–14 — beyond that, curate harder.

## Acceptance

- `assets/schema/atlas-fixture.schema.json` validates (structural half of
  `validate-fixture.mjs`).
- `validate-fixture.mjs` lays it out without overlap errors.
- Pass 2 defect list: empty.
- The shell renders it (the deployed shell at `<workspace>/atlas/index.html?fixture=…`) —
  browser pass by the runner.
