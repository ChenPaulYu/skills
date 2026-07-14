# ADR 078 — Merge `relay:register` into `relay:launch` as a branch (retire `register` as a standalone skill)

**Status**: accepted
**Date**: 2026-07-14
**Source**: structure-theatre consolidation discussion, ratified by Paul 2026-07-14 (option A of two, option B priced out — see Decision).
**Precedent cited**: [ADR-021](021-retire-nav-doctor.md) (`nav:doctor` retirement — the razor for when a wrapper is ceremony, not convenience).

## Context

`relay` split its seven verbs into two layers: structure (`launch`, `register`) and content (`report`, `review`, `digest`, `settle`, `format`). `launch` scaffolds a project's workspace; `register` enrolls a person into the global roster and assigns a per-project role. Both are, at the mechanical level, **the same operation**: open a small YAML file (`relay.yml` or `project.yml`), add or edit an entry, show the diff, gate, commit. Neither carries any judgment work comparable to `report`/`review`/`settle` (which write or distill *meaning*) — they are structural bookkeeping.

At the scale relay is actually tuned for — 1-2 people, progress-centric, no multi-party consensus protocol (relay's own `CLAUDE.md`, "Two-repo split" + "The three axes") — `register` fires **rarely**: once per person, and most relay repos never grow past the 1-2 people `launch` already seeds (the running user, then maybe one counterpart). `launch` itself already contains a first-run bootstrap of `relay.yml` (Step 1: "If absent, this is first-run... create a minimal `relay.yml` registering them") — so `launch` was already half-doing `register`'s job for the *first* person; only the *second-and-later* person needed a separate door.

This is the same diagnosis nav:doctor's retirement (ADR-021) named for an orchestrator with too little to orchestrate, applied one layer down: not an orchestrator here, but **two near-identical structural verbs each below the bar for a standalone door**, at this project's stated scale.

### Two ways to fix it, and why not the cheaper-looking one

Two options were on the table:

- **Option A (this ADR): merge `register` into `launch` as an explicit second branch.** `launch` keeps its "create a project" identity and gains "add a person / assign a role" as a sibling branch, sharing Step 1 (locate/bootstrap the repo).
- **Option B: demote both to a documented protocol in `plugins/relay/CLAUDE.md`**, with no dedicated skill door at all — an agent reads the roster/role shape from `CLAUDE.md` and free-hands the YAML edit when the moment calls for it.

Option B looks cheaper on the page (delete two `SKILL.md` files, add a paragraph) but its **true cost** is higher than the merge: relay's format contract already treats `relay.yml` / `project.yml` shapes as machine-checkable structure (see `plugins/relay/CLAUDE.md` → "Format contract"), and `relay:format`'s lint (`format/scripts/lint.mjs`) is the marketplace's concrete instance of one of only three real *contracts* in this repo (ADR-071's contracts-vs-conventions law: relay frontmatter, the manifest/generated-artifact set, `docs/core/` freeze). Demoting `launch`'s and `register`'s writes to unstructured CLAUDE.md protocol, with no skill-level gate walking the exact fields (`git` resolver vs `github` display, handle-freeze, role list-awareness), means either (a) the format-linter would need extending to catch drift in *how* the roster/role edit is made, not just its resulting shape, or (b) the protocol knowledge sits in prose a fresh agent reads but isn't forced to re-consult at the moment of writing — exactly the **knowledge≠cue** failure this repo documented **four separate times on 2026-07-14** (`docs/findings/2026-07-14-elicit-ecosystem-probes.md`; cited again in ADR-076 for elicit's gatekeeper, ADR-077 for frame's plain-landing, and the underlying pattern recurring across both). A described diagnosis in a reference section does not fire reliably; a walked step inside an actually-invoked skill does. Option B's real price is therefore either a linter-extension project or a silently-degrading protocol — both larger than the merge. Priced out.

### Why not "keep both, do nothing"

Applying ADR-021's own razor: `register`'s unique residue, after `launch` already half-absorbs the first-person case, is thin — one YAML write to `relay.yml`, one YAML write to `project.yml`, both diff-gated the same way `launch`'s scaffold already is. A wrapper (or in this case, a sibling skill) around a two-step operation that doesn't earn independent existence is ceremony, the same verdict ADR-021 reached for `nav:doctor` orchestrating just `audit → sync`. Keeping `register` standalone means maintaining a second frontmatter description, a second registration footprint across README/site-map/descriptions.json, and a second trigger surface competing with `launch`'s — for a verb whose real content (identity fields, the two-layer YAML shapes, the discipline table) fits cleanly as one more branch inside the door people already reach for when relay's structure needs changing.

## Decision

**Merge `relay:register` into `relay:launch` as an explicit second branch. Retire `register` as a standalone skill.** relay goes from seven verbs to **six**: `launch` · `report` · `review` · `digest` · `settle` · `format`.

