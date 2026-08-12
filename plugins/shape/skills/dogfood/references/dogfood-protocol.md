# Dogfood — full protocol

Machinery sunk from the SKILL.md body per ADR-109 (three-layer re-homing). The Stance section
in SKILL.md carries the behavior-changing rules (the harness-artifact caveat, the live-LLM-cost
caveat, the render-demoted-to-optional rule, the guarded offer); this file carries the full
session steps, the report shape, the three boundaries, storage format, a worked example, and
the anti-pattern table.

## Why this skill exists

When something you built "feels unsmooth," the friction is real but **pre-verbal** — you can't
name it, so you can't fix it. Reasoning about it from the design doc floats (the same reason
`/shape:mockup` exists: a description decides nothing — and a *memory* of how your own feature
behaves is often wrong). The cheapest way to make the friction nameable is to **use the real
thing and record what happens.** dogfood does exactly that: it drives the feature against what
users are actually trying to do, captures the run, and turns "this feels off" into "watch this
clip — these three spots snag, here's an idea for each, and one of them isn't friction, it's a
path you never built."

## The session — use it for real, capture as you go

This is what dogfood adds. It does **not** synthesize a mockup to walk; it uses the **real
build** and records it.

1. **List the user intents (the test script).** What is someone *trying to achieve*? — "keep a
   private copy", "find it again later", "undo without losing context". Include the intents the
   feature implies but you never designed for; this list is the floor that keeps the session
   bounded.
2. **Drive the real interface to attempt each intent, capturing the evidence.** Frontend → the
   project's browser-verify slot (`agent-browser`): actually click the flow; **screenshot at
   each friction point and dead-end** — the moments that become findings — not every routine
   step, and **record video only when the user explicitly asks for it** (verify economy,
   ADR-058: a capture is evidence, not a progress note; captures go to disk and are referenced
   by path, never pasted into the chat). Backend / CLI → `curl` the endpoint or run the command
   and **save the actual request/response**. **Don't reason from the doc or from memory** — a
   belief about how your own feature behaves is often false; confirm it by doing it.
3. **Mark friction + gaps against the captures.** Friction = the path *exists* but is clunky
   (too many steps, unclear feedback, awkward order, a missing affordance) — tie each to its
   screenshot / clip timestamp. Gap = an intent with *no coherent path* (dead-ends, contradicts,
   nothing to start with).
4. **Classify each gap by layer** — missing intent (direction) vs dead-end scenario (incomplete)
   — so the report shows them distinctly and the hand-off is pre-sorted.

## The report — evidence-rich, with ideas (not a mockup)

The output is a **friction report grounded in the captured session** — *not* a rendered mockup
of holes. Lead with the evidence; for each finding:

- **Friction** → *where it snagged · what it felt like · one concrete improvement idea*, each
  **embedding its screenshot** (and a clip timestamp from the recording where there is one).
- **Coverage gap** → the intent that had no path + its layer tag (direction / incomplete), with
  the screenshot of the dead-end (or the failing response).
- **The session recording** (when one was requested and captured) sits at the top of the report
  so the whole run is watchable end-to-end; by default the evidence is the friction-point stills
  + saved responses.

## After the session — offer to route the findings (don't fix in place, don't auto-run)

dogfood surfaces and reports; it does **not** redesign or implement. Once the report is up,
*offer* — never auto-call — the next step **per each finding's kind**, via `AskUserQuestion`
(offer-next-action, ADR-007/015):

- **A friction idea the user wants to pursue** → a *tweak* → `/nav:plan` (ground it) +
  `/nav:do`/`/nav:refactor`; a *redesign* → `/shape:mockup` (render the new shape) or `/shape:elicit` (if
  the premise is in question).
- **A direction-level gap (missing intent)** → `/shape:elicit` (is the premise wrong? — a *new
  decision*, out of scope) and/or `/shape:mockup`.
- **An incomplete gap (dead-end path)** → `/nav:plan` to ground the missing path, then
  `/nav:do`/`/nav:refactor`.

**Guarded + one-shot:** compose the options from what was actually found, always include a
**"just leave the report, I'll route later"** opt-out, and don't re-offer after the pick.
Offers, not calls — skills don't invoke each other.

## When it fires — and the three boundaries

**Summoned on a "it feels off / try it / show me where it's clunky" request** about a *built*
feature — not auto-fired because a feature got mentioned. Three neighbors to stay clear of:

- **vs `/verify`** — both drive the real app, but the *question* differs: verify asks **"is it
  correct"** (does this change do what it's supposed to); dogfood asks **"is it smooth, and what
  is missing"** (design quality, not correctness). A passing verify can still feel awful to use —
  that gap is dogfood's.
- **vs `/shape:mockup`** — mockup renders a *synthetic candidate* to decide **look / structure**
  *before* building (or for a redesign); dogfood uses the *already-built* thing to critique its
  **experience**. They pair across time: mockup the flow → build it → dogfood the result. "Which
  option looks right" is mockup; "this built thing feels wrong" is dogfood.
- **vs `/shape:elicit`** — elicit drills **one** thing verbally to a principle (residue: one
  line); dogfood uses **many** intents and reports captured friction (residue: an evidence-rich
  report). A coverage walk is not a grill — but the *judgement* of an ambiguous gap (direction vs
  incomplete) hands back to elicit's diagnostic mode.

