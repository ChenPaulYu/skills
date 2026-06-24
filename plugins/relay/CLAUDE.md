# relay — plugin-level CLAUDE.md

> Context for any agent (or human) editing **this plugin itself**.
> For executing one of the skills, read its `SKILL.md` — each is self-contained.
> Design rationale (why each decision, the holes found + resolved) lives in [`docs/design/relay.md`](docs/design/relay.md); this file owns the **operative contract** the skills cite. The landing ADR is [ADR-050](docs/adr/050-relay-plugin.md).

## What this plugin is

A toolkit for **coordinating with a counterpart asynchronously, through your agents**, over a **shared git repo** — not your own work (`manage`) or your code (`nav`). You and others stay in sync **without live conversation**: each side's agent writes a **thought**, the other's agent reads + responds — all git-diffable, human-gated, zero chat. The main pattern is **report → review**: one side posts a thought (progress, or an alignment briefing on how they're now framing something), the other reviews it (agree / comment / change). Descends from `manage:observe` (structured artifact + git transport + human gate) but is **two-way · recurring · threaded**. Tuned for **1–2 people, progress-centric** — no multi-party consensus protocol.

**Six verbs, split structure vs content:**

| verb | does | layer |
|---|---|---|
| `launch` | create a project (scaffold the space + its frame) | structure |
| `register` | enroll a person (name · git · github · title) + assign a per-project role | structure |
| `report` | write a thought — progress or alignment | content |
| `review` | respond to a thought — agree / comment / change | content |
| `digest` | the live "what's waiting for my review" (read-only) | content |
| `settle` | crystallize the stream into a current-state snapshot + pinned decisions; archive the rest | content |

## Two-repo split (load-bearing)

- **Tool repo** = this marketplace (the `relay` plugin) — the protocol, universal.
- **Content repo** = the org's actual relay repo — the real data (people, projects, reports, decisions). One company = one content repo, many projects.

**Locating the content repo (every skill's first step).** The content repo is a **separate** repo (the coordination repo) — it is **almost never the current working directory** (you're usually in some other project). Resolve it in order, and **never silently assume cwd**:

1. **`$RELAY_REPO`** env var, if set (mirrors manage's `$SKILLS_REPO`) — the default content repo.
2. else the **current dir**, only if it actually has a `relay.yml` at its root (you're already inside a relay repo).
3. else **ASK the user** for the content-repo path — or offer `/relay:launch` to create one.

Then read its `relay.yml` first; never hard-code paths.

## The three axes (never tangle them)

- **Identity** (who you are) → global `relay.yml`; one source; **auto-resolved** (running git author email → a person's `git:` field). Carries name · git · github · optional title.
- **Role** (owner / developer / reviewer) → per-project `project.yml`; **descriptive defaults, not locks**; optional.
- **Action** (any verb) → anyone may do any action; not gated by identity or role (`settle` is **owner by convention** — one writer keeps its archive moves conflict-free — but it's non-critical).

`title` (org position, e.g. "CTO") is identity-level + global; `role` is per-project + functional — keep them apart.

## Resolution & decisions (the core mechanic)

- **A review resolves it** — with 1–2 people there is **no `@`-set protocol**. You `report`; the other `review`s (`agree` / `comment` / `change`). An explicit **`agree` settles it**. Silence ≠ agreement.
- **Thoughts link, not match** — a `review` references the thought it answers with a **markdown link to that thought's file** (`[<id>](<date>-<id>.md)`), so a thread is clickable, not reconstructed by scanning ids.
- **Decisions are pinned, not graduated** — a "decision" is just *a thought that got an agreeing review*. `/relay:settle` harvests these into the `index.md` snapshot's **Decisions** section. There is **no separate `decisions/` file and no graduation gate**.
- **Change one** — a new `report` + `review` supersedes the old; settle re-pins on its next run.
- **Authenticity** — a git author is spoofable, so baseline defense is **a private repo + the stated assumption colleagues don't forge each other**; **signed-commit reviews** are opt-in hardening (host-agnostic). Not coupled to GitHub's API.

## Git protocol (canonical — skills restate the reflex inline)

Paired with the append-only / shared-repo model. Each skill restates the lines it needs (self-contained at runtime); this is the owner.

- **Pull before you act** (read or write) — get everyone's latest.
- **Append-only** — write your OWN file (`thoughts/<date>-<handle>-<slug>.md`, one thought per file); **never edit someone else's** → conflict-free. A `review` **links** to the thought it answers, never edits it.
- **Commit + push after writing** — so others' agents can pull it.
- **Gate before commit** — show the user first (the marketplace-wide write-gate).
- **Shared-mutable files** (`index.md`) are touched only by `settle`, and are regenerable.
- **Conflicts** (rare, only on shared files) → **regenerate via `settle`, don't hand-merge.**
- Direct to `main`, no PR ceremony (it's a coordination repo).

## Format contract (canonical — the shared shapes all six verbs read/write)

The **single owner** of the file formats. A skill that reads or writes one of these restates the shape it touches; change a shape → update it here + every skill that touches it, in the same commit.

**`relay.yml`** (content-repo root — global roster):
```yaml
people:
  <handle>:               # frozen relay handle — id prefix + @routing; seeded from github at register
    name: <display name>
    git: <email>          # resolution key (running git author email → this person; may be a list)
    github: <account>     # display + link + handle seed (NOT the resolver)
    title: <org position> # optional — NOT a per-project role
```

**`projects/<name>/project.yml`** (per-project membership):
```yaml
members:
  <handle>: <role>        # owner | reviewer | developer | … (descriptive default, not a lock)
  <handle2>: [<role>, …]  # a member may hold several roles; consumers read list-aware
```

**`thoughts/<date>-<handle>-<slug>.md`** (the only entry type — append-only; a `report` opens, a `review` answers):
```markdown
---
date: <ISO>
by: <handle>
subject: <one line — the headline; read first>
re: [<id>](<date>-<id>.md)     # review only — a link to the thought it answers
---
<body — lead with the point, head-able>
```
- **report body** — *progress* (done · in progress · next · `@`-flag anything needing the counterpart) **or** *alignment* (a briefing: TL;DR → explanation → example). Flex length to the job; never a chronological work-log (that lives in the project repo — link to it).
- **review body** — `## Review`, one line per answered id: `agree` / `comment` / `change` + why; each line **links** to the answered thought (`[<id>](<date>-<id>.md)`).
- **id = `<handle>-<slug>`**, author-namespaced (collision-free, no central allocator); permanent. The file is `thoughts/<date>-<id>.md`, so a link by id resolves to the file.
- **`@<handle>`** marks what needs the counterpart — that's what `digest` surfaces and `review` answers. There is **no `kind` field and no `decisions/` file** — tone (progress / alignment) is how you write it; decisions are pinned by `settle`.

**`index.md`** (per-project — the settled snapshot, written ONLY by `settle`, **lazily**):
```markdown
# <project> — current state (settled @ <date>, by <handle>)
## Where things stand
- <one line per live item / workstream>
## Decisions (pinned)
- [<id>] <decision> — agreed <date> (by <who>)
```
- `digest`'s live view is **computed from the thoughts, not this file** — `index.md` may lag; `digest` is authoritative for "what needs me now".
- `settle` writes `index.md` + archives settled thoughts **only when run** (the stream got cluttered, or you want a fresh snapshot) — clean when it's worth cleaning, not eagerly.

## Awareness

**In-band**: an agent **auto-pulls + runs `digest` when opened**, surfacing "what's waiting on you". No external infra. Known limit (accepted): reaches only people who show up. Out-of-band (cron / notification) is an optional adapter later, not v1.

## Conventions

relay docs (reports, decisions, `index.md`) are authored to **`/nav:compose`** discipline (lead with the point, one fact one owner, right grain). Repo-wide authoring + maintenance rules (naming, skills-root-relative paths, frontmatter, the gates) live in the repo-root [`CLAUDE.md`](CLAUDE.md).

## Helper scripts (ADR-051)

relay is a structured-data protocol, so unlike the analysis plugins it **bundles helper scripts** for its deterministic / correctness-critical work, split from the LLM's judgment work:

- **Code (a bundled `scripts/` in the owning skill)** — mechanical + correctness-critical: set-comparison, structured parsing, signature checks.
- **The LLM (SKILL.md prose)** — judgment: distilling a report into buckets, writing a decision's rationale.

**Language by task:** parsing / set-logic → **node (`.mjs`)** (bash parses structured text fragilely; a fragile gate is the wrong risk); git / verification → **bash** (it's git commands).

**node is a fast-path, not a hard dependency** — it runs in the *agent's* environment (Claude Code / Cursor / Codex hosts almost always have it), **not** the coordinated project's toolchain (so "any async project" holds). When node is absent, the skill **degrades to a precise SKILL.md recipe** — the script raises reliability where node exists, it never gates the skill (ADR-051).

**Bundling constraint:** the Codex/Cursor mirror copies each skill's `scripts/` **independently** — no shared-across-skills location. So a helper used by one skill lives in that skill's `scripts/` (single owner); trivial cross-skill logic (identity resolution = `git config user.email` + a roster lookup) stays a **SKILL.md recipe**, not a 4×-duplicated script.

Current: **none bundled** — the consensus gate (`check-acceptance.mjs`) was retired with the `@`-set protocol (ADR-053). Sanctioned-but-not-built: signature / github verification (bash), digest / settle state computation (node).

## Where things live

```
.claude-plugin/plugin.json   → relay's manifest (version + metadata owner)
CLAUDE.md                    → ← you are here (identity · protocol · format contract)
skills/<name>/SKILL.md       → the six skills, each self-contained
```

The **content repo** layout (`relay.yml`, `projects/<name>/…`) is the format contract above — it lives in the user's coordination repo, not here.

## When editing this plugin

- **Changing the git protocol or a file format**: update it here (the owner) **and** every `SKILL.md` that restates it, in the **same commit** (stale restatement = a lie). Write an ADR if the contract changes materially.
- **New skill / rename**: follow the repo-root [`CLAUDE.md`](CLAUDE.md) gates (ADR · version bump · README + site map registration · regenerate manifests + codex · validator green).
