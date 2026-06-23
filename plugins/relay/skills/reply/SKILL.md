---
name: reply
description: "Respond to relay items addressed to you — accept or reject a decision, clear a blocker, or counter — by id. An accept that completes a decision's @-approver-set graduates it to decisions/ right then. Use when the user asks to \"reply in relay\", \"accept this decision\", \"approve it\", \"respond to the report\", \"clear the blocker\", or \"relay reply\". Content verb; the read-side is /relay:digest, the open-side is /relay:report. Writes an append-only entry (and, on graduation, a decision file), gated by a diff."
---

# reply — respond to items (accept / clear / counter)

Answer the items pointing at you. The high-stakes case is **accept**: when your accept completes a decision's `@`-set, the decision is **ratified and recorded in the same breath**.

## Scope

Operates on a **content repo** (`relay.yml` at root). Writes **one append-only entry** (`thoughts/<date>-<handle>.md`) and, when an accept graduates a decision, **one `decisions/<id>.md`** — both in one gated commit.

## Process

### Step 1 — Resolve + pull + find what's @me
- **Resolve who's running** (git author email → `git:` in `relay.yml` → your handle), **pull**, then find open items addressed to you (`@<your-handle>`).

### Step 2 — Respond by id
Write `thoughts/<date>-<handle>.md`:
```markdown
---
date: <ISO>
by: <handle>
---
## Replies
- re [<id>]: **accept** — <why>     # an explicit, affirmative act (silence ≠ consent)
- re [<id>]: reject — <why>          # → stays open, a revise/abandon signal
- re [<id>]: cleared — <how>         # a blocker you've unblocked
- re [<id>]: <counter / question>    # keeps the thread open
```

### Step 3 — Graduate on completion (event-driven)
For each `[D]` you **accept**: confirm completion **deterministically**.
- **If node is available** (the fast path): run `node scripts/check-acceptance.mjs <project-dir> <id>` and graduate **only** ids it reports `complete: true` (the exact consensus gate, ADR-051).
- **If node is absent** (graceful fallback): compute the same check by hand — list the `[D]`'s `@`-set (its raise line) and every `re [id]: accept` author; it is complete **iff every `@`-ed handle appears as an accepter**.

Either way, **only a complete `@`-set graduates**. **If your accept completes the set**, this same commit **also writes** `decisions/<id>.md`:
```markdown
---
id: <id>
status: active
decided: <ISO>
proposed-by: <handle>
accepted-by: [<the full @-set>]
supersedes: —        # or <id> if this overrides a prior decision (flip that file to status: superseded)
from: thoughts/<originating file>
---
# <decision, distilled>

<rationale — /nav:compose discipline: lead with the point, link don't restate>
```
If the `@`-set is **not yet complete**, just leave the accept; it graduates when the last required accept lands. **Show the diff. Wait for OK**, then commit + push.

## Discipline
- **Accept is explicit + presence-checked** — never infer consent from discussion; silence ≠ consent.
- **Graduate only on a complete `@`-set** — confirmed by `scripts/check-acceptance.mjs` (a computed set-comparison, not an inferred one); one new `decisions/` file (conflict-free); never graduate a half-approved [D].
- **Supersede, don't rewrite** — overriding a live decision = a new [D] through the gate + flip the old to `superseded`.
- **Append-only; pull before, push after; gate before commit.**

## Anti-patterns (refuse these)
| Temptation | Why to refuse |
|---|---|
| Graduate a [D] before its whole `@`-set accepted | Consensus = unanimous of the `@`-set; partial ≠ ratified |
| Infer "they seem fine with it" as accept | Explicit accept only; silence ≠ consent |
| Edit a live decision to change it | Supersede via a new [D]; never silently rewrite canon |
| Edit someone else's thought to mark accepted | Append-only; your accept is your own entry |

## Companion skills
- **`/relay:report`** — raises the items you reply to.
- **`/relay:digest`** — shows you what's `@you` and awaiting your accept.
- **`/relay:settle`** — later archives the threads your accepts closed.

## Communication Style
- Always explain concepts using simple, direct, and plain language (請用簡單、白話的語言解釋).
- Use analogies and metaphors frequently to explain complex programming or design concepts (請多使用易懂的比喻來解釋複雜的程式或設計概念).
- Use Traditional Chinese (Taiwanese phrasing) for all user-facing explanations.
- Avoid academic jargon and unnecessary verbosity.
- Keep explanations concise and actionable.
