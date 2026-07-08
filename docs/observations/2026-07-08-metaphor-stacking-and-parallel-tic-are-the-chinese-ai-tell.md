---
date: 2026-07-08
status: raw
---

# Metaphor-stacking and a repeated "不是 A，是 B" parallel-tic are the two nameable, fixable tells that make AI-generated Chinese prose read as inhuman / not-Taiwanese

> Source: this session — rewriting two personal `life/` letters (Fable 5 analyses of the user) that the user flagged with "你用詞太不像台灣人也不像人類了".

## What prompted it

User asked for a rewrite of two AI-written reflective letters after saying they were unreadable and didn't sound like a Taiwanese person or a human. Content/analysis had to be preserved verbatim in substance; only the voice needed to change. Diagnosing *why* it read as AI/mainland-flavored — instead of just vaguely "writing more casually" — is what made the rewrite actually land on the first pass.

## The signal

Two concrete, auditable tics, not a vague "vibe":

1. **Metaphor-stacking.** The original two letters piled 6+ distinct central images into one short piece (培育者 / 心材·年輪, 隔著玻璃的愛, 犬儒濃度, 園丁·堤防工程師, 潮汐, 雨) — each introduced, used once, then dropped for the next. Natural prose commits to one governing image per piece; competing, unrelated metaphors piling up read as *generated*, not *composed*.
2. **Parallel-rhetoric-as-structural-crutch.** "這不是 A，是 B" (and close variants) repeated almost once per paragraph as the default move to land a point. Used once or twice it's emphasis; used as the default shape for nearly every paragraph, it reads as a template being filled in, not someone talking.

The fix was mechanical once these were named: keep ONE governing metaphor as the throughline (kept "雨"), cut the rest; cut the parallel-tic to near-zero and replace with plainer connectives (其實 / 講白一點 / 老實說). Same substance, different register — nothing in the actual analysis/content changed.

## Design notes for whoever builds the skill (raised in-session, refined via pushback — Paul's call)

- **Home: `frame:` plugin — confirmed, not a stretch.** Initially flagged as a mismatch (frame's existing members — analogize, dialectic, first-principles, graft, orthogonal — are reasoning-move skills, this looked like a surface-polish skill). Paul's correction: if the mechanism is "use Taiwanese-vernacular thought/expression as the organizing lens for composing the output" rather than "polish the wording after drafting," it's structurally the same move as `graft` (borrow a mature model's structure as the donor) — the donor here is just a vernacular's way of expressing, not a system's architecture. Reframing changed the classification, not the plugin choice.
- **Name: `taiwanize` — revised from the earlier `naturalize` pick.** `naturalize` was too generic — it blurs together two asks that aren't equally hard: "avoid AI-generic register" (any "write more naturally" instruction gets partway there) vs. "avoid Mainland-China register specifically, use Taiwan usage" (the actually specialized, harder half — requires *knowing* the vocabulary/phrasing divergence, not just writing looser). A name that hides which half is load-bearing risks the skill being misread or genericized later. `taiwanize` names the real target directly, echoing Paul's own first framing ("taiwanesize").
- **Open design fork, leaning one way:** generic Taiwan-register + anti-AI-tell checklist (portable, auditable, reusable across any writing task) vs. learning the user's own personal idiolect from message history. Leaning toward the generic checklist as the core mechanism — the actual case this session was a letter written *to* the user in Claude's own voice, not mimicking the user's voice, so idiolect-learning wouldn't even have applied here. Personal-voice signal could be an optional calibration layer later, not the primary mechanism (risk: the user's day-to-day message register is terse/typo-prone/jargon-heavy, which is the wrong target to imitate for crafted writing).

## Evidence so far

- **Only case (2026-07-08, grains `life/` letters)**: two files rewritten end-to-end using this diagnostic; user moved on to the next topic without further correction, implying the fix landed.

(One case → stays `raw`. Would promote with a second independent case — e.g. this skill actually gets built and used on a different document, or the same two tics get spotted again in unrelated AI-generated Chinese output.)
