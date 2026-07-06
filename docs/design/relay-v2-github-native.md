# relay v2 — GitHub-native redesign (delete the mechanism, keep the discipline)

> **Status: DRAFT (2026-07-06)** · validated hands-on in [`ChenPaulYu/relay-v2-sandbox`](https://github.com/ChenPaulYu/relay-v2-sandbox) (issues #1–#4, PR #3, `scripts/digest.sh`). Supersedes-if-agreed: the file-based thought-stream protocol (ADR-050/053/054). Decision pending greented's review.
>
> **TL;DR** — relay v1 rebuilt threading, mentions, review verbs, notifications, and open/settled state as a custom file protocol. GitHub already ships all five, natively, with mobile push. v2 deletes the mechanism and keeps the two disciplines GitHub does *not* enforce: **write a self-contained opening** and **distill before you close**. Seven verbs collapse to two skills + one 30-line script.

## Why redesign (the evidence)

One session of dogfooding v1 (2026-07-06) surfaced the cost of self-built infra:

- The session-open hook reported "3 thoughts mention @you" — **all three were already answered**. The hook greps for `@`; it can't afford the real answered-or-not computation, so it misroutes attention (digest's own cardinal sin).
- digest re-reads every thought file, every session open (14 files today; grows linearly), to recompute state GitHub tracks as a field.
- digest's `@`-only ask detection under-restated its own protocol (a real ask with ❓ but no literal `@` fell through) — signal vocabulary drift between CLAUDE.md and SKILL.md, the kind of bug a platform field doesn't have.
- No out-of-band notification: awareness "reaches only people who show up." greented hand-built a dashboard + morning report to compensate; the natural next ask was a Discord cron — i.e., we were about to rebuild GitHub notifications.

Each fix (state-computation script, caching, notification adapter) is another brick of self-built infra replicating a platform feature. The right move is not better bricks.

## The isomorphism (why GitHub fits exactly)

| relay v1 | GitHub native |
|---|---|
| thought with `@handle` ask | Issue with mention / assignee |
| review: `agree` / `comment` / `change` | PR review: Approve / Comment / Request changes |
| `thread:` grouping anchor | the Issue/PR itself |
| `re:` reply chain | comment threading |
| `relate:` cross-links + computed backlinks | `#N` cross-references; backlinks computed by platform (timeline API, validated) |
| open vs settled — computed by scanning | Issue `state` + `stateReason` — a stored field (`COMPLETED` = concluded, `NOT_PLANNED` = FYI/withdrawn, validated) |
| digest | `gh pr list --search review-requested:<me>` + `gh issue list --search mentions:<me>` (validated: answered asks drop out automatically because closing removes them) |
| identity: relay.yml git-email mapping | GitHub account (gh auth) |
| per-project spaces | labels: `project:<name>` (validated) |
| awareness hook | native notifications: email + mobile push on mention/assign/review-request |
| "your own agree doesn't settle your own ask" (convention) | **platform-enforced**: cannot approve your own PR, cannot request review from author (validated — GraphQL/422 errors) |

The last row is a strict upgrade: v1's honor-system rule is a hard guarantee in v2.

## The two-lane protocol

Routing test, one question: **"does this need a durable record?"**

### Lane 1 — Issue (ephemeral: FYI, questions, discussion)
- **FYI**: create with the counterpart mentioned, close at birth (`--reason "not planned"`). Notification fires; nothing waits on anyone. (Validated: #1.)
- **Ask/discussion**: create, assign the counterpart, discuss in comments. **Close only via a conclusion comment** — a self-contained ruling (`--reason completed`). (Validated: #2.)

### Lane 2 — PR with a decision file (durable: rulings, framings, canon)
The Rust-RFC / PEP model, validated end-to-end (#3):
1. Branch; write the proposal as `projects/<name>/decisions/NNN-<slug>.md` (Context / Decision / Consequences — ADR-shaped).
2. Open PR; the counterpart reviews with native verbs.
3. **Convergence edits the file in-branch** — objections absorbed, status flipped to `agreed <date>`.
4. Squash-merge = the decision. **main only ever holds converged content**; the draft's evolution lives in PR history.

`decisions/log.md` retires as a hand-maintained ledger; the numbered files *are* the ledger, `ls` is the index. (Optionally keep log.md as a generated one-line index.)

## What survives, what dies

| v1 verb | v2 fate |
|---|---|
| `launch` / `register` | **die** — repo + collaborators are the structure; identity is the GitHub account |
| `report` | **survives, thinner** — routes Issue vs PR, writes the opening well, gates before posting |
| `review` | **dies** — native PR review / issue comments |
| `digest` | **dies into a script** — `scripts/digest.sh` (~30 lines of `gh`, validated); session-open hook runs it |
| `format` | **dies** — no custom frontmatter left to lint |
| `settle` | **survives as `conclude`** — enforces the one load-bearing rule: no COMPLETED close and no merge without a self-contained conclusion |

Content-repo layout after migration:

```
accord/
  projects/<name>/
    decisions/NNN-<slug>.md   # merged rulings (the ledger IS the files)
    core/                     # unchanged (canon; amendments arrive as PRs — fits shape:position ADR-041)
    thoughts/                 # FROZEN archive (v1 history; links keep resolving; nothing new lands here)
  scripts/digest.sh           # the digest replacement
  .github/ISSUE_TEMPLATE/     # report shape for humans posting from the web UI
```

## The one load-bearing rule

Deliberation now lives in GitHub's metadata layer, not the repo. If a decisive argument stays buried in a comment thread, it's find-able but archaeological. Therefore the single rule v2 actually enforces:

> **Nothing closes as COMPLETED and nothing merges without a self-contained conclusion** — the ruling readable alone, absorbing the objections that shaped it, citing the thread URL for archaeology.

This was already v1's settle discipline; v2 promotes it from "one of many rules" to "the only wall." Everything else is the platform's problem now.

## Known limits (accepted)

- **`gh` + network required** to read discussions (repo files still work offline). Both parties have gh authenticated.
- **Issue templates are web-UI only** — `gh issue create --template` is interactive-only (validated); agent-side shape lives in the skill prose.
- **Platform lock-in**: conversation history is GitHub-hosted. Accepted deliberately — the durable artifacts (decisions, canon) are repo files either way, and "GitHub 基本不會倒" (Paul, 2026-07-06). Issues export via API if ever needed.
- **Private repo assumed** (already true of accord).

## Migration plan (small)

1. greented reviews this design — **as the first Lane-2 PR against accord** (dogfoods the protocol on its own adoption decision).
2. On agree: freeze `thoughts/`, add labels + `scripts/digest.sh` + issue template to accord, repoint the session-open hook at the script.
3. greented's dashboard swaps file-reads for `gh api` — less code, since "waiting on me" is now precomputed by GitHub.
4. Rewrite the relay plugin: two skills (`report`, `conclude`) + the script; retire five. ADR + version bump per repo gates.

## Open questions for review

1. Numbered decision files (`006-…`) vs dated (`2026-07-06-…`)? Draft uses numbers (ADR convention; existing log has 5 entries → start at 006).
2. Keep a generated `log.md` index, or is `ls decisions/` enough?
3. Should FYIs skip Issues entirely (a plain commit touching nothing) — or is the notification worth the closed-issue noise? Draft says: Issue, closed at birth (notification is the point).
