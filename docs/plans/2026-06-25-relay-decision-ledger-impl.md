# ADR-054 — relay decision-ledger: implementation plan

> Generated: 2026-06-25 · Spec source: [docs/adr/054-relay-decision-ledger.md](docs/adr/054-relay-decision-ledger.md) · Stage 1: fresh (this session)

## Context

ADR-054 (accepted, design) reshapes how relay stores decisions. Today (post-ADR-053) `settle` **rewrites** the per-project `index.md` (`## Where things stand` + `## Decisions (pinned)`) and moves settled thoughts to `archive/`. The decisions — relay's highest-value output — live as bullets in a disposable, regenerated projection, which can silently drop a prior decision on rewrite. ADR-054 fixes this by splitting four roles, each with one owner:

- **`thoughts/`** — disposable drafts; **hard-deleted** once settled (git is the deep archive; no `archive/`).
- **`decisions/log.md`** — append-only History; each entry a **self-contained distilled ruling** (+ one-line why + provenance), readable without the deleted thought.
- **`decisions/active.md`** — the current in-force decisions, by reference into `log.md`; regenerable.
- **progress / "where things stand"** — `digest` computes it live; no stored file. `index.md` dissolves.

The contract is owned by [`plugins/relay/CLAUDE.md`](plugins/relay/CLAUDE.md) (Format contract + Resolution & decisions); `settle`/`digest`/`launch` restate the slices they touch, so per the plugin's own rule the owner **and** every restating SKILL.md change in the **same commit** (stale restatement = a lie). Intent in one sentence: **make decisions a durable append-only ledger written once by `settle`, not pins in a regenerated snapshot.**

## Resolved questions

| Question | Answer |
|---|---|
| Q1 — does `digest` grow a holistic "where things stand" view? | **甲** — no; `digest` keeps its per-person view (waiting-for-me / waiting-on-others / Recent). No new progress section. |
| Q2 — when do decisions enter the ledger? | **甲** — at `settle` time (single writer = conflict-free). `review` stays simple; the agreed thought lives in `thoughts/` until `settle` pins it. |
| Q3 — is the live `accord` data migration in scope? | **乙** — yes; migrate `accord` in the same work, as the first run of the new `settle`. |
| (from ADR draft) thought prune | **hard-delete**, git-only, no `archive/`. |
| (from ADR draft) ledger filename | **`decisions/log.md`** + **`decisions/active.md`**. |
| (from ADR draft) where a tooling decision is recorded | skills-repo ADR + optional content-repo FYI pointer. |

No open questions remain.

## Approach

Edited in this order; **landed as one commit** in the skills repo (the contract + every restating SKILL.md together), then a **separate** `accord` data commit (Phase 6).

**Phase 0 — Contract (the owner) — `plugins/relay/CLAUDE.md`.**
Replace the `index.md` format block with `decisions/log.md` + `decisions/active.md` blocks. Rewrite the "Decisions are pinned" bullet (pinned into `log.md`, appended not rewritten). Update the "Shared-mutable files (`index.md`) touched only by `settle`" line → `active.md` is the settle-regenerated projection; `log.md` is append-only. Apply the event-sourcing revision: *the immutable log is git history + `decisions/log.md`; `thoughts/` is disposable; `active.md` is the projection* (supersedes the line committed in `8ee287e`). Drop `archive/` from the model.

**Phase 1 — `settle` (the engine) — `skills/settle/SKILL.md`.**
Rewrite Step 2–3: distil each thought that got an agreeing review into a **self-contained ruling**, **append** it to `decisions/log.md` (never rewrite); **regenerate** `decisions/active.md` (in-force only, by reference, superseded ones dropped from active but kept in log); **hard-delete** settled thoughts (no `archive/` move). Add the supersession mechanic (new entry marks `supersedes <id>`; `active.md` re-points). Remove the `## Where things stand` output (now `digest`) and all `index.md` / `archive/` references. Update Discipline + anti-patterns (e.g. "rewrite `log.md`" becomes an anti-pattern; "append-only" the rule).

**Phase 2 — `digest` (progress home) — `skills/digest/SKILL.md`.**
Q1=甲, so no new holistic section. Only fix the `index.md` coupling: the Scope line ("a settled snapshot may exist in `index.md`") → point at `decisions/active.md` + `log.md`; confirm digest still computes its per-person view from `thoughts/` (unchanged).

**Phase 3 — `launch` (scaffold) — `skills/launch/SKILL.md`.**
Step 3 scaffolds `thoughts/` + `core/` + `decisions/{log.md, active.md}` (seeded with headers); **drop `archive/` and `index.md`**. Fix the stale `reply` on line 8 → `review`. Update the `description` (drops `archive/` · `index.md`, adds `decisions/`).

