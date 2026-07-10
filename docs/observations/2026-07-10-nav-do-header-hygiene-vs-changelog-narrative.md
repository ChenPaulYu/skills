---
date: 2026-07-10
status: raw
---

# `/nav:do`'s header-hygiene check keeps a header truthful about *current* state, but doesn't say the same header must not smuggle in dated "why we changed X→Y" narrative

## What prompted it

A CLI rename round (four ambiguous verbs renamed to clearer ones, e.g. `track`→`add-track`, `trim`→`offset`) went through `/nav:do` properly — inject, execute, check all fired. But the *content* written during "check → header hygiene" included lines like "2026-07-10 指令改名(易懂性覆核): `track`→`add-track`...(舊名 X 容易誤讀成 Y, 2026-07-10 改名)" directly in the module docstring and per-command docstrings. The user caught it immediately: "為什麼你要把歷史存在code的comment裡" ("why are you storing history in the code's comments").

## The signal

**Header hygiene, as currently phrased ("a header describes current state; a stale header is a lie"), is a necessary but not sufficient test — it catches a header that's *behind* reality, but says nothing about a header that's *up to date on facts* yet still smuggles in a dated changelog narrative.** A line like "renamed from X because Y, on date D" is technically true and technically current (it does describe why the present name is what it is) — so a check that only asks "is this stale?" waves it through. But that sentence's *shape* is wrong: it's a diary entry embedded in a load-bearing file, and it will rot the same way any comment referencing "the current fix" rots (per the standing rule against comments that reference the task/fix/history) — except header hygiene, as a distinct nav:do gate, doesn't currently say so explicitly, so the general rule didn't fire as a check *at this specific gate* even though the general principle already existed elsewhere.

The distinguishing test: a header should describe **what the thing is / does now**, never **the story of how it got there**. "Why we renamed X to Y" belongs in the commit message, the plan doc, or an ADR — never in the file the reader opens cold. This is a header-writing failure mode distinct from staleness: a stale header lags behind the code; a narrative header is accurate but wears the wrong genre.

## Where it could live

Binds cleanly to `/nav:do`'s own **check → header hygiene** gate (the skill's Process step 4, gate 1: "a new load-bearing file carries a header... a file whose role changed has its header updated in the same change"). The gate's phrasing currently only tests *staleness* ("stale header = lie"); it does not test *narrative-shape* ("a header that names the old value + the reason + the date it changed, is also wrong — even if accurate"). The concrete delta: add a second clause to gate 1 — a header update should read as a **present-tense fact**, not a **changelog entry**; if the new sentence contains a past-tense change-verb ("renamed from," "changed to," "was X, now Y") plus a date, that is a smell to strip before finishing the gate, not evidence the gate passed.

## Evidence so far

- **Only case (2026-07-10, tactus CLI rename round)**: `/nav:do` was invoked correctly (unlike the earlier nav:do/nav:plan-skip pattern in [[2026-06-03-ambient-discipline-suppresses-firing-the-verb]] — this is a *different* miss, inside a correctly-fired `do`, not a case of not firing it at all) — but its header-hygiene check let dated "old name → new name, because Z, on date D" narrative through in both the module docstring and three command docstrings, because the check only verifies "not stale," not "not a changelog." Caught by the user's direct correction, not by the skill's own check phrasing. Fixed by stripping all dated/historical narrative from `cli.py`, keeping only current-state design rationale.

(One case → stays `raw`. Trip-wire: a second session where a `/nav:do` (or `/nav:sync`, which shares the header-update concern) check-phase pass writes a header sentence naming an old value + a reason + a date, and it survives to the "done" report without being caught by the gate itself (not by the user) — that would show the gate's own phrasing, not just user vigilance, needs the explicit second clause.)
