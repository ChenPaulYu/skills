# Refactor protocol — the full eight-step machinery

> The implementation layer behind `nav-refactor`'s Stance. The SKILL.md body carries the stance
> and the three enforced gates (green baseline, per-step test-gate + contract gate, browser pass);
> everything here is loaded for the steps around them — planning the moves, the verbatim recipes,
> header sync, reporting, and the offer/anti-pattern/escalation machinery. Moved verbatim from the
> pre-ADR-109 SKILL.md body; the machinery is unchanged, only re-homed.

## Why this skill exists

The most expensive refactor bugs come from "while I'm in here, let me also improve…" The skill exists to **enforce separation** between two activities:
1. **Move** (this skill) — relocate code with zero behavioural change.
2. **Improve** (a separate session, after the move lands and is verified) — make the now-isolated module better.

Conflating these two is how a 4-hour refactor becomes a 4-day debugging session.

## Scope

**Language-agnostic.** The discipline (verbatim move + test gate + real-app pass) applies to any stack as long as you can:
1. Run the test suite (`pnpm test`, `pytest`, `go test`, `cargo test`, `swift test`, …).
2. Optionally run the app for an integration pass (browser for UI; CLI invocation for tools; `curl` for services).

Detect the stack at the start (look at `package.json` / `pyproject.toml` / `go.mod` / `Cargo.toml` / `Package.swift` / etc.) so you know the right test + run commands. If there's no test suite at all, **flag this loudly** — refactor without verification is just guessing.

**Out of scope**: refactors that change the contract (API signatures, public types). Those are a different kind of work and need a regular code session.

If unclear what kind of refactor the user wants → rule ⑦, ask. "Is this a verbatim move, or does the contract change?"

## The 8 rules (full set — the discipline relies on them)

1. **Deep modules through information hiding** — a simple interface hiding significant complexity; usable without reading the body. The technique is **information hiding**: encapsulate each design decision (data structures, formats, assumptions) so it never surfaces in the interface. Red flag — **information leakage** (same knowledge in ≥2 modules), often from **temporal decomposition** (boundaries by execution order, not knowledge). **Recursive — composition is the second half:** modules compose behind a package façade into the next-scale deep module (module → package → codebase); a folder earns existence by hiding members or by being the declared contract — anything else is a drawer.
2. **Interface-first at every scale** — an index/facade surfaces the interface; you drill in only as needed.
3. **Explicit dependencies** — functions deterministic; deps explicit, not ambient.
4. **Right grain — neither giant nor fragmented** — no mega-module/function; equally no needless abstraction.
5. **Fit the framework** — idiomatic patterns (React: custom hooks; pass store/hook objects, not 20 loose props).
6. **Rearrange, don't rewrite** — *this skill is rule ⑥ in action.* Move verbatim + rewire; behaviour stays identical.
7. **Below 90% confidence → ask.**
8. **Agent-navigability is the audit.**

## Step 2 — Identify the moves (plan, don't act)

State the refactor in one sentence: "Move X out of Y into a new Z, keep behaviour identical."

Then list:
- What pieces move (functions, state, refs, JSX subtrees)
- What new files get created
- What the interface between old and new looks like
- What gets DELETED from the original

If the answer to any of these is "I'll figure it out" → rule ⑦, ask the user to clarify the scope before starting.

