---
date: 2026-06-08
status: raw
---

# When a codebase tokenizes one design decision but leaks its siblings as raw values, the lone token is the smell, the template, AND the permission to fix it

## What prompted it

A long build session on Crate (music-canvas app). The user asked, unprompted: *"當你在寫 css 的時候也有遵循 deep module 的規則嗎?"* — do you follow deep-module rules in CSS?

Instead of answering in the abstract, I grounded it. The grep was stark:

- `frontend/src/index.css` has **one** `@theme` token — `--ease-glide` — and its own comment explains the point: *"the curve has a single owner instead of being copy-pasted per component."* Motion is owned.
- The **brand palette is the opposite**: `#b5894e` (caramel) appears as raw hex in `bg-[#b5894e]` across **11 files / 27 times**; the full palette is ~10 colors, ~70 raw occurrences, ~15 files. Color is leaked.

So the honest answer wasn't "yes" or "no" — it was: *the codebase already knows this pattern (motion), it just never extended it to a sibling decision (color).* The fix wrote itself: add `@theme { --color-caramel: … }`, migrate the hex to the generated `bg-caramel` utility. A tracer-bullet slice proved it pixel-identical (`getComputedStyle(sendBtn).backgroundColor === "rgb(181, 137, 78)"`, exactly the old hex).

## The signal

**An abstraction applied to one design-decision but not its siblings of the same kind is a precise, high-value leakage smell — sharper than "this is duplicated," because the codebase has already ruled on the question.** The lone `--ease-glide` token does three jobs at once:

1. **Smell-detector.** The asymmetry *is* the finding. Don't ask "should color be tokenized?" in the abstract — ask "why is the curve owned but the palette isn't?" The inconsistency is the bug; the right state is obvious.
2. **Template.** The fix is not invention — it's copying the shape of the blessed instance (`--ease-glide` → `--color-caramel`; same `@theme`, same dual-use as utility + `var()`).
3. **Permission / political cover.** You're not imposing a new convention the author might reject; you're *completing one they already endorsed and self-documented.* That comment ("single owner instead of copy-pasted") is the author arguing your case for you.

This is rule ① (information leakage) made findable: scan for a design decision that has **exactly one** owned instance and N raw-duplicated siblings. The "exactly one" is the tell — it means someone reached for the right shape once and stopped.

## What it could become

A **nav:audit heuristic** — alongside "same value in ≥2 modules = leakage," add: *"a value/decision owned in one place (a token, a constant, a config) while its **siblings of the same category** stay raw-duplicated — flag the asymmetry and name the lone instance as the fix-template."* It's cheaper to detect than generic duplication (you key off the *one* good instance, then sweep its category) and it comes pre-loaded with the fix shape and the author's own justification.

Pairs with the **tracer-bullet-before-bulk** discipline already in nav:do/plan: prove the migration mechanism on one instance (here: does Tailwind 4's `@theme` color survive the `/opacity` modifier? — yes; does `rgba(brand, a)` inside a `shadow-[…]` survive? — no, needs an RGB-channels token, deferred) before committing to the 15-file sweep. The lone token gives you the template; the tracer proves the *migration rule* per syntactic form.

## Evidence so far

One clean instance (Crate: motion tokenized, color leaked; the `--ease-glide` comment literally pre-argued the fix). Concrete stack-finding banked alongside: Tailwind 4 `@theme { --color-X }` generates `bg-X`/`text-X`/`border-X` + works with `/NN` opacity modifiers and `var(--color-X)`; the exception is `rgba()` inside arbitrary values (shadow/inline), which can't reference a hex token. Watch for a second sighting of the *asymmetry-as-smell* pattern in another stack (a lone enum vs scattered string literals; one `Config` field vs hardcoded constants elsewhere) before promoting past "good to know."
