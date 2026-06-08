---
date: 2026-06-08
status: raw
---

# Deep-module is layer-agnostic (decisions + owners), but skills only enforce it where the tools can *see* structure — so value-leakage in CSS (and prompts, config) escapes, accretes below per-change radar, and must be caught at the aggregate (audit), not per-change

## What prompted it

A long build session on Crate. I'd been shipping features (discovery chat, media-card resize, hover polish) and, per the rules, *matching the existing style* — which meant writing `bg-[#b5894e]` raw hex, like the ~11 files already did. The user then asked: *"你在寫 css 的時候也有遵循 deep module 的規則嗎?"* Grounding the answer surfaced the leak: the caramel accent `#b5894e` lived as raw hex **27 times**, the full palette as **~50 distinct hexes across ~20 files**, while exactly **one** design value — `--ease-glide` (a motion curve) — was tokenized, its own comment explaining "single owner instead of copy-pasted." We then spent the rest of the session tokenizing color (Slice 0 → Groups ①②③ + a JS-var dedup). The question that lingered: *the nav skills exist specifically to catch information leakage — why did this one walk right past them?*

## The signal

Skills encode deep-module discipline, yet **CSS value-leakage is structurally invisible to them**, for five compounding reasons:

1. **The leakage check targets repeated *knowledge*, not repeated *value*.** nav:audit's mechanical checks are LOC, function size, import counts, barrels, and "same design decision (a format / schema / protocol) in ≥2 modules." A color literal repeated 27× doesn't *look like* the canonical leak (a re-implemented `fillPath`, a format known in two places). There is no check for "is this literal duplicated?" — so a value leak slips the net that's tuned for shape leaks.

2. **The audit scans the code-module graph; CSS/className is treated as decoration, not as a design-decision graph with owners.** Every nav heuristic — describe-the-file, the LOC thresholds, "deep module" itself — is about *TS modules*. A `bg-[#b5894e]` is "just a class," never audited as "a design decision that should have one owner." The design-token layer (colors, spacing, motion) is a real module graph subject to rule ①, but it lives in a layer the skills never treat *as* modules.

3. **The framework's idiom makes inlining the value the path of least resistance — and "fit the framework" endorses it.** Utility-first CSS (Tailwind) is anti-abstraction *by design*: `bg-[#hex]` puts the value exactly where it's used. So leakage is the *idiomatic* move; rule ⑤ ("fit the framework") would even bless the inline arbitrary value. The deep-module principle (one owner) and the framework grain (inline it) **conflict in CSS, and nothing in the skills resolves the conflict** — so the default wins.

4. **"Match existing style / surgical changes" actively suppresses flagging it in the moment.** The right per-change behavior is to match neighbors and not unilaterally introduce a token system — so I wrote raw hex, correctly per *that* rule. But matching a *leaked* pattern propagates the leak. The discipline optimizes "don't make it worse this change" over "don't let leakage compound," and the second cost is invisible at single-change scale.

5. **Skills fire at decision points; value-leakage accretes *below* decision granularity.** Each individual `bg-[#b5894e]` is a one-line, locally-correct choice — no single change trips an alarm. The leak is *emergent* across 27 edits by different hands over time, none of them wrong. A per-change (or per-PR) gate cannot see a smell that exists only in aggregate. It is the boiling-frog of architecture: no single commit is auditable as the culprit.

**The through-line:** skills catch leakage that is *shape* (a structure duplicated), *in code* (the module graph), *at a decision point* (one reviewable change). Color leakage is *value*, in the *CSS/token layer*, accreted *below* any single decision — three misses at once, which is why it sailed through and only surfaced when a human asked the meta-question.

## The deeper root (it isn't about CSS)

CSS is the *most visible* victim, not the cause. The cause is one level up: **rigor follows the tooling's analytical reach.** The type-checker, module graph, and lints operate on code; anything they can't see as a *structured reference* — a className string, a config value, a prompt's text — is inert text, and inert text escapes every discipline (ownership, deep-module, review). Tailwind's inline arbitrary value (`bg-[#hex]`) is just the extreme case: a design decision wearing the costume of an opaque string. The same fate falls on magic numbers, repeated string literals, API paths, env values, SQL. **Whatever the tools treat as text, the skills treat as not-code, and not-code leaks.**

## Where it landed: deep-module is layer-agnostic; enforcement is per-layer

The principle is **decisions + their owners + a narrow interface hiding the complexity** — and that is layer-agnostic. "Code" is merely the layer our tools happen to see. *Proven twice in this one session:* the discovery **prompt** got the deep-module treatment (`HEAD / GROUNDING / TAIL` + `build_system_prompt` — one owner per concern, the swappable clause behind a narrow interface), and **CSS** got it (one token per color). Two non-code layers, same move, both improved.

But the universal *principle* needs **per-layer *enforcement***: each decision-bearing layer needs its own mechanism to become tool-visible — TS (types + lint), CSS (a token system + a lint ban on raw values), prompts (structured composition / a prompt module). Without that per-layer mechanism, the layer falls back to human judgment — which is exactly how it leaks. So "extend deep-module to all layers" means *build the per-layer mechanism that makes ownership machine-enforceable*, not "remember to apply the principle."

## Where to catch it — by the earliest moment a decision is knowable

You establish the owner at the earliest point the decision is real, and you back it up at the only scale the misses are visible:

- **plan** — establish owners for the *foreseeable* shared decisions (the palette, core constants). Cheapest, but partial: you can't foresee what only becomes a decision on its second use, and over-planning every value is premature abstraction.
- **do (N+1)** — the *emergent* ones: the 2nd re-expression of a value extracts the owner. (Already a code rule; the gap is it doesn't fire on *values* or in *non-code layers*.)
- **audit — the proper home, not a fallback.** Emergent value-leakage exists *only* at aggregate scale, and audit is the *only* aggregate-scale tool — so this detection *belongs* there. Extend nav:audit to (a) flag value-duplication (a literal repeated ≥ N across ≥ 2 files) and (b) scan every decision-bearing layer (CSS arbitrary values, prompt strings, config), not just the TS module graph. Then the existing **audit → refactor** handoff consolidates to one owner; refactor already executes, it just needs audit to *see* the class. Caveat: a backstop only helps if it's *run* — ideally automated (CI); at minimum, *able* to see this class.

The cheap canary for the audit: **asymmetry** — one value tokenized (motion) while its peers (color) leak (this session's sibling finding, [[2026-06-08-the-lone-token-is-the-smell-and-the-template]]). And carve out "match existing style": matching a pattern that is *itself a leak* should at least **flag** it, not silently propagate it.

**The meta-rule under all of it:** prevention re-grades the terrain (make the owner the easy / only path — lint-ban the raw value); detection lives at the aggregate (audit); judgment is reserved for genuinely novel decisions. *Don't defend with judgment what accretes below the moment, or what the tooling's gradient actively creates.* Skills are judgment-amplifiers — this whole class needs mechanism, which is why the skills missed it.

## Evidence so far

One deep instance (Crate): the **prompt** and **CSS** layers both took deep-module cleanly (build_system_prompt; the color tokens), while the CSS color leak (caramel ×27, ~50 hexes / 20 files) stayed invisible through a whole session of compliant per-change work — surfacing only when the human asked the meta-question, with `--ease-glide` the lone tokenized counter-example. The five mechanisms each have a fingerprint in that session. Watch for the same shape in another value layer (a repeated config constant, a magic enum) and another utility-CSS codebase before promoting past "good to know" — but the audit-scope gap and the value-vs-knowledge gap look general enough to act on now.
