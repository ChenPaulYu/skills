---
date: 2026-06-30
status: raw
---

# shape:mockup of an interactive text-INPUT with inline highlighting may use token layout (padding) that the real controlled `<input>` can't reproduce — the caret/advance constraint surfaces only in the real input

> Source: 2026-06-30, mocking a command bar via /shape:mockup where a typed `/verb` highlights inline as a "pill"; the mockup's pill used padding and looked great, but the real implementation couldn't keep it.

## What prompted it

The mockup was an interactive input you could type in: a leading `/verb` token rendered as a caramel pill with `padding: 0 4px` + background. It looked right, the user picked it. But implementing it in a real React `<input>` required the "transparent input over a colored overlay" trick (a bare `<input>` can't color one substring). For the caret to sit under the right letter, the overlay text and the input text must have **identical per-character advance** — so the pill had to become **background-only, no padding** (padding shifts the overlay text and detaches the caret from the visible glyphs). The mockup's token layout simply didn't survive the real input.

## The signal

**`shape:mockup`'s "the mockup settles the look, not the real-engine behaviour" caveat is *especially* sharp when the mockup is itself a text input with inline rendering — because a disposable HTML input has freedoms (arbitrary token padding/margins) that a real controlled `<input>` with a live caret does not.** The mockup can place a "pocket" anywhere; the real moving garment has a caret-alignment seam the paper never showed. So an input-with-inline-highlight mockup can converge a layout that's literally unbuildable as drawn.

The skill-feedback bind (S · P · D):
- **S** = `shape:mockup`
- **P** = the grounded-replica / handfeel section (where it says build the decision-critical interaction and verify it really runs)
- **D** = when the mocked artifact is a **text input with inline highlighting** (syntax/token coloring inside the field), flag that its token layout (padding/margins on a highlighted span) may not survive the real controlled input's **caret/advance constraint** — converge the *look* on the mockup but verify the *typing/caret behaviour* in the real input, not the disposable one. (Concretely: inline highlight in a real `<input>` is background-only over a transparent input, or contenteditable.)

Why it matters (and why it's still worth a line despite overlap): `nav:plan` already carries the general "a mockup approves the look, not the behaviour — plan a real-system smoke" caveat. This is the input-with-inline-highlight *instance* of it, surfaced at mockup time rather than plan time — the moment you're tempted to add the padding is inside the mockup, so a one-line warning there is closer to the failure point.

## Evidence so far

- **Only case (2026-06-30, freeform command-bar mockup → real `<input>`)**: mockup pill had padding; real input forced background-only highlight to keep the caret aligned with the transparent-input-over-overlay rendering.

(One case → stays `raw`. Promote if a second interactive-input mockup (a code field, a tag input, an @-mention field) converges a token layout the real input rejects — that's the trip-wire to add the input-mockup caveat to the grounded-replica section.)

## Links

- Feeds `plugins/shape/skills/mockup/SKILL.md` → grounded-replica discipline / the handfeel paragraph.
- Narrower instance of `plugins/nav/skills/plan/SKILL.md`'s "a mockup settles the look, not the behaviour" caveat — overlaps it; keep only if the input-specific framing earns its own line.
- **Applied 2026-06-30** (maintainer ran observe → skill change directly): added a "mocked text-input with inline highlighting" caveat bullet to the grounded-replica discipline in `mockup/SKILL.md`. Stays `raw` as the single grounding case.
