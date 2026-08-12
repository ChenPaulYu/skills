# Do protocol — the full machinery around the enforced bracket

> The implementation layer behind `nav-do`'s Stance. The SKILL.md body carries the stance and the
> whole 乙/甲 kernel (inject → execute → check, including the board-sync gate) verbatim — that
> bracket IS the skill. Everything here is loaded on demand: the full rationale, the 8 rules, the
> boundary table against sibling verbs, the anti-pattern table, and the escalation triggers. Moved
> verbatim from the pre-ADR-109 SKILL.md body; the machinery is unchanged, only re-homed.

## Why this skill exists

nav had a gap. Look at what each verb does to code: `audit` is read-only; `sync` writes file headers and `map` writes the codebase map, not feature code; `plan` writes a `plan.md` artifact, not code; `refactor` executes — but **behaviour-preserving** only (verbatim move + rewire, tests stay identical, rule ⑥). **Nothing executed a behaviour-*changing* change.** So for a feature too small to deserve `plan.md`, you were stuck choosing between the heavy plan path and dropping all deep-module discipline. `do` fills that slot.

It is **the same execution discipline a worker already carries when `nav-plan` (Stage 4) or `nav-refactor` (Step 8) dispatches it** — the inject↔check hand-off ([ADR-008](docs/adr/008-inject-check-at-handoff.md)) — but **promoted to a standalone, plan-less verb** you can summon directly. It is not `refactor` widened: refactor moves without changing behaviour; `do` changes behaviour. They are twins across one seam (preserve vs change).

## Scope

**Language-agnostic.** The discipline works on any stack, as long as you can detect it (`package.json` / `pyproject.toml` / `go.mod` / `Cargo.toml` / `Package.swift` / …) and run its verify command.

**In scope**: a small, decided, behaviour-changing change — a new small feature, a fix, an added option, a new endpoint/handler — that you can hold in your head without a written plan.

**Out of scope — route elsewhere:**
- **Behaviour-preserving restructuring** (extract / split / move / decompose) → `nav-refactor` (verbatim move + per-step test gate). `do` adds behaviour; refactor rearranges it.
- **Big or ambiguous enough to need a written, reviewed plan** → `nav-plan` (ground → clarify → artifact). If you find yourself wanting to write the steps down before starting, it's a plan, not a `do`.
- **Undecided what to build** → `shape-elicit` or `shape-mockup` first; `do` executes a decision, it doesn't make one.

**Below 90% confidence on what's wanted → rule ⑦, ask.** "Is this a small change I should just do, or does it need a plan first?" The whole value of `do` is a *decided* small change; if it isn't decided, stop.

## The 8 rules (full set — the discipline relies on them)

1. **Deep modules through information hiding** — a simple interface hiding significant complexity; usable without reading the body. The technique is **information hiding**: encapsulate each design decision (data structures, formats, assumptions) so it never surfaces in the interface. Red flag — **information leakage** (same knowledge in ≥2 modules), often from **temporal decomposition** (boundaries by execution order, not knowledge). **Recursive — composition is the second half:** modules compose behind a package façade into the next-scale deep module (module → package → codebase); a folder earns existence by hiding members or by being the declared contract — anything else is a drawer.
2. **Interface-first at every scale** — an index/facade surfaces the interface; you drill in only as needed.
3. **Explicit dependencies** — functions deterministic; deps explicit, not ambient.
4. **Right grain — neither giant nor fragmented** — *the operative rule here:* place the new code so it deepens an existing module rather than widening its interface or spawning a needless one. The **N+1 trigger** (rule ④ + ②) is its trip-wire — second consumer of an inline util ⇒ extract a primitive, don't copy.
5. **Fit the framework** — idiomatic patterns (React: custom hooks; pass store/hook objects, not 20 loose props).
6. **Rearrange, don't rewrite** — when part of the change is structural, that part follows refactor discipline (verbatim move + gate); `do` adds the *new* behaviour around it.
7. **Below 90% confidence → ask.**
8. **Agent-navigability is the audit** — a new load-bearing file that can't be described in one sentence is a failed abstraction; fix the shape, then add its header.

## Process (the kernel's beats, restated as a checklist)

1. **Confirm it's a `do`, not a plan or a refactor.** One sentence: "Add/change <behaviour> in <module>, keeping the rest identical." If you can't say it in one sentence, or it spans many files, it wants `nav-plan`. If it changes no behaviour, it's `nav-refactor`.
2. **inject** — `head -12` + same-domain reuse grep + placement call (see the SKILL.md body's kernel).
3. **execute** — write the change; structural sub-moves verbatim, new behaviour added around them.
4. **check** — the four gates (header · N+1 · verify · board). STOP and fix if any fails.
5. **Report** — files changed (+ LOC delta), what behaviour changed, how it was verified, any deferred smell you surfaced but did NOT act on (that's separate-session work). Don't commit unless asked; branch first if on the default branch.

## Boundaries (the seams that define it)

| vs | They share | The line |
|---|---|---|
| `nav-refactor` | both execute code, both deep-module-disciplined | refactor **preserves** behaviour (tests identical); `do` **changes** it (tests change). Move vs add. |
| `nav-plan` | both deliver a decided change | plan grounds + clarifies + writes a **reviewable artifact**; `do` skips the artifact — "decided, small, just do it right". |
| `nav-audit` | both ground in the code | audit is read-only assessment; `do` writes the change (its inject phase is a *targeted* grounding, not a full audit). |
| `shape-build` | both execute to "done" with discipline | build drives **plan.md** items (orchestrates per-item, shape→nav); `do` is a single **plan-less** ad-hoc change. |
| global `AGENTS.md` awareness | the same deep-module sense | AGENTS.md is always-on but operator-global + stack-calibrated; `do` is a portable, language-agnostic, **triggerable** verb carrying it into any repo. |

## Anti-patterns (refuse these)

| Temptation | Instead — and the tell |
|---|---|
| "It's small, I'll just write it — skip the inject grep" | Run the reuse grep first — it's the highest-value beat; skipping it is exactly how parallel impls ship (ADR-008). Tell: about to write a function whose name you haven't yet searched for elsewhere in the codebase. |
| "While I'm adding this, let me also restructure that" | Keep adding separate from rearranging — the restructure is its own `nav-refactor` move and gate. Tell: the diff touches files the stated change had no reason to open. |
| "Tests pass, behaviour's obviously right, skip the real-app pass" | Run the verify gate unconditionally — behaviour changed, and unit tests rarely cover gestures/flows. Tell: "tests pass" is the only evidence offered that the change actually works. |
| "This is getting bigger than I thought, I'll keep going" | Stop and switch to `nav-plan` on mid-change scope blow-up — don't grow a `do` into an unplanned epic. Tell: the diff is touching a second domain the original ask never mentioned. |
| "New 400-line file, no header, I'll add it later" | Add the header in the same change — later = never = a lie to the next reader. Tell: a brand-new file has no top-of-file summary and the change is about to be called done. |
| "Second place that needs this helper — copy-paste is faster" | Extract the primitive — this is the N+1 trigger; copy now becomes drift later. Tell: pasting a block that already exists verbatim somewhere else in the codebase. |

## When to stop and escalate

- The change turns out to span many files / need decisions → switch to `nav-plan`.
- The "small change" reveals it can't be placed without widening an interface or a real refactor first → surface the grain decision; don't silently force it.
- No test suite and the behaviour isn't real-app-verifiable → flag it; let the user decide whether to proceed.
- Any step drops below 90% confidence on intent → rule ⑦, ask.