- `launch`'s frontmatter description now leads with both branches: create a project, or add a person / assign a role — one trigger sentence each, in the same length band as before.
- `launch`'s Process section splits after the shared Step 1 (locate/bootstrap the repo) into **Branch A — Create a project** (formerly `launch`'s Steps 2-4) and **Branch B — Add a person or role** (formerly `register`'s Steps 1-3, renumbered B2-B4 since Step 1 is now shared). `register`'s load-bearing content — the two-layer distinction (identity global / role per-project), the exact `relay.yml` / `project.yml` shapes, the handle-freeze rule, the "registering is shared metadata not a permission grant" discipline, and its anti-pattern rows — carries over verbatim into Branch B.
- `register`'s companion-skill cross-references (`launch` ↔ `register`) collapse: `launch` no longer points to a separate door for people, because it now *is* that door.
- No skill anywhere else in the marketplace called `register` directly (skills never call each other, ADR-007/015), so no other `SKILL.md` needed a cross-reference update beyond the one `launch` line that used to say "to add people use `/relay:register`."

### What register's users do now

The same request — "register a person in relay," "onboard X," "add X to the roster" — now routes to `/relay:launch`, which recognizes it as Branch B from the trigger phrasing in its own description and walks the same identity-then-role steps `register` used to.

### Invocation category unchanged

Neither `launch` nor `register` carried `disable-model-invocation` — both were model-invoked (README's relay list has no *User-invoked* sub-bucket; every relay verb fires on phrasing). The merged `launch` stays model-invoked; no README bucket move needed beyond removing `register`'s line.

## Why merge rather than demote (recap) or keep (recap)

- **Not option B (demote to protocol)**: the real cost is a format-linter extension or a knowledge≠cue regression — both documented as this repo's most expensive failure mode on the very day of this decision, four times over. A protocol note nobody is forced to re-read at the moment of writing the YAML is the same failure elicit's stall-tells and frame's plain-landing step were both built to *stop* doing.
- **Not "keep both"**: applying ADR-021's razor, `register`'s residue below `launch`'s existing first-run bootstrap is too thin to earn a second maintained frontmatter, a second registration footprint, and a second trigger surface — ceremony, not convenience.
- **Merge**: preserves the load-bearing protocol content (nothing about *how* to write `relay.yml`/`project.yml` is lost or weakened — it is restated verbatim as Branch B) while collapsing the redundant door, keeping the gate (diff shown, gated commit) exactly as strict as before.

## Consequences

- `plugins/relay/skills/launch/SKILL.md`: absorbs `register`'s Steps 1-3 as Branch B (renumbered B2-B4); frontmatter description rewritten to name both branches; companion-skills list drops the `register` cross-reference, gains `/relay:review` (what a newly-added person does next).
- `plugins/relay/skills/register/`: **deleted** (`git rm -r`).
- `plugins/relay/.claude-plugin/plugin.json`: version `0.7.0` → `0.8.0` (skill-roster change — a merge, not a pure patch); description's verb list updated from seven to six, `launch`'s clause now names both branches, `register`'s clause removed.
- `README.md`: `/relay:register` line removed from the relay skills list; `/relay:launch`'s line updated to name both branches; the relay plugin-table row's "`launch`/`register` set up the project + people" clause updated to name one verb doing both jobs.
- `docs/site/index.html`: relay's CONV entries drop the `/relay:register` row, `/relay:launch`'s row extended to cover both branches; relay's skill count in the VERIFIED block, the DOMAINS card blurb, and the graph-node blurb all move from "7 skills" / `v0.7.0` to "6 skills" / `v0.8.0` (both languages); the Codex-mirror flat-skill count and any other explicit marketplace-wide skill-count (37 → 36) updated; rev 72 → 73, dated 2026-07-14, new CHANGED entry naming this merge, prior rev-72 CHANGED entry relabeled FIXED per the file's own convention; ADR count 77 → 78.
- `platforms/codex/descriptions.json`: `relay-register` entry removed; `relay-launch`'s entry rewritten to cover both branches, staying ≤ 240 chars and under the 7000-char total budget.
- `plugins/relay/CLAUDE.md`: roster table drops the `register` row, `launch`'s row notes it now also enrolls people + assigns roles, one line pointing at this ADR for why.
- `.agents/skills/relay-register/` and its `AGENTS.md` entry: removed by regenerating via `scripts/build-codex.mjs` (never hand-edited); `relay-launch`'s mirror regenerates from the merged `SKILL.md`.
- **Future re-split condition** (not a promise, a named trigger): if relay's usage grows past its stated 1-2-person, progress-centric tuning into many-person governance — multiple concurrent roles, a real onboarding cadence, or role-assignment workflows independent of project creation — role assignment may re-earn a standalone door at that point. Nothing here forecloses that; it just says the fork isn't warranted at today's observed scale.
