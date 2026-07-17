# ADR 061 — relay stays git-native; the GitHub-native alternative is evaluated, validated, and shelved as the competitive bar

**Status**: accepted — implemented 2026-07-06 (relay `0.6.0`)
**Relates**: [ADR-050](docs/adr/050-relay-plugin.md) (relay plugin) · [ADR-053](docs/adr/053-relay-thought-stream.md) (thought-stream) · [ADR-054](docs/adr/054-relay-decision-ledger.md) (ledger) · [ADR-051](docs/adr/051-helper-scripts.md) (script/judgment split)

## Context

One session of dogfooding (2026-07-06) surfaced four v1 pains: the session-open hook reported already-answered mentions as waiting (a naive grep), digest re-read every thought per run, digest's ask-detection under-restated its own protocol (`@`-only, missing ❓-asks), and awareness had no out-of-band channel. The obvious question followed: GitHub ships threading, review verbs (Approve/Comment/Request-changes ≅ agree/comment/change), mention notifications with mobile push, stored open/closed state, computed backlinks, and even *enforces* "can't approve your own proposal" — why maintain a hand-built file protocol at all?

A full GitHub-native redesign was drafted and **validated hands-on** (sandbox repo: FYI close-at-birth, close-with-conclusion, RFC-style proposal-file PRs, a 30-line `gh` digest) — the full design memo lives in private notes (moved out of this public repo 2026-07-17: it named internal collaborators and a private repo). It works. The question was never feasibility.

## Decision

**relay keeps the git-native file protocol.** The GitHub migration is rejected on two grounds, neither technical:

1. **It reverses a standing product decision.** accord's ledger has `[relay-as-platform]` (agreed 2026-06-25): relay/accord is a core platform to *nurture*, not internal plumbing. Migrating its guts to GitHub is not a tooling swap — it abandons the platform bet. That reversal, if ever wanted, is a strategy decision for the accord parties, not a tooling ADR.
2. **It contradicts the substrate thesis.** The company's line (typed files, first-class links, agent-native repos) holds that truth lives in repo files an agent reads without API, auth, or network. Moving conversation into GitHub's metadata layer makes the coordination history platform-hosted — the exact dependency the thesis argues against.

The dependency rule that falls out: **core data never depends on a platform; ephemeral edges may.** Notifications (transient by nature) may ride GitHub Actions/Discord/anything — losing them costs a re-wire, not history.

What v1 takes from the evaluation instead:

- **`digest/scripts/compute-state.mjs`** (this ADR's implementation) — the sandbox `digest.sh` logic ported to the file protocol, per ADR-051's split: set-logic (thread grouping, unanswered-ask computation, settled/open, image counts) is deterministic node; **judgment cases are `flags`, never silently decided** (e.g. `question-marks-no-mention`). Validated against accord's real stream: 7/7 threads correct, 0 false waits, 1 correct judgment flag, 24ms.
- **The session-open hook runs the script** (`--format hook`) instead of the mention-count grep — the hook stops lying because it now runs the same computation digest trusts.
- **The v2 design doc stays as the feature bar**: native notifications, self-approve blocking, stored state — what relay-as-product must match to justify existing next to GitHub.

## Consequences

- digest gains a fast path (SKILL.md Step 2): run the script, then read **only the flagged thoughts** — per-run cost stops scaling with stream length.
- relay `0.5.0 → 0.6.0`: the script, the digest fast path, plus the same-day protocol fixes (repo-path caching in the resolution chain; digest's "waiting on others" aligned to the canonical ask definition — `@`-flag / `change` / real-question comment).
- The out-of-band notification edge (accord push → Discord ping) is sanctioned but not built — it touches accord and the counterpart's setup, so it ships when the accord parties want it.
- Reversal path: if relay-as-platform is ever re-decided, the shelved design doc is the migration plan, already validated.
