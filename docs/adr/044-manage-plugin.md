# ADR 044 — `manage` plugin: the meta-lane (reflect on your own working session)

**Status**: accepted
**Date**: 2026-06-15
**Builds on**: [ADR-005](005-marketplace-plus-plugin-restructure.md) (marketplace/plugin structure), [ADR-034](034-think-plugin.md) (the value-guardrail + seed-family pattern this follows), [ADR-018](018-promotion-gate-is-evidence-not-session-count.md) (evidence-gated promotion)
**Grounded in**: the capability-placement observation [`docs/observations/2026-06-15-capability-placement-object-guardrail-distribution.md`](docs/observations/2026-06-15-capability-placement-object-guardrail-distribution.md) — this ADR is that cascade's trip-wire firing (promote when the test is reused).

## Context

Several capabilities the user reaches for often — "where are we" (orient), "recap what this session did" (recap), "capture the durable learning" (distill) — had **no home**. The instinct was to widen an existing plugin (`think`?) to adopt them; that's the trap. Run through the placement cascade (object → value-guardrail → distribution):

- **Object** — these operate on **the working session / process itself** (the current session + its durable traces in git/files), not on any existing plugin's object: `nav` = existing code · `shape` = a product's decisions/forward-motion · `research` = external documents · `think` = your reasoning about a problem. None match. A capability *pulled toward multiple families at once* (it felt like it could be `shape` AND `research`) is the signature of a **cross-cutting concern** → it belongs to **none** of them; it's its own family.
- **Value-guardrail** ([ADR-034](034-think-plugin.md)) — each survivor must force a structure the default skips. `catchup`/`summarize` earn it via **grounding-from-durable-state + a fixed shape** (a default summary paraphrases chat and editorializes; these reconstruct from git and stay objective/complete). `observe` earns it via the **distill-to-one-durable-artifact** protocol. `easy-explain` ("say it simpler") **fails** — no forced structure (it's a style already mandated by the global CLAUDE.md), and its object is *communication to a reader*, not the work session. Excluded.

The pattern is **not new** — it's long-standing in the user's workflow, just never recorded (which is itself evidence the meta-lane was missing a toolset). So this clears the evidence gate ([ADR-018](018-promotion-gate-is-evidence-not-session-count.md)) by lived recurrence, not session count.

## Decision

Add a new plugin **`manage`** — the meta-lane — with **three seed skills**, a triad **orient → recap → distill**:

- **`catchup`** (orient) — where the work stands *now*, rebuilt from durable state (git/diff/plan, not chat memory), fixed shape (goal · done · now · open · next). Read-only.
- **`summarize`** (recap) — a *complete, objective* account of what the session *did*. Read-only; the raw input `observe` distills.
- **`observe`** (distill) — the one durable, reusable learning, **written** to a knowledge base (`docs/observations/`), feeding the repo-evolution loop. The only writer.

Pipeline: **`summarize` → `observe`** (complete objective recap → the one keeper); `catchup` is orthogonal (state-now, forward).

**Why a plugin, not global `~/.claude/commands/`.** These were first prototyped as personal global commands (zero-install, everywhere). Promoting to a marketplace plugin buys: lives in git / travels with fork, SKILL.md-shaped + self-contained, a namespaced family (`/manage:*`), and consistency with the rest of the marketplace. The **trade** — a plugin must be `/plugin install`-ed per project, vs a global command being everywhere automatically — is accepted: the user already installs sibling plugins in working projects, so it's one more one-time install. The prototype global commands are removed (migrated in) to avoid a second copy drifting.

**`observe` output for a distributable plugin.** Writes to `$SKILLS_REPO/docs/observations/` (a central knowledge base) when the env var is set, else the *current* project's `docs/observations/`. So it funnels to a central repo for its author and degrades to per-project for any other installer.

## Why not

- **Fold into `nav`/`shape`** — object mismatch (the whole point above); folding muddies their `description` → triggering degrades → grab-bag. Riding their distribution is a convenience that doesn't justify breaking the object boundary.
- **One fused "manage" skill** — `observe` (selective, writes) / `summarize` (complete, objective) / `catchup` (state, forward) are distinct verbs with distinct outputs; one door = grab-bag, violates one-verb-one-door (the rule that retired `doctor`).

## Consequences

- Marketplace: **4 → 5 plugins** (`nav` · `shape` · `research` · `think` · `manage`). `manage` v0.1.0, a seed family that grows by evidence ([ADR-018](018-promotion-gate-is-evidence-not-session-count.md)).
- The prototype global commands `~/.claude/commands/observe.md` + `catchup.md` are deleted — the plugin SKILL.md files are now the single source.
- Generated artifacts updated: `.cursor-plugin` projection + `marketplace.json` version (`build-manifests.mjs`), Codex mirror `.agents/skills/manage-*` + `AGENTS.md` (`build-codex.mjs`), validator green.
- Gating site map updated: 5th plugin (DOMAINS / plugin node / sidebar card / install commands), plugin count + Codex skill count, ADR count 43 → 44, rev bump + FIXED entry.