**Phase 4 — Version + mirrors + manifests.**
Bump `0.2.1 → 0.3.0` in `plugins/relay/.claude-plugin/plugin.json` **and** `.cursor-plugin/plugin.json`; update both `description`s (settle no longer "snapshot + pinned" → "append-only decision ledger + prune"). Run `node scripts/build-manifests.mjs` + `node scripts/build-codex.mjs`; `node scripts/validate-codex-skills.mjs` green.

**Phase 5 — ADR-054 status — `docs/adr/054-relay-decision-ledger.md`.**
Flip the "Pending → Implementation" note to done; keep Status accepted.

**Phase 6 — `accord` data migration (separate commit, the content repo).**
Run the new `settle` on `projects/music-agent-os/`: distil the already-agreed threads (the arch-bridge agreement, the naming-alignment review) into the first `decisions/log.md` entries; regenerate `active.md`; **delete** `index.md`, the legacy empty `decisions/` scaffold, and `archive/`; hard-delete settled thoughts; keep `core/` + `project.yml` + still-open thoughts. Gate the diff, commit + push (greented's dashboard pulls it).

## Critical files

| File | Why it matters | Phase |
|---|---|---|
| `plugins/relay/CLAUDE.md` | The contract owner — file shapes + decision semantics; everything else restates it | 0 |
| `plugins/relay/skills/settle/SKILL.md` | The engine — biggest behavior change (append-ledger + hard-delete) | 1 |
| `plugins/relay/skills/digest/SKILL.md` | Drop `index.md` coupling; owns progress (per-person) | 2 |
| `plugins/relay/skills/launch/SKILL.md` | Scaffold shape; stray `reply` fix | 3 |
| `plugins/relay/.claude-plugin/plugin.json` · `.cursor-plugin/plugin.json` | Version + description (two mirrors) | 4 |
| `docs/adr/054-relay-decision-ledger.md` | Mark implemented | 5 |
| `rytho-ai/accord/projects/music-agent-os/**` | Live data migration to the new shape | 6 |

## Single-source-of-truth owners

| Decision (changes as a unit) | Owner |
|---|---|
| relay file-format shapes (`thoughts/`, `decisions/log.md`, `decisions/active.md`) | `plugins/relay/CLAUDE.md` → Format contract — settle/digest/launch **restate, same commit** |
| decision lifecycle semantics (agree → settle appends → supersede → active) | `plugins/relay/CLAUDE.md` → Resolution & decisions |

No new code-level owner is introduced (relay bundles no scripts for this; ADR-051). The discipline here is *doc* single-sourcing: change a shape in CLAUDE.md → update every restating SKILL.md in the same commit.

## Verification

1. **Phase 0** → read CLAUDE.md end-to-end: the format contract describes `log.md` + `active.md`, no `index.md` block, no `archive/` in the model.
2. **Phase 1** → `grep -rn 'index.md\|archive/' plugins/relay/skills/settle` returns nothing unintended; settle's steps describe append + regenerate + hard-delete + supersede.
3. **Phase 3** → described scaffold lists `decisions/{log,active}.md`, not `archive/`/`index.md`; `grep -n 'reply' plugins/relay/skills/launch/SKILL.md` is clean.
4. **Phase 4** → `grep '"version"' plugins/relay/*/plugin.json` shows `0.3.0` in both; `node scripts/validate-codex-skills.mjs` exits green.
5. **Cross-cutting** → `grep -rn 'index.md\|archive/\|reply' plugins/relay` → every remaining hit is intentional (zero stray `reply`; no `index.md`/`archive/` except in ADR history prose).
6. **End-to-end (Phase 6)** → in `accord`, the new `settle` produces a readable `decisions/log.md` (the arch-bridge + naming decisions as self-contained entries) + `active.md`; `index.md`/`archive/`/legacy `decisions/` are gone; `git -C accord status` clean after commit; the FYI/decision files render in plain markdown (greented's dashboard can read them).

## Out of scope (deferred)

- **Multi-party consensus** — still out (ADR-053 §Out of scope); this doesn't reintroduce an `@`-set gate.
- **`register` skill** — unaffected (it manages people, not project structure).
- **`core/` canon docs** — a separate concern (shape:position territory); untouched by the migration.
- **greented's dashboard implementation** — his side; we only guarantee the new files are plain-markdown readable. Whether his dashboard honors the ask-vs-FYI termination convention is a separate cross-agent check.
