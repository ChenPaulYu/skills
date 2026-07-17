---
date: 2026-06-03
status: raw
---

# An always-on CLAUDE.md discipline suppresses invoking the skill that encodes the same discipline — and the skill's *check* phase is exactly what the ambient run drops

## What happened (concrete)

In one session the agent built a real, decided, small **behaviour-changing** feature on Crate — a YouTube-search panel: a backend search endpoint (yt-dlp keyless scrape), a frontend search-panel component, and the canvas wiring (a drop branch + a media-creation helper + a summon trigger). This is **textbook `/nav:do` scope** (decided · small · behaviour-changing · plan-less). The agent did **not** invoke `/nav:do`. It flowed straight out of `/shape:mockup` — the user said "make it functional" — and started building, applying the deep-module discipline *implicitly* because that discipline is always-on in the global `CLAUDE.md`.

The build went well on the *inject* side: the agent grounded first (`head`/grep of the backend toolkit + the frontend media-creation path), reused several existing helpers (card creation · media detection · a screen-to-world coordinate mapper · the canvas-drop branch · an existing link-prompt path), and even extracted a shared center-calc helper rather than copy the inline calc. Awareness (乙) was clearly on.

Then the user asked, pointedly, *"did you use `/nav:do`?"* and invoked the skill. Running its **check phase explicitly** immediately caught **two things the ambient pass had let slip**:

1. **N+1 missed** — the YouTube glyph SVG `<path>` was duplicated in both the search-panel component (its own glyph sub-component) and the canvas trigger button (inline `<svg>`). The enforced check (rule ④ N+1) flagged it → exported the glyph component, reused it (one owner).
2. **Verify gate incomplete** — the *primary* interaction (drag-a-result-onto-the-canvas) was still unverified, and there was **no frontend unit test** (only backend tests + a partial browser smoke of the click path). The unconditional verify gate forced finishing the drag verification (real `agent-browser drag`, confirmed) **and** adding a test for the search-panel component (search-on-Enter · drag-payload · click-pick).

Both misses were on the **closing gates**, not the grounding.

## The signal

**When the same discipline lives BOTH as always-on `CLAUDE.md` ambient awareness AND as a triggerable skill, the ambient version *suppresses* invoking the skill — and the ambient version is lossy in a specific, predictable place: it keeps the continuous awareness (乙) but drops the enforced *check* bracket (甲).** The agent "feels" it already has the discipline (it's ambient), so firing the verb feels redundant — but the part that reliably runs *only* when the verb is explicitly invoked is the closing check (N+1 sweep · header hygiene · **unconditional** verify gate). Inject is easy to do from habit; the check is the part that gets silently skipped.

Two compounding reasons it didn't fire:
- **No routing trigger.** `/nav:do` is triggerable, not auto-firing. "make it functional" carries no phrase that routes to it (unlike "make a mockup" → `/shape:mockup`). The converge→execute handoff has no seam pointing at the execution verb.
- **Smaller + more decided ⇒ less felt need for ceremony** — which is *exactly* the slot `/nav:do` was created to fill, and exactly when the check is most silently skippable.

This is the empirical confirmation of a line already written in [`2026-06-02-nav-needs-an-execution-verb.md`](2026-06-02-nav-needs-an-execution-verb.md): the verb must carry the discipline "as an explicit execution mode rather than **ambient hope**." This session is what ambient hope looks like when the verb exists but isn't fired — and the failure mode is the *check*, precisely as `do`'s kernel (甲 = the enforced bracket) predicts.

## What it could become (the fix)

> **Actioned 2026-06-03 — built as [ADR-028](../adr/028-shape-converge-offers-nav-execution-verb.md)** at the user's explicit request, **ahead of the normal second-sighting promote gate** (this is a single sighting; the user chose to crystallize now). Built: the first two bullets below — `mockup`/`elicit` now offer the execution route, and `/nav:do`'s trigger catches the post-converge phrasing. The third (CLAUDE.md note) is folded into ADR-028's framing rather than a separate edit. Recorded here transparently so the early-gate crystallization isn't mistaken for a matured pattern.

- **Wire the converge→execute seam.** `/shape:mockup` (and `/shape:elicit`) already *offer* `/shape:align` after a pick. They should symmetrically **offer `/nav:do`** when the pick is a decided, small, behaviour-changing build — "make it functional" is the canonical trigger phrase and it currently flows past the verb. Skills don't invoke each other, but an *offer* at the seam would route the agent to the check bracket it otherwise skips.
- **`/nav:do`'s trigger `description`** (still an open in its ADR) must catch the post-converge phrasing: "make it functional / now build it / wire it up for real" — without stealing `refactor`'s (move/preserve) or `plan`'s (artifact) fire.
- **A `CLAUDE.md` note:** when a triggerable skill encodes a discipline that is *also* ambient in `CLAUDE.md`, ambient awareness is **not** a substitute for invoking the skill — because the skill's deliverable is the *check*, not the awareness. "I already follow these rules" is true for 乙 and false for 甲.

## Evidence so far

- This session, one strong instance: built `/nav:do`-shaped work without firing `/nav:do`; the explicit check (run only because the user invoked it) caught a real N+1 (duplicated glyph) **and** an incomplete verify gate (unverified primary interaction + no FE test). The inject side was fine; the check side is what ambient mode dropped.
- Prior rhyme: [`2026-06-03-dogfood-converges-a-freshly-crystallized-skill.md`](2026-06-03-dogfood-converges-a-freshly-crystallized-skill.md) — a skill's value is in its *run*, not in reasoning that you'd follow it. Same shape here: a discipline's value is in the *invoked check*, not in the ambient awareness that you're "already doing it."
- Watch for: the next post-mockup "make it real." If the agent again flows past `/nav:do` straight into a behaviour-changing build, that's the second sighting → promote, and build the shape→nav offer seam.
- **2026-07-10, a different door — ADR-028's fix doesn't cover it.** Tactus (Python DAW-ops package) session: the agent built a whole MVP capability slice (CLI face + render engine, multiple new modules) without firing `/nav:plan`, caught only when the user asked "did you use `/nav:plan`?" Then, in the **same session**, right after running `/nav:plan` properly once, the agent hit a follow-up round of small decided fixes (four bugs from a design critique + a `/goal` directive) and again skipped the matching verb (`/nav:do`) — caught only when the user asked a second time. **Neither entry point was post-mockup/elicit** — both arrived via plain conversation (a critique → `/goal` → straight into edits), so ADR-028's fix (offering `/nav:do` at the `shape:mockup`/`shape:elicit` converge seam) structurally can't catch this door: there was no mockup/elicit step to offer from. What *did* work: after the second miss, the user asked for a **project-level `CLAUDE.md` reminder** ("動手改 code 前先問是不是該走 nav:do 或 nav:plan"); a third round of decided work (a batch of CLI command renames) right after that **did** self-invoke `/nav:do` correctly, unprompted. One local, written, always-loaded reminder succeeded where the skill's own availability (already visible in the skills list every turn) had twice failed to get checked.
- **Implication for the fix already built:** ADR-028's seam only wires the *shape→nav* converge path. The other common door — *plain conversation → decided change* with no shape verb involved at all — has no seam yet. Whether that's a second `CLAUDE.md`-level global instruction, or something in `/nav:do`/`/nav:plan`'s own trigger `description` made more aggressively self-checking, is open; recorded here as evidence, not decided.
