---
name: refactor
description: "Execute a structural refactor with strict discipline: verbatim moves only (no rewriting while moving), test-gated after every step, real-app-verified at the end (browser pass for UI; CLI/integration run for backend). Behaviour-preserving only — extract, split, decompose, or reorganize code without changing what it does; for a behaviour-changing small change use /nav:do instead. The skill enforces the discipline; the agent does the moves."
---

# Deep-module refactor

Execute a structural refactor with the rule ⑥ discipline: **move existing code verbatim into its new home and re-wire it; never rewrite while moving.** Behaviour stays identical, proven by tests after each step and a real-app pass at the end. The skill exists to enforce a hard separation between **move** (this skill — zero behavioural change) and **improve** (a separate session, after the move lands and is verified) — conflating them is how a 4-hour refactor becomes a 4-day debugging session.

## Stance

- **Behaviour-preserving only.** Extract / split / decompose / reorganize without changing what the code does. A refactor that changes the contract (API signatures, public types) is out of scope — that's a regular code session. Below 90% confidence on which kind this is → ask.
- **Plan the moves before touching anything.** State the refactor in one sentence, list what moves / what's created / what's deleted, and — if the module has external consumers — freeze the contract first (the exported symbols that must NOT change; everything behind that line is free). Decompose into atomic, verbatim, test-gatable steps.

### Step 1 — Establish green baseline (GATE)

Before touching anything, run the stack's gate trio (typecheck + lint + tests). Examples:

| Stack | Gate commands (typical) |
|---|---|
| TS/React | `pnpm typecheck && pnpm lint && pnpm test --run` |
| Python | `mypy . && ruff check . && pytest` |
| Go | `go build ./... && go vet ./... && go test ./...` |
| Rust | `cargo check && cargo clippy && cargo test` |
| Swift | `swift build && swift test` |

All must pass. If any fails, **stop**; baseline must be green or refactor success is unmeasurable.

Also note: can you run the app? (`pnpm dev`, `python -m app`, `go run .`, `cargo run`…) If not, refactor is text-only — limit scope accordingly.

### Step 4 — Apply ONE step, then test-gate (GATE)

After every single step, re-run the stack's gate trio (the one you established in Step 1):

```bash
# whichever applies — e.g. for TS/React:
pnpm typecheck && pnpm lint && pnpm test --run
```

All three must stay green. If any breaks → **revert that step** and try a smaller decomposition. Do NOT pile on more changes hoping they'll fix it.

**Contract gate (when Step 2 froze a contract).** Tests alone won't catch a quietly-widened public signature. Add a mechanical check that the frozen surface is byte-identical to before the move:

```bash
# e.g. Python: compare public signatures vs the previous commit
git show HEAD:path/to/api.py | grep -E '^    def [a-z]' | sed 's/ \+/ /g' | sort > /tmp/before.txt
grep -E '^    def [a-z]' path/to/api.py | sed 's/ \+/ /g' | sort > /tmp/after.txt
comm -23 /tmp/before.txt /tmp/after.txt   # MUST be empty: nothing removed/changed
```

Adding new (e.g. private `_`-prefixed) members is fine; removing or changing a frozen one is a contract break → revert. Run this every phase, not just at the end.

When green: optionally commit (small commits make bisecting trivial later).

### Step 6 — Browser pass (GATE — unconditional; its auto-execution is gated, ADR-114)

Tests prove unit-level behaviour. The full integration is only proven by running the app. **Run it without asking when you can state the pass up front as ≤5 interactions** (open → exercise the one moved area → screenshot → confirm). **Ask first — a real `AskUserQuestion`, not a line of prose** — when it needs broader computer-use driving, when it would spend live LLM tokens, or when you cannot state the check up front — and if the user declines, **report it as debt** ("shipped unverified at your call: \<what wasn't exercised\>"), never as a silent skip.

```bash
pnpm dev              # or npm start
# Then exercise the area you changed via agent-browser (or have the user click through)
```

Specifically dogfood the gestures / flows / state transitions that weren't unit-tested. For a hook extraction: trigger every code path the extracted hook handles. For a JSX subcomponent extraction: render every state of the subcomponent.

Zero console errors + behaviour identical to baseline = refactor done.

- **Header sync rides the same change (Step 7).** Every file whose role or `Reads` changed in the move gets its top header updated *now* — a moved file whose header now lies is an incomplete move (stale header = lie). Then report: files changed (LOC delta), headers synced, tests passed, browser-verified flows, any deferred follow-ups.
- **Don't commit unless asked; DO offer next action (Step 8).** Present an `AskUserQuestion` with commit + draft PR, launch a sub-agent for a follow-up *improve* session (inject the seam + N+1 trigger, check the returned diff for a parallel impl / stale header / verify gate before accepting done), or done. Skip the offer if the refactor partially failed — surface that honestly first. One-shot, no nagging.

Full eight-step protocol (Steps 2/3/5's planning + verbatim recipes, Step 7/8's full detail, the 8 rules, anti-pattern table, escalation triggers): `references/refactor-protocol.md`.

### Step 8 — Offer next action (don't make the user type the next command)

After Step 7's report, present next-action options via `AskUserQuestion`. The discipline ("don't commit / don't improve in this session") is preserved by the question — the user picks; nothing happens unless they do.

**Default 3 options** (drop or rephrase per situation):

| # | Option | What happens if picked |
|---|---|---|
| 1 | Commit on a new branch and open a draft PR *(Recommended if on default branch)* | Branch off current HEAD, stage the refactor diff, commit with a message summarising the move (LOC delta + files changed), push, run `gh pr create --draft`. Confirm the commit message before committing. |
| 2 | Launch sub-agent for a follow-up "improve" session on the extracted module | Invoke `Agent` with `subagent_type=general-purpose`. **Inject (→)** four things: the newly extracted file path(s); the discipline that this is the *improve* phase (the verbatim move already landed and is verified); any simplifications noticed during the move that were deliberately deferred; **and the surrounding seam** — what the module exposes, who consumes it, and the **N+1 trigger** so the improve pass extracts a shared primitive instead of adding a parallel one. Sub-agent works in clean context — enforces the move/improve separation at the architecture level. **Check (←)** before accepting "done": read its diff for a parallel impl in the same domain, a bypassed barrel/facade, or a stale/missing header, **and run a verify gate** — tests green + the changed behaviour exercised (an improve pass changes code, so it follows `/nav:do`'s check, not just refactor's identical-tests gate). STOP if any fails. See [ADR-008](docs/adr/008-inject-check-at-handoff.md). |
| 3 | Done — I'll handle from here | Skill ends. |

**Skip Step 8 if**:
- The refactor partially failed (some steps reverted; final state isn't green). Don't offer commit / improve — surface the failure honestly first and let the user decide.
- The user already said "don't ask, just report" earlier in this conversation.

**One-shot, no nagging.** If the user picks "Done", do not re-offer.

See [ADR-007](docs/adr/007-offer-next-action-pattern.md) for the pattern's rationale.

## Companion skills

- **`/nav:do`** — the behaviour-*changing* twin: when the work adds/changes behaviour rather than preserving it (this skill is moves only).
- **`/nav:audit`** — find what to refactor.
- **`/nav:sync`'s map leg** — after the refactor lands, regenerate the codebase **map** so it reflects the new shape (the audit block records what changed). (Per-file headers of touched files are already synced in Step 7; for a holistic header sweep across the repo, run **`/nav:sync`**.)

## Communication style

- Explain in the user's language with simple, direct wording.
- Lead each reply with one plain sentence; use a metaphor when it clarifies the concept.
- Put precise technical detail after the plain explanation and only where it's needed.
