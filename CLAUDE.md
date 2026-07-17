# CLAUDE.md — `skills` marketplace (repo root)

> Repo-wide rules for editing **this marketplace** — loaded for work anywhere in the repo, so a rule here is seen no matter which plugin you touch.
> Each `plugins/<name>/CLAUDE.md` holds only what is **specific to that plugin** (its identity, roster, the design patterns / framework it owns). Anything about *how to correctly write and maintain the repo's files* lives **here, once** — don't re-copy it into a plugin CLAUDE.md (that is the rule ① leakage this file exists to kill).

## Deep-module discipline applies to this repo's own files

The 8 deep-module rules nav audits for govern **these meta-files too** — the CLAUDE.md docs, the `scripts/`, the manifests, the site map — not just the product code the skills describe. Apply them as you edit here:

- **Rule ① — one owner, no leakage.** Every fact has a single owner; everything else is derived or points to it. A version lives in one manifest (gate #1); a repo-wide rule is stated **once** in this file, never re-copied per plugin. *This file is itself an instance* — it exists because the same authoring/maintenance rules kept getting copied into four plugin CLAUDE.md files (the leak), and into three manifest copies (the drift).
- **Rule ② — interface-first / progressive disclosure.** Every doc leads with its point and drills in only as needed (`head`-able); the validator + gates are the one door to "did I keep the repo consistent?".
- **Rule ④ — right grain.** A `SKILL.md` or CLAUDE.md past ~500 lines, or enumerating many distinct responsibilities, gets split — the same bar nav applies to product code.

## Anonymization — this repo is PUBLIC; write like it

Everything committed here (ADRs, observations, findings, plans, design docs, fixtures)
is world-readable. When writing evidence or narrative into any of them, **anonymize at
write time** — a later sweep is damage control, not a workflow (two were needed,
2026-07-17):

- **No real third-party names or handles.** Collaborators appear as roles: "the
  counterpart", "a team member". The repo owner naming *himself* is normal authorship
  and fine; naming anyone else is not — they didn't consent to appearing in a public
  tools repo. **Carve-out**: crediting the authors of *public* work (Ousterhout,
  `mattpocock/skills`, a published paper's ideas) is attribution, not a leak — the
  law protects non-consenting private collaborators, not public authorship.
- **No private repo names, org paths, or internal project details.** Use placeholders
  (`<relay-repo>`, "a private R&D project"). Unreleased-product feature/debt items are
  described by shape ("a timing-grounding item"), never by internal name.
  **Calibration (ruled 2026-07-17)**: the owner's own product *codenames* (Crate,
  TrackMate, Tactus, …) may appear as passing references — he uses them publicly.
  What must stay out is the sharp internals attached to them: dev ports, API
  endpoints, component/function/token names, internal roadmap or debt items, cost
  figures, private-repo paths and commit hashes. Name the product, describe the
  detail by shape.
- **No machine-specific paths.** `$HOME`, `<dev-root>`, `<session scratchpad>` — a
  literal `/home/<user>/...` leaks the account name and 404s for everyone else.
- **No confidential third-party material.** Papers under review, private conversations,
  anything received under an expectation of confidence — keep the transferable lesson,
  strip every identifying fingerprint.

The test: **the evidence must keep its lesson after anonymization.** If it can't — if
the doc is only meaningful with the real names and internals — it belongs in private
notes, not in this repo.

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

#### Adding a skill: registration is gated — but the validator checks the *slug*, not most of the *prose*

`validate-codex-skills.mjs` **fails the build** if a skill's invocation token `/<plugin>:<skill>` is missing from `README.md` or `docs/site/index.html` (`validateRegistration`). So a *totally* unregistered skill can no longer commit green. This closes the gap that shipped `think:dialectic` half-registered — `SKILL.md` + mirror in `git`, but the plugin still read `v0.2.0` and no surface named it, green the whole way.

A second check, `validateSiteMapVersions`, closes one narrow slice of the *content* gap: for every plugin, it confirms the site map's DOMAINS-card blurb and graph-node blurb (both English and Chinese independently — a one-language-only edit is a real failure mode, not a hypothetical) mention that plugin's current `vX.Y.Z` from `plugins/<plugin>/.claude-plugin/plugin.json`. It found and blocked exactly this drift on 2026-07-03 (site map rev 62) — three separate places in the file stating the same version, none the single owner, two of them silently rotting for several revisions.

**What the gate still cannot catch — still on you, in the same commit as the `SKILL.md`:**

- **Stale surface *content* beyond the version token.** The slug being present, or the version being correct, ≠ the description being *true*. `observe` stayed named in README while its text went stale after a behaviour change — the validator saw the slug and passed. Skill counts and verb lists in the site map are also unchecked — phrasing varies too much across plugins ("Four skills" vs "4 lenses" vs "7 skills, one verb each") to regex reliably. *A stale surface is a lie* — the same law as "stale header = lie", and it applies to the **ADR** too (`ADR-047` once *claimed* surfaces it hadn't updated).
- **The surfaces no check reaches at all:** the `plugins/<plugin>/CLAUDE.md` roster · the site map's **rev bump + ADR count** · the **ADR** itself. The validator guarantees a skill is *named* and its site-map version is *current*; only you guarantee everything else is named correctly and everywhere.

## Authoring conventions (every plugin, every skill)

- **★ Contracts vs conventions** — only three disk structures in this repo are true *contracts* (a reader breaks if they're missing/malformed, backed by a linter/gate): ① relay thought frontmatter (`/relay:format` lints it), ② the manifest + generated-artifact set (gates 1–2 above, `validate-codex-skills.mjs`), ③ the `docs/core/` freeze protocol (ADR-041, per-project). Everything else on disk — the `blueprints/` tree, `plan.md`, file-top headers, the codebase map, `HANDOFF.md`, and so on — is a **convention**: the verb that reads it scaffolds it, repairs it, and tolerates absence or a non-standard shape without breaking. Don't promote a convention to contract-strictness by treating its canonical shape as mandatory. Full rationale: [ADR-071](docs/adr/071-contracts-vs-conventions-tolerant-reader.md).
- **★ Tolerant reader — three states, self-reported** — every verb that reads a convention-owned structure (above) handles three states: **standard shape** → consume directly; **non-standard/ad-hoc shape** → tolerate, consume what's readable; **absent** → degrade gracefully and **self-report which tier it read from**, so the user can judge how much to trust the result. Canonical instance: `plugins/reflect/skills/catchup/SKILL.md`'s "Consumption priority" section. [ADR-071](docs/adr/071-contracts-vs-conventions-tolerant-reader.md).
- **★ Invocation category is visible, not just in frontmatter** — a skill's invocation axis (model-invoked by default, or summoned-only via `disable-model-invocation: true`) already has one owner, the frontmatter field; `README.md`'s Invocation section should additionally bucket entries by category (User-invoked / Model-invoked) so the fact is scannable by a human, not just greppable in frontmatter. Inventory + what's still an open question: [ADR-072](docs/adr/072-invocation-direction-law-inventory.md).
- **Naming** — skills use **bare verbs** (`audit`, `mockup`, `dissect`); the `<plugin>:` namespace supplies the topic, so no `<plugin>-` prefix on the skill name. A family may diverge when its idiom demands it (e.g. `frame`'s reasoning lenses use canonical names — `first-principles` — for discoverability, while its `analogize` member uses a bare verb); document the divergence in that plugin's CLAUDE.md.
- **Self-contained `SKILL.md`** — each skill restates its own through-line / rules / framework **verbatim**, so an agent triggered into it doesn't depend on any CLAUDE.md being loaded. Bulky reference docs go in the skill's `references/`, loaded on demand.
- **★ Stack-neutral, standalone-legible examples** — every example must be understandable from the skill *alone*; never leak an origin project's domain nouns (component names, filenames, app concepts). Use generic placeholders (`UserList`, `core/user`, `Editor.tsx`). A skill that only makes sense if you know Project X is a leaky skill.
- **★ Skills-root-relative paths** — all paths (doc links **and** example code) are written as if `skills/` (the repo root) is root. **No `./` or `../` prefixes.** Doc links: `docs/adr/008-inject-check-at-handoff.md`. Example imports: alias form (`@/core/user`) or bare module names.
- **Frontmatter `description`** — written **lean but honest**: a model-invoked skill's description pays a *context-load* cost (it sits in every turn whether or not the skill fires), so lead with the verb, one trigger sentence per branch, no synonym-stacking, keep NOT/vs boundary sentences (load-bearing, not padding); a user-invoked skill (`disable-model-invocation: true`) pays a *cognitive-load* cost instead (a human reads it to decide whether to invoke by name) and drops the trigger-phrase list entirely — the model never routes off it. Honest about scope either way; no pushy cross-domain claims. Rationale + pilot method: [ADR-065](docs/adr/065-description-lean-but-honest-pilot-frame.md); marketplace-wide rollout: [ADR-073](docs/adr/073-description-lean-rollout-marketplace-wide.md).
- **Read-only / write-gated by default** — a skill that writes files shows the content (or a diff) before committing and never writes without explicit user confirmation; destructive ops follow the skill's own safety rules.
- **Cost tier — mechanical verbs declare `model: sonnet`** ([ADR-058](docs/adr/058-shape-cost-tiers.md) · [ADR-059](docs/adr/059-cost-tier-marketplace-wide.md)) — a skill whose work is a mechanical sweep / format / scan / render-from-structured-source (rather than open-ended judgment) declares `model: sonnet` in its SKILL.md frontmatter: a **turn-level** override, the session model resumes on the user's next prompt, and every gate (diff, write-gate, confidence-gate) is unchanged. Judgment-heavy verbs stay on the session model. This bullet owns the *criterion*; **which of its verbs are tiered is listed in each plugin's CLAUDE.md** (the instance, one owner each).
- **★ Dispatch tiers** — a second dimension on top of the cost tier above: not a skill's own declared tier, but who gets dispatched to do a piece of work. The judgment seat (planning, review/check, unblocking a stuck call) stays on the strong reasoner; reconnaissance and disciplined execution go to the cheap hand — downgrading is safe exactly when a strong-seat checkpoint reviews the output downstream. A seat is named by **role**, never pinned to a tool or model name, so swapping either changes nothing but this line. Tier default: **judgment = the session model; reconnaissance/execution sub-agents default to `model: sonnet`** — change dispatch by editing this one line. Consultant-seat resolution order, when a judgment call is stuck below confidence ([ADR-087](docs/adr/087-consultant-seat-drops-advisor-rung.md) dropped the old host-`advisor`-tool first rung): ① a fresh strong-model sub-agent — dispatched as a neutral reviewer if there's no leaning yet, as a devil's-advocate if there already is one, and always injected with the durable artifact's **path** (plan file, diff, the actual files) rather than a paraphrase of it. The sub-agent sees only its brief — so the brief must carry the key evidence, the counter-hypothesis, and the dispatcher's own doubts, not just a task description. ② else fall back to asking the user (rule ⑦'s original door). Reconnaissance sub-agents report back grounded in fact (file:line / source URL) — facts, not impressions. Dispatch is made **visible**, not silent: before dispatching, propose the work list + target tier + what stays with the judgment seat as **one `AskUserQuestion`-style ask per batch** (ADR-040's pattern — never per-agent), offering a downgrade valve ("don't ask again for this line of work" → drops to self-report-only); any turn that dispatched carries a fixed return line, `⚙ 派工:執行=<tier> ×N|判斷+驗收=session model` (no dispatch = no line), and its commit message carries "Executed by a `<tier>` hand, judgment-seat reviewed (ADR-067)" — this line must live in the dispatcher's own **walked** reporting step, not a footer (a reference-doc mention doesn't fire — [`docs/observations/2026-07-14-knowledge-is-not-cue-walked-steps-fire.md`](docs/observations/2026-07-14-knowledge-is-not-cue-walked-steps-fire.md)). The user's own tier designation always beats this default, scoped to their wording (this task / this line / today); a **persistent** override is a written CLAUDE.md rule, never a remembered conversation fact. Full rationale: [ADR-067](docs/adr/067-dispatch-tiers-consultant-seat.md) · [ADR-081](docs/adr/081-dispatch-proposal-gate-and-self-report.md).
- **★ Prose failure vocabulary** — the named ways skill/doc prose reads but stops working (adopted from mattpocock/skills' `writing-great-skills`, [ADR-069](docs/adr/069-adopt-prose-failure-vocabulary-plus-the-tell-column.md)); rule ① keeps each term defined once, here — plugins reference it, never restate it:
  - **Premature Completion** — ending a step early because a later step already entered view.
  - **Negation** — a prohibition that makes the forbidden behavior easier to think about, not harder.
  - **No-Op** — an instruction that changes nothing relative to default behavior.
  - **Sediment** — stale lines kept out of reluctance to delete, not out of need.
  - **Sprawl** — length itself is the failure, even when every individual line is necessary.
  - **Leading Word** — a compact, already-understood term reused instead of re-describing the same idea in prose each time.
  - **Completion Criterion** — a precise, checkable "done" that Premature Completion can't slip past.

  Full definitions + this repo's instances + the tell + remedies: [`plugins/nav/skills/compose/references/authoring-failure-modes.md`](plugins/nav/skills/compose/references/authoring-failure-modes.md).
- **Cross-references between skills** are spelled `/nav:audit`, `/shape:mockup` — the form the user actually types, not bare names.

## When editing — maintenance rules

- **Before adding or changing any skill**, check the ★ authoring principles above (the two most common leaks: an origin-project domain noun, and a `./`/`../` path). Also check [`docs/out-of-scope/`](docs/out-of-scope/README.md) first — don't re-propose an already-rejected idea without engaging with why it was rejected.
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
