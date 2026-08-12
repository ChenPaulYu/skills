# ADR-111 — Retire `nav:tour`; the `fathom` plugin succeeds it as the repository-study door

> 2026-08-12 · Status: accepted · nav 0.14.0 → 0.15.0 · fathom 0.1.0 (new plugin) ·
> marketplace stays at 29 skills (tour out, `fathom:repo` in)

## Context

`nav:tour` (ADR-082) landed 2026-07-14 as a conversational walkthrough ending in a mandatory
correction loop. ADR-109's retirement rhythm put it on the demotion watch-list (clock started
2026-08-12, checkpoint 2026-11). The owner's direct verdict ended the watch early: "超難用,直接
拿掉" — tour was never reached for, and when tried, didn't do the job.

The diagnosis came out of a separate line of work: the `etudes` learning-method lab, where two
repository studies (a Python agents SDK, then a second agent framework) converged a five-level
comprehension ladder — `Repository → Runtime → System → Behavior → Code` — with one
reconstruction-or-prediction gate per level, behavior inventories before code, level-matched
visual forms, and a marginal-return stop rule. Against that baseline, tour's flaw is legible:
**it delivers a model at a single altitude and then asks for corrections.** Its Mode 2 promises
"one idea per layer" but the layers have no coordinates — no defined questions, no gates, no
prescribed forms, no way to know where you are or when a level is passed. The correction loop was
sound; the missing asset was the ladder.

## Three-causes check (ADR-107)

- **Never-reachable?** No — it fired historically (routing probes 15/15 at landing).
- **Mis-triggered?** Partially — its object ("the current codebase", one you already maintain)
  has a near-zero trigger moment for a solo developer; the real recurring need is a repository
  you *don't* know, which tour's description explicitly excluded.
- **Genuinely unclaimed?** No — the need (guided repository comprehension) is real and now
  claimed by a design with evidence behind it.

Verdict: **mis-fit** — a real need served by the wrong design. Delete, with the successor named.

## Decision

1. **Delete `plugins/nav/skills/tour/`** (nav 0.14.0 → 0.15.0). History stays in git and in
   ADR-082/084/107/109's records; those ADRs are not rewritten.
2. **Add the `fathom` plugin** (0.1.0), one skill `repo` — `/fathom:repo`:
   - the five-level ladder with per-level gates (skippable, but skips leave a trace in the
     cursor);
   - upfront collapse rules so small repos don't get big-framework ceremony;
   - level-matched forms (Map / Path / Branch / Code Tour), terminal diagrams by default, HTML
     only when interaction changes visible state;
   - Code Guiding included but flagged unvalidated (no completed study has run it yet);
   - a **persistent study cursor** (`_index.md` + pinned clone) that resumes across sessions.
3. **Why a standalone plugin, not a nav verb**: the cursor. nav's family shape is single-shot
   actions on a codebase you maintain; a multi-session learning campaign that writes durable
   study state is a different species. Folding it into nav would either break nav's read-only
   norms or force the cursor out — and the cursor is the fix for the method's worst reuse pain
   (every session restarting the climb from level one).
4. **Tour's residual use case** — a quick shared-model check on your own codebase — is served by
   fathom's collapse rules: with a codebase map / headers / ADRs present, Repository and Runtime
   fast-pass and the session starts at the first level the learner can't already reconstruct.

## Division lines (so fathom doesn't steal siblings' fire)

- `/reflect:catchup` — where today's *work* stopped; fathom owns where *understanding* stopped.
- `/nav:sync` — durable navigability artifacts for a repo you maintain; fathom consumes the map
  as grounding, never writes it.
- `/shape:survey` (elicit's survey leg) — maps a *decision* space; fathom maps an existing
  *system*.

## Method-lab relationship

The method's evidence base (evaluation rubric, baseline/delayed-recall probes, case iterations,
graduation thresholds) stays in the external `etudes` workspace — the skill executes the
converged rhythm and carries none of the lab's instruments. Method changes flow one way:
evidence in the lab first, then a fathom version bump. The skill's closing friction note is the
return channel. Known debt at 0.1.0: the Code level is unvalidated, delayed recall untested, and
both supporting studies are agent-domain repositories — a materially different third study
decides whether fathom graduates past 0.x.

## Consequences

- nav is six skills; its CLAUDE.md roster, plugin.json, README rows, site map (DOMAINS card,
  NAV_NODES/EDGES, anatomy lede), and the Codex sidecar all updated in this commit.
- `fathom` registers in marketplace.json, README (table + invocation + install), the site map
  (new DOMAINS card + CB_NODES node), and `platforms/codex/descriptions.json` (`fathom-repo`).
- INSTALL.md's plugin lists were stale (still naming retired `research`/`think`) and are
  refreshed to the current six as part of this registration sweep.
- ADR-109's watch-list note in the root CLAUDE.md updated: `tour` left the list by owner verdict,
  not the clock.
