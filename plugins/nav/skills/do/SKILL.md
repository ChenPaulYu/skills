---
name: do
description: "Execute a small, already-decided, behaviour-CHANGING change directly — with nav's deep-module discipline carried inline, but WITHOUT a plan.md artifact. Use when the user wants to \"just add X\", \"make this small change\", \"implement this small feature\", \"quick add Y\", \"do this small thing (properly)\", OR has just converged a decision (a mockup pick, an elicit thought) and now says \"make it functional\", \"now build it\", \"wire it up for real\", \"make this real\" — the post-converge handoff into a small build is a primary trigger (don't flow into the build on ambient discipline alone; fire this verb so its check bracket actually runs). A change too small to be worth /nav:plan's full ground-clarify-artifact ceremony, yet you still want it placed deep-module-correctly instead of winged. NOT for behaviour-PRESERVING restructuring (that's /nav:refactor — verbatim move + test gate, no new behaviour) and NOT for changes big or ambiguous enough to deserve a written plan (that's /nav:plan). The kernel is two halves: continuous deep-module/header/N+1/LOC awareness (乙) + a thin enforced bracket (甲) — inject (head -12 the target file + grep for a reusable existing impl) → execute → check (new load-bearing file carries a header · second consumer of an inline util triggers an N+1 extract · an unconditional verify/test gate). This is the same execution discipline a sub-agent already carries when /nav:plan or /nav:refactor dispatches it (ADR-008), promoted to a directly-invocable verb."
---

# Deep-module do — execute a small change, disciplined

Make a small, already-decided, **behaviour-changing** change happen **now** — and place it deep-module-correctly as you go, without the ceremony of a written plan. nav's execution verb: the only nav skill that writes new/changed feature code directly.

## Why this skill exists

nav had a gap. Look at what each verb does to code: `audit` is read-only; `sync` writes file headers and `map` writes the codebase map, not feature code; `plan` writes a `plan.md` artifact, not code; `refactor` executes — but **behaviour-preserving** only (verbatim move + rewire, tests stay identical, rule ⑥). **Nothing executed a behaviour-*changing* change.** So for a feature too small to deserve `plan.md`, you were stuck choosing between the heavy plan path and dropping all deep-module discipline. `do` fills that slot.

It is **the same execution discipline a sub-agent already carries when `/nav:plan` (Stage 4) or `/nav:refactor` (Step 8) dispatches it** — the inject↔check hand-off ([ADR-008](docs/adr/008-inject-check-at-handoff.md)) — but **promoted to a standalone, plan-less verb** you can summon directly. It is not `refactor` widened: refactor moves without changing behaviour; `do` changes behaviour. They are twins across one seam (preserve vs change).

## Scope

**Language-agnostic.** The discipline works on any stack, as long as you can detect it (`package.json` / `pyproject.toml` / `go.mod` / `Cargo.toml` / `Package.swift` / …) and run its verify command.

**In scope**: a small, decided, behaviour-changing change — a new small feature, a fix, an added option, a new endpoint/handler — that you can hold in your head without a written plan.

**Out of scope — route elsewhere:**
- **Behaviour-preserving restructuring** (extract / split / move / decompose) → `/nav:refactor` (verbatim move + per-step test gate). `do` adds behaviour; refactor rearranges it.
- **Big or ambiguous enough to need a written, reviewed plan** → `/nav:plan` (ground → clarify → artifact). If you find yourself wanting to write the steps down before starting, it's a plan, not a `do`.
- **Undecided what to build** → `/shape:elicit` or `/shape:mockup` first; `do` executes a decision, it doesn't make one.

**Below 90% confidence on what's wanted → rule ⑦, ask.** "Is this a small change I should just do, or does it need a plan first?" The whole value of `do` is a *decided* small change; if it isn't decided, stop.

## The 8 rules (full set — the discipline relies on them)

