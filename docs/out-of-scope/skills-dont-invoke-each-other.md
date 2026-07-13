# Rejected: skills literally invoking each other (auto-call / skill-calls-skill)

**Rejected proposal**: letting one skill directly invoke another skill as a function call (skill-calls-skill), including a literal auto-trigger of a downstream skill after an upstream one lands its output — rather than the skill only *referencing* the sibling protocol by name, or *offering* it via `AskUserQuestion`.

**Reason**: two stated invariants block it. (1) The marketplace-wide convention — skills reference sibling protocols by name and never re-implement or call them; even the meta-skills orchestrate via reuse-via-transcript, not a direct call. (2) Auto-running a downstream skill silently would remove the user's supervision at exactly the point a decision gets made — the opposite of what the offer-next-action pattern exists to guarantee.

**Source**:
- `plugins/nav/CLAUDE.md:36` — "**Skills don't invoke each other**. The meta-skill (`plan`) describes a sequence for the agent to follow — it references sibling protocols rather than re-implementing them."
- `plugins/shape/CLAUDE.md:63` — "**Skills don't invoke each other**: they reference sibling protocols by name (e.g. reconcile → \"run `/shape:align`\"), never re-implement or call them."
- `docs/adr/015-converge-verbs-offer-align.md` — considered a literal auto-trigger of `/shape:align` after `elicit`/`mockup` land a thought, and rejected it: "Two walls make a literal auto-trigger wrong: 1. **Skills don't invoke each other** (marketplace + shape invariant) — even `build`, the meta-skill, orchestrates via reuse-via-transcript, never a direct call. 2. **`align` decides *with* the user** — auto-running it would author priorities silently, the exact thing align's own discipline forbids." Decision landed as an *offer* instead (guarded `AskUserQuestion`, one-shot, save-only opt-out).

**Date**: rule stated at latest in `docs/adr/015-converge-verbs-offer-align.md` (2026-05-29); reaffirmed as a standing marketplace + shape invariant since.
