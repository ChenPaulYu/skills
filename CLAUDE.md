# CLAUDE.md — `skills` marketplace (repo root)

> Repo-wide rules for editing **this marketplace** — loaded for work anywhere in the repo, so a rule here is seen no matter which plugin you touch.
> Each `plugins/<name>/CLAUDE.md` holds only what is **specific to that plugin** (its identity, roster, the design patterns / framework it owns). Anything about *how to correctly write and maintain the repo's files* lives **here, once** — don't re-copy it into a plugin CLAUDE.md (that is the rule ① leakage this file exists to kill).

## Deep-module discipline applies to this repo's own files

The 8 deep-module rules nav audits for govern **these meta-files too** — the CLAUDE.md docs, the `scripts/`, the manifests, the site map — not just the product code the skills describe. Apply them as you edit here:

- **Rule ① — one owner, no leakage.** Every fact has a single owner; everything else is derived or points to it. A version lives in one manifest (gate #1); a repo-wide rule is stated **once** in this file, never re-copied per plugin. *This file is itself an instance* — it exists because the same authoring/maintenance rules kept getting copied into four plugin CLAUDE.md files (the leak), and into three manifest copies (the drift).
- **Rule ② — interface-first / progressive disclosure.** Every doc leads with its point and drills in only as needed (`head`-able); the validator + gates are the one door to "did I keep the repo consistent?".
- **Rule ④ — right grain.** A `SKILL.md` or CLAUDE.md past ~500 lines, or enumerating many distinct responsibilities, gets split — the same bar nav applies to product code.

## Concurrent editors — check before you write, not at push time

This repo has more than one active editor (the owner + agent sessions) pushing to `main`
directly — no PR review gate catches a stale base before it lands. **Before your first
edit in a session, not before your first push:**

```bash
git fetch origin && git log --oneline HEAD..origin/main
```

Non-empty output = `origin/main` moved since your local `main` — someone else has been
working. `git pull --rebase origin main` (or at least re-read the files you're about to
touch) **before** you start editing, so a concurrent change surfaces on a clean base
instead of as a merge conflict discovered only when `git push` is rejected. Checking late
still works (rebase, resolve, regenerate any derived file via its script, re-run the
validator, continue) — but it's reactive; checking first is free and avoids the conflict
outright when the edits don't actually overlap.

## Hard gates — run before every commit

Each gate guards a **single-owner / generated-artifact** fact: exactly one file is the editable owner, the rest is **derived**. Hand-editing a derived copy = silent drift (rule ① information leakage). The validator turns drift into a failed build — so enforcement is mechanical, not memory.

**One commit, one green validator.** Before committing any change under `plugins/`, `.claude-plugin/`, or `docs/`:

```bash
node scripts/validate-codex-skills.mjs   # the single enforcement point for gates 1-2 below
```

It must print `... ok`. It re-derives every generated artifact in a temp copy and compares — so it catches a missed regen **even when you edited a different plugin**.

**Automate it — enable the pre-commit hook once per clone:**

```bash
git config core.hooksPath scripts/hooks   # one-time; runs the validator before every commit
```

The hook (`scripts/hooks/pre-commit`) blocks a commit whose generated artifacts are out of sync and tells you which generator to run. Bypass deliberately with `git commit --no-verify`. This is the backstop for the failure that motivated these gates — a commit once shipped a stale Codex mirror because the validator wasn't run.

### 1. Plugin version + manifests are single-owner

- **Owner**: `plugins/<name>/.claude-plugin/plugin.json` owns that plugin's `name` · `version` · `description` · `author`.
- **Derived — never hand-edit**:
  - `plugins/<name>/.cursor-plugin/plugin.json` — a projection of the owner.
  - the `version` field of each entry in `.claude-plugin/marketplace.json`. (The marketplace `description` there is a separate, hand-owned blurb — only `version` is derived.)
- **After any version / description / author change**, regenerate then validate:
  ```bash
  node scripts/build-manifests.mjs         # re-derive cursor projections + marketplace versions
  node scripts/validate-codex-skills.mjs   # fails the build on any manifest drift
  ```
- **Why this gate exists**: the version used to be hand-copied across three files, so a bump that missed one drifted silently — `nav` sat at a stale `0.4.0` and `shape` at `0.5.0` in `marketplace.json` while their real version had moved on. One owner + a gating validator kills that class of bug.

### 2. Codex / Cursor / opencode skill mirror is generated

- `.agents/skills/` + the repo-root `AGENTS.md` are generated from `plugins/` by `node scripts/build-codex.mjs`. Never hand-edit them — edit the plugin `SKILL.md` / `CLAUDE.md`, regenerate, then validate (same validator as above).

### 3. Human-facing surfaces are gating — site map AND README

There are **two** hand-maintained human-facing surfaces that drift if you forget them; a skill/roster change **requires the same commit** to update **both**:

1. [`docs/site/index.html`](docs/site/index.html) — the interactive map. Update the relevant data array (`DOMAINS`, `CB_NODES`/`NAV_NODES`/`NAV_EDGES`, `CONV`, sidebar links if anatomy structure changed), bump the audit-block date + revision, add a FIXED entry naming what changed.
2. [`README.md`](README.md) — the plugin table + the per-plugin skills list + the install commands. **A plugin or skill added / removed / renamed (or a plugin's one-line description materially changed) must be reflected here too.**

Before committing, **always** run:

```bash
git status docs/site/index.html README.md
```

If you changed the roster but either shows unmodified → **STOP**, you missed it. Skip only for a pure typo / internal refactor with zero surface impact. **A stale surface lies silently to every future reader** — and the two drift independently (a real incident: the `manage` plugin landed in the site map but the README still listed four plugins). That's why both are hard gates, not soft reminders.

#### Adding a skill: registration is gated — but the validator checks the *slug*, not the *prose*

`validate-codex-skills.mjs` **fails the build** if a skill's invocation token `/<plugin>:<skill>` is missing from `README.md` or `docs/site/index.html` (`validateRegistration`). So a *totally* unregistered skill can no longer commit green. This closes the gap that shipped `think:dialectic` half-registered — `SKILL.md` + mirror in `git`, but the plugin still read `v0.2.0` and no surface named it, green the whole way.

**What the gate cannot catch — still on you, in the same commit as the `SKILL.md`:**

- **Stale surface *content*.** The slug being present ≠ the description being *true*. `observe` stayed named in README while its text went stale after a behaviour change — the validator saw the slug and passed. *A stale surface is a lie* — the same law as "stale header = lie", and it applies to the **ADR** too (`ADR-047` once *claimed* surfaces it hadn't updated).
- **The surfaces the token-check doesn't reach:** the plugin `version` bump (gate #1) · the `plugins/<plugin>/CLAUDE.md` roster · the site map's node/blurb + **rev bump + ADR count** · the **ADR** itself. The validator guarantees a skill is *named*; only you guarantee it's named *correctly and everywhere*.

## Authoring conventions (every plugin, every skill)

- **Naming** — skills use **bare verbs** (`audit`, `mockup`, `dissect`); the `<plugin>:` namespace supplies the topic, so no `<plugin>-` prefix on the skill name. A family may diverge when its idiom demands it (e.g. `think` uses canonical lens names — `first-principles` — for discoverability); document the divergence in that plugin's CLAUDE.md.
- **Self-contained `SKILL.md`** — each skill restates its own through-line / rules / framework **verbatim**, so an agent triggered into it doesn't depend on any CLAUDE.md being loaded. Bulky reference docs go in the skill's `references/`, loaded on demand.
- **★ Stack-neutral, standalone-legible examples** — every example must be understandable from the skill *alone*; never leak an origin project's domain nouns (component names, filenames, app concepts). Use generic placeholders (`UserList`, `core/user`, `Editor.tsx`). A skill that only makes sense if you know Project X is a leaky skill.
- **★ Skills-root-relative paths** — all paths (doc links **and** example code) are written as if `skills/` (the repo root) is root. **No `./` or `../` prefixes.** Doc links: `docs/adr/008-inject-check-at-handoff.md`. Example imports: alias form (`@/core/user`) or bare module names.
- **Frontmatter `description`** — written **broad** (matches multiple trigger phrasings) but **honest** about scope; it determines triggering accuracy. No pushy cross-domain claims.
- **Read-only / write-gated by default** — a skill that writes files shows the content (or a diff) before committing and never writes without explicit user confirmation; destructive ops follow the skill's own safety rules.
- **Cross-references between skills** are spelled `/nav:audit`, `/shape:mockup` — the form the user actually types, not bare names.

## When editing — maintenance rules

- **Before adding or changing any skill**, check the ★ authoring principles above (the two most common leaks: an origin-project domain noun, and a `./`/`../` path).
- **New skill** — scaffold `plugins/<plugin>/skills/<name>/SKILL.md`, write the frontmatter description carefully, test that invocations cover the main trigger phrasings, then **write an ADR** in `docs/adr/` (marketplace-level) explaining why it exists, its overlap with siblings, and how its trigger avoids stealing their fire. **Then REGISTER it** in the **same commit** as the `SKILL.md` (gate #3) — the validator now fails the build on a missing `/<plugin>:<skill>` token, but it can't catch stale prose or the version / roster / site-map-blurb / ADR surfaces, so those are on you.
- **Renaming a skill** — bump `version` in `.claude-plugin/plugin.json` (gate #1), run `node scripts/build-manifests.mjs`, and document the rename in an ADR.
- **Changing a shared rule** that every skill restates (e.g. nav's 8 rules) — update every affected `SKILL.md` in the **same commit**, and write an ADR.
- **Stale `SKILL.md` is worse than a missing one** — same law as "stale header = lie." Fix it in the commit that made it stale.

## Where things live

```
.claude-plugin/marketplace.json   → registers every plugin (name · source · description · version)
plugins/<name>/.claude-plugin/    → per-plugin manifest (the version + metadata OWNER)
plugins/<name>/.cursor-plugin/    → generated projection (do not hand-edit)
plugins/<name>/CLAUDE.md          → plugin-specific identity + roster + design patterns
plugins/<name>/skills/<s>/SKILL.md → individual skills, each self-contained
scripts/build-manifests.mjs       → regenerates cursor projections + marketplace versions
scripts/build-codex.mjs           → regenerates .agents/skills/ + AGENTS.md
scripts/validate-codex-skills.mjs → gates ALL of the above (run before commit)
docs/adr/                         → ADRs (marketplace-level, shared across plugins)
docs/site/index.html             → the bilingual marketplace map (gating, see gate #3)
README.md                         → human-facing marketplace overview
```