1. **Deep modules through information hiding** — a simple interface hiding significant complexity; usable without reading the body. The technique is **information hiding**: encapsulate each design decision (data structures, formats, assumptions) so it never surfaces in the interface. Red flag — **information leakage** (same knowledge in ≥2 modules), often from **temporal decomposition** (boundaries by execution order, not knowledge).
2. **Interface-first at every scale** — an index/facade surfaces the interface; you drill in only as needed.
3. **Explicit dependencies** — functions deterministic; deps explicit, not ambient.
4. **Right grain — neither giant nor fragmented** — *the operative rule here:* place the new code so it deepens an existing module rather than widening its interface or spawning a needless one. The **N+1 trigger** (rule ④ + ②) is its trip-wire — second consumer of an inline util ⇒ extract a primitive, don't copy.
5. **Fit the framework** — idiomatic patterns (React: custom hooks; pass store/hook objects, not 20 loose props).
6. **Rearrange, don't rewrite** — when part of the change is structural, that part follows refactor discipline (verbatim move + gate); `do` adds the *new* behaviour around it.
7. **Below 90% confidence → ask.**
8. **Agent-navigability is the audit** — a new load-bearing file that can't be described in one sentence is a failed abstraction; fix the shape, then add its header.

## The kernel — 乙 always on, 甲 enforced

**乙 — awareness, continuous.** Throughout writing, the deep-module sense rides along: right grain, the header convention, the N+1 trigger, and the LOC thresholds (file > ~500 LOC = warn / > ~700 = act; function > ~100; component > 5 `useState` + 5 `useRef` + 30 inner fns; `return (` > ~300 lines JSX; > 20 imports). When a smell trips **while** you work, surface it — don't silently restructure (that would be a `refactor`, a separate move).

**甲 — the enforced thin bracket.** Three beats, no artifact:

