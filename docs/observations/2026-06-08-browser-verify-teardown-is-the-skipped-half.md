---
date: 2026-06-08
status: raw
---

# Browser-verify has a teardown half that gets silently skipped — and writing the rule down doesn't make it fire (knowledge ≠ trigger)

## What prompted it

A single Crate session with **three** separate UI changes, each correctly browser-verified per the project's "agent-browser smoke" rule (discovery prompt output, a rail-icon swap, a note-typing-lag fix). Each verify did `agent-browser open` → drive → screenshot, and each was a clean, valuable verification that confirmed the fix. But I never *closed* the browser between them, and `open` on an already-live session, plus a couple of daemon resets, left Chrome-for-Testing helpers accumulating. By the third fix the machine had **12 Chrome-for-Testing processes, one pinned at 90% CPU**. I only noticed when the **user said "我的電腦變好慢"** — then `agent-browser close` dropped it to 0 instantly and the machine recovered.

The verifications were all correct. What failed was the *teardown* — and it failed silently for the whole session. The interesting part is what came out when the user first-principles-grilled *why*: the teardown rule **was already written** (trap #3 of `plugins/shape/references/browser-verify-gotchas.md` says "Close the browser at the end of every verify pass"), yet it still didn't fire. So the real question isn't "should we write it down" — it's "why does a written rule not trigger."

## Layer 1 — why it's *invisible* (the externality)

The verify step's success criteria are all **forward-facing and visible to me**: typecheck green, lint green, screenshot matches intent. "And the machine is no heavier than when I started" is **not** in that list.

- Every `open` advances a visible goal → I always do it.
- The matching `close` advances *nothing I can see* → I never do it.
- The cost (CPU, fan, lag) accrues on the **user's machine**, invisible from inside the tool loop. A pure externality: I get the benefit (verification), the user pays the rent (a wedged laptop), and nothing in my feedback loop couples the two.

Same shape as the sibling observation's gotcha #4 (`2026-06-01-browser-verify-audio-canvas-app-gotchas.md`, "the daemon wedges, `pkill` + reopen is the reset") — but that's about *recovering a stuck session mid-verify*. This is the complement: **resource accumulation where nothing is visibly broken**, so there's no in-loop trigger to clean up. A wedged daemon announces itself (screenshots stop landing); a pile of idle-but-hot Chrome instances does not — until a human feels it.

## Layer 2 — why *writing it down doesn't fix it* (knowledge ≠ trigger)

This is the atom, and it's the part I'd have missed without the grilling. "Written" and "triggered" run on **different substrates**, so the first does not imply the second:

- **Knowledge is *polled*.** A rule in a doc sits there inert. You consult it only when something *makes* you. It changes what you *know*, not what *cues* you.
- **Behaviour fires from a *cue* at the deciding moment** — an interrupt that surfaces on its own. The deciding moment for close is "the verify pass ended" — but **the end of a pass is not an event that announces itself.** Screenshot taken → my attention jumps straight to the next thing (commit, next fix, report). Nothing in the environment says "now close," so nothing pulls the rule out of the doc.

Why teardown *specifically* has no cue — open and close are structurally asymmetric:

| | cue that fires it | immediate reward to the actor | cost now |
|---|---|---|---|
| **open** | **yes** — I need to *see* the thing; the need forces it | yes (I see it) | yes |
| **close** | **none** — pass-end is silent | none (benefit is the user's, and *deferred*) | yes (an extra step) |

open is *pulled by a need*; close is pulled by nothing inside my loop. **And writing the rule into a doc changes none of those three columns** — it adds "I know," it doesn't add a cue, doesn't add a reward, doesn't remove the cost. So the rule can be perfectly known and still never fire. Gating is on cue-at-the-moment, not on knowledge.

## Where a close actually fires — the cue ladder

Rank the candidate homes for "close" by how *independent* the firing is from "did I happen to walk/load it":

1. **A reference doc** (lazy-loaded `references/…`) — weakest. Ad-hoc verify never loads it → never fires. *(This is exactly where the rule already lived, and exactly why it didn't fire this session: I was doing ad-hoc `agent-browser` driven by the project CLAUDE.md, not running any shape skill, so the gotchas file was never in context.)*
2. **An always-loaded project rule, written as a walked sequence ending in `close`** — fires when I walk the smoke procedure, because the last step I read *is* close. This is the rung that catches the ad-hoc path that actually failed.
3. **A skill's verify step ending in `close`** — fires when that skill is walked (nav:do / refactor / build / map, via the shared slot). Catches the skill-mediated path. **A walked protocol step is a weak cue; a rule in a reference is not — the difference is whether the agent is actively reading it at the deciding moment.**
4. **A harness turn/session-end reaper** — strongest: independent of walking or loading anything; the boundary itself is the cue.

The ladder's lesson: moving "close" into more/better docs (rungs 1–3) raises the odds it's *in context*, but **a doc is still polled** — it only fires if the executing path walks it. Only rung 4 converts poll → genuine cue.

## Why there's no single choke point to bind it (the architectural atom)

The cleanest fix would be RAII / `defer` / try-finally: make `open` itself schedule the `close`, so no memory is needed. That requires a **wrapper around open** to attach the `finally` to. The browser-verify slot's design explicitly forbids one: *"skills don't call skills; name the capability, the agent shells out the tool directly."* Every agent `agent-browser open`s on its own — there is **no shared verify wrapper**, by design (bought flexibility). No wrapper → nowhere to bind the bracket. The only choke point left is the **turn/session boundary** (the harness), which is why the structural fix degrades into an environmental one (rung 4).

## The reaper sub-lesson — provenance, not a heuristic; notifier, not killer

We considered rung 4 (a turn-end hook that kills stray browsers) and *rejected the obvious form*:

- **Don't key the kill on a heuristic (e.g. CPU > 50%).** CPU% is a noisy proxy — a browser the user is *actively* using can spike past the threshold and get killed. The robust discriminator is **provenance**: agent-browser spawns a separate binary (`Google Chrome for Testing`, not the user's `Google Chrome`) under a recognizable `--user-data-dir=…/agent-browser-chrome-<uuid>`. Filter on *that* and you can never touch the user's own browser — fact-based, not "hope it's idle."
- **Prefer a notifier over a killer.** The root problem is that the leak is *invisible*. A turn-end hook that merely **detects and warns** ("N stale verify browsers — run `agent-browser close`") *creates the missing cue* with zero collateral risk; the destructive act stays deliberate. Making the invisible visible IS the fix; auto-killing is a separate, riskier choice.

(We ultimately added *no* hook — the cost/risk wasn't worth it for one project — and leaned on rungs 2–3.)

## What we actually did — and why it's necessary-but-insufficient

Landed: `close` folded into the browser-verify slot contract (`plugins/shape/CLAUDE.md`, regenerated into AGENTS.md) as `open → screenshot → compare → close`, plus trap #3 promoted from a buried reference into the slot's "Known traps" surface; and Crate's CLAUDE.md "agent-browser smoke" rule rewritten as a **walked sequence ending in `agent-browser close`** (rung 2 — the one that catches the path that actually failed).

The honest caveat, recorded so the next session doesn't over-trust it: **this is "write the rule better," which is rungs 1–3 — it raises in-context odds but does not convert poll → cue.** An agent doing ad-hoc verify still won't fire it unless the *walked* surface (rung 2/3) carries close as a literal step. The doc is necessary, not sufficient. The only path-independent fix is rung 4 (a harness reaper), which we chose not to build.

## Evidence / status

One session — but unusually well-tested for one: the skip recurred on **all three** verifies (not a slip), and the *explanation* was hammered through several rounds of first-principles pushback (it survived "isn't it just an externality?" → no, the deeper atom is poll-vs-cue; survived "put it in nav:do?" → no, that's one consumer on one path; survived "add a kill hook?" → only provenance-filtered, and a notifier beats a killer). Grounded (12 procs / 90% CPU / user-reported; concrete code paths), friction-tested (the volley above), principle-level (knowledge ≠ trigger; the cue ladder generalizes to any spawn/teardown — dev servers, sandboxes, background jobs). Kept `raw` only because the *cross-context* recurrence isn't logged yet — watch for the same poll-vs-cue gap wherever a written cleanup rule fails to fire.