**If the module has external consumers, freeze the contract first.** When the thing being refactored is imported by other code/projects (a library's public API, a package boundary), circle the **contract** before any move: the exported symbols + public signatures that must NOT change. Everything behind that line restructures freely; the contract bytes stay still ("保門面、整身體" — keep the facade, rework the body). This makes the contract a *gate* (Step 4), not a hope. State explicitly what's frozen (e.g. "`__init__` exports + every `YouTubeToolkit` public method signature") and what's free (handlers, internal helpers, return-dict *internals* if not part of the contract).

## Step 3 — Decompose into smallest behaviour-preserving steps

Each step must be:
- **Atomic** — one logical move (one new file extracted, OR one set of usages rewired)
- **Verbatim** — copy the code; do not rewrite while moving
- **Test-gatable** — after the step, the same tests still pass without modification

For a typical "extract a hook" refactor, the steps might be:
1. Create the new hook file with the lifted logic (copy verbatim, paste).
2. In the original file, replace the lifted block with a call to the new hook.
3. Remove now-orphaned imports / state.
4. (Repeat for the next hook.)

**Common verbatim recipes** (each keeps the original entry point as a thin delegator, so the contract from Step 2 can't move — the recipe IS the "smallest behaviour-preserving step" for that shape):

- **God-class / fat-facade → a service (or domain-module) layer.** The original class keeps every public method as a *one-line delegation*; the body moves verbatim into a service that holds a back-reference to the original (`self._toolkit` / `self._ctx`). Inside the moved body, mechanically rewrite the owner reference (`self.` → `self._toolkit.`) so cross-domain calls and helpers still resolve with **zero judgment** — which is exactly what makes each service delegable to a worker and the move auditable. The public class shrinks to a delegation index; each domain's logic becomes one readable file.
- **Giant function → private helpers.** Extract each cohesive block (build-params, process-response, assemble-result) into a `_private` helper of the same class; pass the locals it needs *in*, return what the caller needs *out*. The public function keeps its signature and becomes a short orchestrator. Don't over-fragment (rule ④) — extract to clarity, not to a pile of 3-line helpers.

## Step 5 — Repeat steps 3-4 until the plan is complete

If you discover mid-refactor that the plan was wrong (a piece doesn't actually move cleanly), stop and replan. Don't improvise.

## Step 7 — Sync headers, then report

**Header sync (same change — do NOT defer).** For every file whose role or `Reads` changed in the move — a newly extracted file, or a source file that shed responsibility — update its top header *now*, in this refactor. A moved file whose header now lies is an **incomplete** move (stale header = lie). The header is a comment, not the code body, so syncing it does not violate verbatim. This mirrors `nav-do`'s header-hygiene gate — per-file headers travel *with* the change; only the repo-level codebase **map** regen is deferred to `nav-sync`'s map leg.

Output a summary to chat:
- Files changed (with LOC delta — e.g., `Editor.tsx: 1718 → 773 lines`)
- Headers synced (every file whose role / `Reads` changed)
- Tests passed (90/90)
- Browser-verified flows (list them)
- Any deferred follow-ups (things you noticed but did NOT do — those are next-session work)

Do NOT commit unless the user explicitly asks. Per the project's git discipline, branch first if on the default branch.

## Step 8 — Offer next action (don't make the user type the next command)

After Step 7's report, present next-action options via the Codex interactive chooser. The discipline ("don't commit / don't improve in this session") is preserved by the question — the user picks; nothing happens unless they do.

**Default 3 options** (drop or rephrase per situation):

| # | Option | What happens if picked |
|---|---|---|
| 1 | Commit on a new branch and open a draft PR *(Recommended if on default branch)* | Branch off current HEAD, stage the refactor diff, commit with a message summarising the move (LOC delta + files changed), push, run `gh pr create --draft`. Confirm the commit message before committing. |
| 2 | Launch worker for a follow-up "improve" session on the extracted module | Dispatch a scoped executor worker. **Inject (→)** four things: the newly extracted file path(s); the discipline that this is the *improve* phase (the verbatim move already landed and is verified); any simplifications noticed during the move that were deliberately deferred; **and the surrounding seam** — what the module exposes, who consumes it, and the **N+1 trigger** so the improve pass extracts a shared primitive instead of adding a parallel one. Worker works in clean context — enforces the move/improve separation at the architecture level. **Check (←)** before accepting "done": read its diff for a parallel impl in the same domain, a bypassed barrel/facade, or a stale/missing header, **and run a verify gate** — tests green + the changed behaviour exercised (an improve pass changes code, so it follows `nav-do`'s check, not just refactor's identical-tests gate). STOP if any fails. See [ADR-008](docs/adr/008-inject-check-at-handoff.md). |
| 3 | Done — I'll handle from here | Skill ends. |

**Skip Step 8 if**:
- The refactor partially failed (some steps reverted; final state isn't green). Don't offer commit / improve — surface the failure honestly first and let the user decide.
- The user already said "don't ask, just report" earlier in this conversation.

**One-shot, no nagging.** If the user picks "Done", do not re-offer.

See [ADR-007](docs/adr/007-offer-next-action-pattern.md) for the pattern's rationale.

## Anti-patterns (refuse these, even if tempting)

| Temptation | Instead — and the tell |
|---|---|
| "While I'm moving this, let me also rename `foo` to `bar`" | Make the rename its own commit — coupling it with a move hides bugs. Tell: the diff has a rename and a relocation tangled in the same hunk. |
| "This logic could be simpler — let me clean it up while I move it" | Save the cleanup for a separate session after the move lands — that's improvement, not refactor. Tell: a "moved" file's line count or logic no longer matches the original verbatim. |
| "The tests don't cover this — I'll just hope it works" | Browser pass it, or narrow the refactor scope to what IS covered. Tell: about to call the move done with no way to demonstrate the behaviour is unchanged. |
| "I'll skip the typecheck this once, I know it'll pass" | Run the typecheck anyway — the discipline IS the value, and skipping erodes trust in your own work. Tell: reaching for "I know it'll pass" as the reason to skip a check that takes seconds. |
| "Let me batch 5 steps and test at the end" | Gate each step individually — when a batched change breaks, you can't bisect it. Tell: five moves are staged before the first test run. |

## When to stop and escalate to the user

- The refactor reveals a hidden bug in the original code (don't fix it inline; flag it as a separate finding).
- The original code has no test coverage for the area being moved (offer to add tests first, before refactoring).
- You can't run the app to do the browser pass.
- You discover the planned moves don't actually preserve behaviour (the plan was wrong; surface this immediately, don't improvise a workaround).
