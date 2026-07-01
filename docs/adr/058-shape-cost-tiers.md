# ADR 058 — shape gains cost tiers: a `browser-verifier` subagent + cheap-model mechanical verbs

**Status**: accepted — implemented 2026-07-02 (shape `0.7.0`)
**Refines**: [ADR-011](docs/adr/011-shape-build-and-browser-verify-slot.md) (the browser-verify slot this tier plugs into) · [ADR-040](docs/adr/040-parallel-build-scheduling-policy.md) (same muscle/brain split, applied to model choice)

## Context

Running the shape family burned tokens in two ways that had nothing to do with judgment quality:

1. **Screenshots in the main context.** The browser-verify slot (mockup render-confirm, align board-check, build's per-item screenshot-vs-mockup, dogfood's session captures) was driven inline by the main agent. Every screenshot enters the conversation as image tokens (thousands per shot) and is then **re-paid on every subsequent turn** for the rest of the session — the dominant, invisible cost. dogfood additionally defaulted to per-step screenshots *and* video.
2. **Frontier-model mechanical sweeps.** Verbs whose work is mostly mechanical comparison — `reconcile`'s "walk the tree, compare each doc to code/headers/dates" — ran on the session model even though a smaller model does the sweep equally well.

The user's requirement: verify only when it *decides* something, and run the mechanical parts on a cheaper model (Sonnet) — portably, so another machine that installs the plugin gets the same behaviour with zero local setup.

## Decision

Introduce a **cost tier** with three parts, all owned by the shape plugin so they ship with it:

1. **`agents/browser-verifier.md`** — a plugin-bundled subagent (`model: sonnet`; tools: Bash, Read, Glob) that is the slot's default *executor*. The caller injects URL · screenshot destination · expectation (mockup path or stated behaviour) · optional interaction steps / tool override; it drives, captures to disk, compares, **closes the browser**, and returns a compact verdict (`PASS | DRIFT | BLOCKED | MISSING-TOOL` + reason + paths). Image tokens live and die in the subagent's context. Inline driving remains only for live user walkthroughs.
2. **Verify economy** — a slot-level policy: a capture is *evidence at a decision point*, never a progress note. `build` screenshots once per item at land (test gate mid-item); `dogfood` screenshots at friction/gap moments only, video **opt-in by explicit request** (was: every step + default video); `mockup` confirms a render once; `align` checks the board with no screenshot. Captures are referenced by path, never pasted into chat.
3. **`model: sonnet` frontmatter on mechanical verbs** — SKILL.md's `model` field is a turn-level override (session model resumes on the next prompt), so a sweep-shaped verb can declare its own tier portably. Applied to `reconcile` now; the criterion (mechanical sweep vs open-ended judgment) is recorded in `plugins/shape/CLAUDE.md`. Judgment-heavy verbs (`elicit`, `position`, `build`'s adjudication) stay on the session model.

This is ADR-040's *muscle/brain* split applied to model choice: capture-and-compare is muscle (cheap, delegated); adjudication — DRIFT means what, amend vs prune, ship vs halt — is brain (session model, main loop).

## Consequences

- **Portability** — the subagent definition and the frontmatter overrides live inside `plugins/shape/`, so any machine that installs the plugin gets the tiers. The only per-machine remainder is the `agent-browser` CLI itself (already covered by the slot's fail-helpfully install prompt).
- **Registration** — slot definition + conventions updated in `plugins/shape/CLAUDE.md`; restated in `build`/`mockup`/`align`/`dogfood` SKILL.md (self-contained rule); `reconcile` gains the frontmatter + an in-body note. shape `0.6.0 → 0.7.0`; manifests + codex regenerated; validator green.
- **Behaviour change in dogfood** — per-step screenshots and default video are gone; a session's evidence floor is now friction-point stills + saved responses. If a full recording proves routinely wanted, flipping the default back is a one-line amendment here.
- **Verdicts are claims** — a sonnet subagent's `PASS` is accepted like any sub-agent "done": build's check bracket still reads the evidence paths when the stakes warrant it (inject↔check is unchanged).

## Out of scope

- Other plugins' mechanical verbs (`relay:format`, `/nav:sync`'s grounding pass) are natural candidates for the same frontmatter tier but are separate decisions in their own plugins.
- No change to the slot's contract (detect · fail-helpfully · per-project override · close) — the tier changes *who executes* and *how often it captures*, not what the capability is.