## Storage & format

Lands in a project-local, **git-ignored** `dogfood/` directory by default — the artifacts are
disposable evidence, not source, and the recording can be large, so on first run **add
`dogfood/` to the project's `.gitignore`** if it isn't already (mirrors mockup's `mockups/`
convention). One **dated topic subfolder** per session: `dogfood/<date>-<feature>/`, holding
the **friction report** (`report.md`), the **session recording** (`session.mp4` / `.webm` where
captured), the **screenshots** (`shots/`), and **saved responses** (`responses/`). (Exact
location is a per-project setting; the default is a git-ignored `dogfood/`.) The report's top
states **what feature was dogfooded · the intents driven · a link to the recording · the
friction found · the coverage gaps (by layer) · what's been routed**, so an agent grasps it
from `head`. Driving the frontend uses shape's shared **browser-verify slot** (named default
`agent-browser`; detect + fail-helpfully + per-project override — defined once in
`plugins/shape/CLAUDE.md`); video capture rides whatever that slot supports, falling back to
screenshots.

## Example — the move (stack-neutral)

A feature lets users **archive** items to declutter. It shipped; it feels off. Dogfood it —
*use it for real, record it*:

- **Intents (the script):** declutter now · find an archived item again later · restore one.
- **Drive the real app + capture what it hit:**
  - *Archive an item* → works, but it's **3 clicks deep behind a kebab menu and gives no undo
    toast** — path exists, clunky → **friction** (screenshot of the buried menu; idea: surface
    archive on hover + a 5s undo toast).
  - *Find an archived item again* → **there's no surface that lists archived items at all** — an
    intent with no path → **coverage gap · direction** (screenshot of the filter bar with no
    "archived" option; the feature was scoped one-way).
  - *Restore into a parent since deleted* → the endpoint `curl` returns a 500 → **coverage gap ·
    incomplete** (the saved 500 response; a path left undefined).
- **Report:** a session clip up top, two friction-or-gap entries each with its shot + the saved
  500 response, the "find again" gap tagged *direction*, the restore gap tagged *incomplete*.
- **Route:** "find again has no entry" → `/shape:elicit` ("is archive meant to be one-way? then
  it's the design, not a hole"); the undo-toast idea → `/nav:plan`; the 500 → `/nav:plan` to
  finish.

The session turns "this feels off" into "watch this — archiving is clunky (here's the fix), and
two things you can't actually do — one's a direction question, one's just unfinished."

## Anti-patterns (refuse these)

| Temptation | Instead — and the tell |
|---|---|
| Reason about how the feature behaves from the doc / memory | Use the real build (browser / `curl`) — a belief about your own system is often false, and that's the whole engine. Tell: describing a flow's behaviour without having just driven it. |
| Report friction without showing it | Capture the screenshot / clip / response — "trust me it's clunky" floats, captured evidence is the deliverable. Tell: a friction claim in the report has no attached evidence. |
| Click around aimlessly | Drive from the intent list — aimless clicking misses the *absent* paths (nothing to stumble on) and only finds shallow friction. Tell: the session has no list of intents it's working through. |
| Enumerate every `state × action` cell | Use human intents instead — they have a floor; a full state×action matrix is a QA exercise that explodes. Tell: the session is generating combinations instead of walking realistic user goals. |
| Make rendering a mockup the mandatory output | Render only when a finding is a genuine redesign worth `/shape:mockup` — the real output is an evidence-rich report + ideas. Tell: about to build a mockup before any friction has actually been found. |
| Only report friction, ignore the gaps that fall out | Report and tag both — a clunky path AND an intent with no path at all. Tell: the report lists friction but has no section for missing coverage. |
| Redesign or implement the fix in place | Surface + route — the redesign is `/shape:elicit`/`/shape:mockup`, the finish is `/nav:plan` + `/nav:do`/`/nav:refactor`. Tell: about to change code or a mockup mid-dogfood-session instead of naming the finding. |
| Confuse it with `/verify` | Keep the question separate — verify checks correctness, dogfood critiques experience + coverage. Tell: the session is checking "does this work" instead of "does this feel right / is anything missing." |
| Fire on a passing mention of a feature | Wait for a "try it / it feels off / show me where it's clunky" request. Tell: about to start a dogfood session off an incidental mention of a feature, not an actual ask. |
| Keep going after the feature feels smooth | Exit when friction is captured + named + routed, or the user has what they need. Tell: continuing to poke at a flow after nothing new has surfaced for a while. |

## Output

- **An evidence-rich friction report** in `dogfood/<date>-<feature>/report.md` — a session
  recording up top when one was requested, then each finding = where it snagged · what it felt
  like · an improvement idea, embedding its screenshot / response.
- **The session captures** — `session.mp4`/`.webm` (where supported), `shots/`, `responses/`.
- **The coverage gaps that fell out**, each tagged by layer (direction vs incomplete) and
  routed: direction → `/shape:elicit`/`/shape:mockup`; incomplete → `/nav:plan` + `/nav:do`/`/nav:refactor`.
- (Optional) a hand-off to `/shape:mockup` for any finding big enough to be a *redesign* — not
  the default.
- (When the session settles something trackable — e.g. "archive is deliberately one-way") a
  guarded, one-shot **offer** to run `/shape:align` and triage it in — never an auto-call
  (ADR-007/015).
