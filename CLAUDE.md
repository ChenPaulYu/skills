# CLAUDE.md — `skills` marketplace (repo root)

> Repo-wide rules for editing this marketplace, stated once. Each `plugins/<name>/CLAUDE.md`
> holds only that family's identity, roster and patterns; read it before editing that family.
> Reasons and rejected alternatives live in [`docs/adr/`](docs/adr/README.md).

## Core principles

1. **Three-layer law (ADR-002).** Each skill fact lives in the lowest layer that still fires it:
   `description` (every turn: when to summon + one NOT-boundary, ≤3 sentences) → `SKILL.md`
   body (on fire: stance and behavior-changing gates only) → `references/` (on demand:
   protocol detail, moved verbatim). Depth = behavior delta ÷ always-resident tokens;
   delete-test each paragraph and compress narration, never gates. A skill is
   self-contained in its directory and depends on no CLAUDE.md.
2. **One owner per fact.** Every fact has one owner; everything else is derived or points to
   it. Generated files are never hand-edited (see Gates).
3. **Skills read standalone.** Stack-neutral examples with generic placeholders, no origin
   project's nouns. Paths are repo-root-relative with no `./` or `../`. Skills are bare verbs
   under the `<plugin>:` namespace; cross-references use the typed form (`/nav:audit`).
4. **Honor authorized scope (ADR-006).** Analysis is read-only. Carry out authorized changes;
   ask only for a consequential unresolved choice, new authority, material cost, or external
   or destructive effects. Publishing and speaking for the user always need explicit consent.
5. **Dispatch tiers (ADR-007).** Planning, judgment, review and acceptance stay with the
   session model; bounded execution defaults to `model: sonnet`, and mechanical skills declare
   it in frontmatter. Workers return evidence, not verdicts. Stuck judgment goes to the user.
   Report `⚙ 派工:執行=<tier> ×N|判斷+驗收=session model`.
6. **Conventions are read tolerantly (ADR-019).** Only manifests and generated artifacts are
   contracts. A verb reading blueprints, boards, handoffs or headers handles standard,
   ad-hoc and absent shapes, and reports which it read.
7. **This repo is public.** Anonymize at write time: no third-party names (roles instead;
   crediting public work is fine), no private repo names or internals (the owner's product
   codenames may appear, their ports, endpoints, code names and roadmap may not), no machine
   paths, no confidential material. If evidence loses its lesson once anonymized, it belongs
   in private notes.

Prose that reads well but stops working has named failure modes; use them when reviewing
skills: [`authoring-failure-modes.md`](docs/authoring-failure-modes.md).

## Gates

- **Before your first edit:** `git fetch origin && git log --oneline HEAD..origin/main`.
  Several editors push directly; re-read and preserve upstream work before editing.
- **Any plugin content change:** bump `plugins/<name>/.claude-plugin/plugin.json`
  (native caches pin by version), then run in order:
  ```bash
  node scripts/build-manifests.mjs   # manifests, shared references, README/site catalog
  node scripts/build-codex.mjs       # .agents/skills/ + AGENTS.md
  node scripts/build-cursor.mjs      # platforms/cursor/ + .cursor-plugin/
  node scripts/validate-codex-skills.mjs   # must print "... ok"
  ```
- **Never hand-edit generated files:** `.agents/`, `AGENTS.md`, `platforms/cursor/` (except
  `manifest.json`), `.cursor-plugin/`, marketplace `version` fields, and the marked catalog
  blocks in `README.md` and `docs/site/index.html`. `docs/catalog-copy.json` owns catalog prose
  only, never membership.
- **Hooks:** `git config core.hooksPath scripts/hooks` once per clone. Pre-commit validates the
  exact staged snapshot; post-commit/merge/rewrite run `scripts/sync-installed.sh` to refresh
  installed copies. Installation details: [`INSTALL.md`](INSTALL.md).

## Git

- **Commits:** `<type>(<scope>): <summary>` in English. Types: `feat`, `fix`, `refactor`,
  `docs`, `test`, `chore`, `revert`. A change to a `SKILL.md`, its references or a CLAUDE.md
  alters agent behavior, so it is `feat` or `fix`, never `docs`; `docs` is for README, ADRs,
  findings and the site. Scopes: `nav`, `shape`, `frame` (or `nav/do` for one skill),
  `scripts`, `adr`; omit the scope when a change spans areas. The body says why and how it was
  verified. Renaming or retiring a skill is breaking: `feat(nav)!:` plus `BREAKING CHANGE:`.
- **Branches:** fixes, docs and chores commit to `main`. Starting a new feature opens
  `feat/<topic>`; a trial that may be discarded opens `experiment/<topic>`. Merge as soon as
  acceptance passes, raise any branch unmerged after 7 days, and delete the branch and its
  worktree right after merging. Push a branch that outlives the session.

## Changing skills

- **Before adding or changing one,** check [`docs/out-of-scope/`](docs/out-of-scope/README.md)
  and the relevant topic ADR so a rejected idea is not re-proposed unexamined.
- **New skill or rename:** write the description carefully, test the main trigger phrasings,
  regenerate the catalog in the same commit, and explain in the commit message why it exists
  and how it avoids stealing siblings' triggers.
- **Shared rule change:** update every skill that restates it in the same commit.
- **Record-convention change:** when a change to `record-interface.md` or `workspace-records.md`
  leaves existing workspace records in an old shape, list them and ask the user whether to
  migrate them in the same round; teach the reader's `check` to report the old shape as
  `migrations`.
- **Stale is worse than missing:** fix a `SKILL.md` in the commit that made it stale.
- **ADRs (ADR-019):** write or update one only when alternatives were weighed and the rejected
  one is likely to be re-proposed. One topic per ADR, edited in place. Usage patterns go to the
  skill they correct, or to a workspace idea when the owner is unclear.
- **Retirement (ADR-009):** three months of zero fires in the monthly ledger
  (`node scripts/skill-usage.mjs --write`, read the last three `docs/usage/` snapshots) demotes
  a model-invoked skill to summon-only; deletion also needs the three-causes check. Watch list:
  `frame:analogize`, `frame:draw`.

## Where things live

```
plugins/<name>/.claude-plugin/plugin.json → plugin version + metadata (owner)
plugins/<name>/CLAUDE.md                  → family guide
plugins/<name>/skills/<s>/                → self-contained skills
scripts/                                  → builders, validator, hooks, sync-installed.sh
docs/adr/                                 → topic ADRs (reasons, rejected alternatives)
docs/findings/ · docs/out-of-scope/       → build-side mechanisms · rejected proposals
docs/usage/                               → monthly skill-usage ledger
README.md · docs/site/index.html          → human-facing overview and map
```