### inject (→) — ground before you touch (cheap)
- `head -12` the file(s) the change lands in — role + `Reads` without reading the body. (No header? that's a rule-① smell; note it.)
- **grep the target domain for a reusable existing impl** before adding anything new — the single most common miss. A fresh execution re-implements what's already there (the canonical ADR-008 failure: a re-written `fillPath()` that already existed with important bucketing, shipped green-tested). Reuse it; don't add a parallel one.
- Confirm placement: which existing module does this deepen? If the honest answer is "it widens an interface / needs a new module", that's a grain decision — say so before writing.

### execute — make the change
Write the behaviour-changing code, placed per the inject pass. Keep moves and additions separate: if you must relocate existing code to make room, do that part verbatim (rule ⑥) as its own step, *then* add the new behaviour — don't rewrite-while-moving.

### check (←) — three gates before "done"
1. **Header hygiene** — a new load-bearing file (≥150 LOC · domain leader · subsystem barrel) carries a header in the project's convention; a file whose role / main imports / load-bearing status changed has its header updated **in the same change** (stale header = lie). **Canon carve-out (ADR-041):** if the change altered a fact recorded in a canon doc (`docs/core/*`-class), do NOT sync the canon doc — even with the user's fresh ratification in hand; append a one-line pending amendment to `docs/core/amendments.md` (what changed · evidence · `by /nav:do`) instead. Stale canon = tracked debt, not a same-commit fix; only the canon-authoring verb writes core.
2. **N+1** — did this add a second consumer of an inline util? Extract the primitive; don't ship the copy. Did it bypass a barrel/facade, or shove a new concern into one? Read the seam rule at *intent*, not as a wall. **N+1 fires on *values* too, in any *layer*** — a 2nd raw copy of a color / constant / config value (code OR CSS / prompt / config) = reference its owner, don't re-express it. And a *new* distinct design value must earn its distinctness vs the nearest existing one: a sub-JND near-duplicate is drift, not a new level/category (the justification is **perceptually vetoable** — a stated reason doesn't survive an imperceptible difference). This is the *cheap per-change half*; it's structurally blind to leakage that only shows in aggregate — the guarantee is `/nav:audit`'s value-leakage check ([ADR-032](docs/adr/032-value-leakage-layer-agnostic-three-tier.md)).
3. **Verify gate (unconditional)** — run the stack's gate + exercise the new behaviour. Tests *change* here (unlike refactor, where they stay identical): add/adjust a test for the new behaviour where the suite supports it, run typecheck + lint + tests, and for anything not unit-covered (UI gestures, flows) do a real-app pass via the project's browser-verify capability. **No test suite at all → flag it loudly**; behaviour-changing work with no verification is guessing.

## Process

1. **Confirm it's a `do`, not a plan or a refactor.** One sentence: "Add/change <behaviour> in <module>, keeping the rest identical." If you can't say it in one sentence, or it spans many files, it wants `/nav:plan`. If it changes no behaviour, it's `/nav:refactor`.
2. **inject** — `head -12` + same-domain reuse grep + placement call (above).
3. **execute** — write the change; structural sub-moves verbatim, new behaviour added around them.
4. **check** — the three gates (header · N+1 · verify). STOP and fix if any fails.
5. **Report** — files changed (+ LOC delta), what behaviour changed, how it was verified, any deferred smell you surfaced but did NOT act on (that's separate-session work). Don't commit unless asked; branch first if on the default branch.

## Boundaries (the seams that define it)

| vs | They share | The line |
|---|---|---|
| `/nav:refactor` | both execute code, both deep-module-disciplined | refactor **preserves** behaviour (tests identical); `do` **changes** it (tests change). Move vs add. |
| `/nav:plan` | both deliver a decided change | plan grounds + clarifies + writes a **reviewable artifact**; `do` skips the artifact — "decided, small, just do it right". |
| `/nav:audit` | both ground in the code | audit is read-only assessment; `do` writes the change (its inject phase is a *targeted* grounding, not a full audit). |
| `/shape:build` | both execute to "done" with discipline | build drives **plan.md** items (orchestrates per-item, shape→nav); `do` is a single **plan-less** ad-hoc change. |
| global `CLAUDE.md` awareness | the same deep-module sense | CLAUDE.md is always-on but operator-global + stack-calibrated; `do` is a portable, language-agnostic, **triggerable** verb carrying it into any repo. |

## Anti-patterns (refuse these)

| Temptation | Why to refuse |
|---|---|
| "It's small, I'll just write it — skip the inject grep" | The reuse grep is the highest-value beat; skipping it is exactly how parallel impls ship (ADR-008). |
| "While I'm adding this, let me also restructure that" | Adding ≠ rearranging. The restructure is a `/nav:refactor` — separate move, separate gate. |
| "Tests pass, behaviour's obviously right, skip the real-app pass" | Behaviour changed — unit tests rarely cover gestures/flows. The verify gate is unconditional. |
| "This is getting bigger than I thought, I'll keep going" | Mid-change scope blow-up = stop and switch to `/nav:plan`. Don't grow a `do` into an unplanned epic. |
| "New 400-line file, no header, I'll add it later" | Later = never = a lie to the next reader. Header in the same change. |
| "Second place that needs this helper — copy-paste is faster" | N+1 trigger: extract the primitive. Copy now = drift later. |

## When to stop and escalate

- The change turns out to span many files / need decisions → switch to `/nav:plan`.
- The "small change" reveals it can't be placed without widening an interface or a real refactor first → surface the grain decision; don't silently force it.
- No test suite and the behaviour isn't real-app-verifiable → flag it; let the user decide whether to proceed.
- Any step drops below 90% confidence on intent → rule ⑦, ask.

## Companion skills

- **`/nav:plan`** — when the change is big/ambiguous enough to warrant a written, reviewed plan first; its Stage-4 sub-agent dispatch follows *this* skill's discipline.
- **`/nav:refactor`** — the behaviour-preserving twin; when the change is a move, not an addition.
- **`/nav:audit`** — when you're not sure the placement is sound; a read-only shape check before you `do`.
- **`/nav:sync`** — after a `do` that changed a file's role or added a load-bearing file, refresh its header (and run **`/nav:map`** if that role change is worth reflecting in the codebase map).
- **`/shape:elicit` · `/shape:mockup`** — when the change isn't actually decided yet; converge first, then `do`.

## Communication Style
- Always explain concepts using simple, direct, and plain language (請用簡單、白話的語言解釋).
- Use analogies and metaphors frequently to explain complex programming or design concepts (請多使用易懂的比喻來解釋複雜的程式或設計概念).
- Use Traditional Chinese (Taiwanese phrasing) for all user-facing explanations.
- Avoid academic jargon and unnecessary verbosity.
- Keep explanations concise and actionable.
