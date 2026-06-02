# nav's missing execution verb — a disciplined, behaviour-*changing* small change

> **Status**: converged thought (not yet built) — a candidate new `nav` skill. Landed from a `/shape:elicit` grill, 2026-06-02.
> **TL;DR**: nav has no verb that *writes new feature code*. Between `plan` (produces a plan.md artifact — too heavy for a tiny feature) and winging it with no discipline, add a verb that **executes a small behaviour-changing change directly** — deep-module/header **awareness on throughout** + a **thin enforced bracket** (inject → execute → check + test-gate), **no artifact**. The behaviour-*changing* twin of `refactor`.

## The gap

What each nav verb does to code:

| Verb | Touches code? | How |
|---|---|---|
| `audit` | no | read-only assessment |
| `sync` | docs only | writes file headers + the map, not feature code |
| `plan` | no | writes a `plan.md` artifact, not code |
| `refactor` | **yes** | but **behaviour-preserving** — verbatim move + rewire; tests stay identical (rule ⑥) |

→ **Nothing executes a behaviour-*changing* change.** For a feature too small to deserve `plan.md`, today you either run the heavy plan path or drop all nav discipline. This verb fills that empty slot: nav's execution verb.

## Essence (the one line)

**nav's "execution verb", the behaviour-changing twin of `refactor`.** For a change too small to be worth a `plan.md` — just do it; carry deep-module/header/N+1/LOC **awareness continuously (乙)**, plus a **thin enforced bracket (甲)**: `inject` (`head -12` the target file + grep for a reusable existing impl) → `execute` → `check` (new load-bearing file has a header · second consumer triggers N+1 extract · one test-gate). **No artifact.** refactor executes a change that *doesn't* alter behaviour; this executes one that *does*.

## It already exists — as a sub-step, not a door (the key framing)

`do` = **the discipline a sub-agent already (should) carry when `/nav:plan` or `/nav:refactor` dispatches it to execute** (the inject↔check hand-off, [ADR-008](docs/adr/008-inject-check-at-handoff.md)) — but made **standalone, invocable, and plan-less**. Today that discipline only exists *inside* `plan` Stage 4 / `refactor` Step 8's offer-next-action sub-agent option; you can't summon it for a one-off small change without first producing a plan. `do` is that same bracket promoted to its own verb.

**Symmetry requirement (decided):** whatever `do` enforces, the existing post-plan sub-agent dispatch must enforce too — they're the same discipline at two entry points. So building `do` includes auditing ADR-008's wiring for gaps and patching both sides.

**Gap found in the current dispatch:** the inject↔check already covers deep-module reuse / N+1 / seam-intent (inject) + parallel-impl grep / seam-intent / **header hygiene** (check) — so it *is* deep-module-aware and header-aware. But its **test-gate is conditional** — only invoked "if step 1 is structurally a refactor" (verbatim move + test gate). A behaviour-*changing* change needs a **verify/test gate unconditionally** (the new behaviour works). → add an unconditional verify gate to (1) `do`'s kernel and (2) plan/refactor's sub-agent dispatch.

## The boundaries that define it

- **vs `refactor`** — both execute code. refactor *preserves* behaviour (tests stay green identically); this *changes* behaviour (a small feature/fix; tests change). **Behaviour-preserving vs behaviour-changing is the seam.**
- **vs `plan`** — plan grounds + clarifies + writes an artifact you review before executing; this skips the artifact. The premise is "I've already decided, it's small, just do it *right*."
- **vs the global CLAUDE.md "code-shape awareness"** — that's always-on but Paul-global and TS/React-calibrated. This is a **portable, language-agnostic, named + triggerable verb** — it carries the same discipline into any repo/stack, and as an explicit execution mode rather than ambient hope.

## Kernel = both 甲 and 乙 (decided)

- **乙 — awareness, continuous.** Deep-module sense + the header convention + N+1 + LOC thresholds ride along the entire time you write.
- **甲 — enforced thin bracket.** `inject` → `execute` → `check` + a test-gate, with no `plan.md`. The *enforced* skeleton is what separates it from "just code it", and keeping it thin (no artifact) is what stops it bloating back into `plan` — which is the original pain point.

## Open (for the build / ADR)

- **Name** — a short verb in nav's style (`audit`/`refactor`/`sync`/`plan`): candidates `make` · `extend` · `grow` · `ship` (`build` is shape's). Decides the trigger identity.
- **Trigger `description`** — must catch "just add X / quick small feature / do this small thing right" **without stealing `refactor`'s fire (move/preserve) or `plan`'s (artifact)**.
- **The N+1/right-grain defence** — the ADR must justify why this is a *new* verb and not `refactor` widened to additive changes (the exact razor that retired `doctor`, ADR-021).
