---
name: observe
description: "Surface this session's candidate durable learnings, let you pick which to keep, then write only the picks — never a silent auto-write. Classified as own-learning (local docs/observations/), skill-feedback (opt-in PR upstream to github.com/ChenPaulYu/skills for downstream users), or standing-rule (a repeated behavioral correction proposed as one always-on config line). Also ambient: when the agent notices the same correction a second time, the user hand-repeating a personal procedure, or personal content leaked into a public artifact, it offers in ONE line to capture — a nod runs the single-candidate fast path; no nod, nothing happens. Feeds the repo-evolution loop: lived experience → observation → ADR → skill. Read-only except the chosen file(s) / feedback PR."
---

# observe — harvest this session into a durable observation

Capture **durable, reusable learnings** from the current session into a **knowledge base** (`docs/observations/`) — the first step of a repo-evolution loop: **lived experience → observation → ADR → skill change.** Unlike a plain recap of what happened, observe is **selective** — it keeps only the insight(s) worth keeping.

**Candidate-first — the agent proposes, the user disposes.** Do **not** silently auto-distill one and write it. Surface the session's candidate learnings as a short list, the user picks which (if any) to keep, and only the picks get written. The user owns what enters their knowledge base; observe's job is to *find and offer* the candidates, not to decide for them.

Optional focus from the user: **$ARGUMENTS** (if given, bias the candidate scan toward that area; else scan the whole session).

## Ambient trigger — the one-line capture offer (ported from the retired private `tape` skill, 2026-07-24)

observe is normally summoned, but two tells license a **proactive one-line offer** mid-session (an offer, never a run):

- **corrected twice** — the user corrects the agent the same way for the *second* time. The loudest signal there is: it usually means a missing **standing rule**, not a missing skill.
- **hand-repeated ritual** — the user walks through the same multi-step personal procedure by hand again.
- **leak** — personal content (the user's private email/paths/identity, personal voice, private repo names) is spotted hardcoded in a public artifact. The offer covers both halves: fix the artifact now, and capture the pattern so it stops recurring.

On a tell: offer in **one line** ("要記下來嗎？— /reflect:observe"), then drop it. A nod runs the **single-candidate fast path**: skip the broad Step 2 scan, carry that one candidate straight through classify → route → gate. No nod → nothing happens, don't re-offer the same candidate. When in doubt whether it's worth offering: offer — capture is cheap and unjudged; the pick-gate is the filter, not the offer. What stays forbidden is unchanged: no full harvest unbidden, no write without a pick.

## Step 1 — Locate the knowledge base

```bash
TARGET="${SKILLS_REPO:-.}"            # central repo if set, else the current project
ls "$TARGET/docs/observations" >/dev/null 2>&1 && echo "ok: $TARGET/docs/observations" || echo "no observations dir at $TARGET/docs/observations"
date +%F
```

- Prefer `$SKILLS_REPO` (a central knowledge base); else fall back to the **current project's** `docs/observations/`.
- If neither exists, ask the user where observations should live (or whether to create `docs/observations/` in the current project) — don't write to a guessed path.
- Use the real `date +%F` output for the filename + frontmatter — never guess the date.

**Two kinds of observation route to two destinations** (classified per-candidate in Step 2, decided in Step 5):

- **own-learning** — a learning about *the user's own work / codebase*. Destination = the local KB above. Private to them.
- **skill-feedback** — a learning that is really *feedback about a skill itself* (a friction, a gap, "this verb should also do X"). The valuable destination is **the skills' author**. If the runner can commit to the skills repo (they ARE the maintainer — `$SKILLS_REPO` set, writable, its `origin` is the canonical skills repo, `gh` push works), it just commits locally like any observation. **Otherwise the runner is a downstream user** → the contribution path is an **upstream PR** (Step 5's PR branch), never a local write that goes nowhere. Detect write-access cheaply, don't ask identity:

```bash
# Is this runner the skills maintainer (can land a skill-feedback observation directly)?
git -C "$TARGET" remote get-url origin 2>/dev/null   # is origin the canonical skills repo?
gh repo view ChenPaulYu/skills --json viewerCanAdminister -q .viewerCanAdminister 2>/dev/null  # push access?
```
  No writable canonical skills repo → treat skill-feedback as **downstream → PR**.

## Step 2 — Surface the candidate learnings (don't write yet)

Scan THIS session for the **non-obvious, reusable mechanisms or principles** worth keeping — what future-you would want to know, not a play-by-play. A keeper names a *signal* and a *move*, grounded in what actually happened. For each candidate, fix:

- the non-obvious insight / mechanism / failure mode it surfaced;
- the reusable principle, as a one-sentence **claim**;
- its **kind** (Step 1): **own-learning** (about the user's work), **skill-feedback** (about a skill itself), or **standing-rule** (a repeated behavioral correction whose real home is the user's always-on config — see Step 4) — this decides where it can go **and which test selects it**;
- the evidence (this session) + **the selector for its kind** — the two kinds are kept on *different* tests; don't apply one to both:
  - **own-learning → durability AND news to the *user*.** Is this a real, likely-recurring lesson (one-off vs. recurring) — *and* would the user otherwise re-derive it (i.e. it isn't already theirs)? **Durability alone can't filter** — these two false positives are durable yet are NOT keepers: **(a) the user's OWN in-session insight** already recorded in the project's `thoughts/`/`decisions.md`/`plan.md` (handing it back is redundant, not a learning), and **(b) the agent's session-reasoning recap** ("the principle I applied / the bug I hit") — that's a plain recap, not a learning. The line: *a principle the agent APPLIED this session is recap; a non-obvious thing the USER would otherwise re-derive is an observation* — test for the latter.
  - **skill-feedback → the counterfactual bind** (NOT durability). Can you name **(S) a skill · (P) a decision-point in it · (D) a general behaviour-delta**, such that *"if S did D at P, this wouldn't recur"*? Prescriptive + locatable + general = a real skill-improving keeper — because improving a skill = changing what the agent *does* via a concrete general delta to its text, so feedback that can't name S/P/D can't improve it. A true, durable **pitfall that binds to no skill** is *not* skill-feedback → **demote it to an own-learning note** (or drop it). **Durable ≠ skill-improving** — cataloguing pitfalls as "skill-feedback" is the failure mode this guards.

Produce a **short list (≈2–5). Write nothing yet.** **Rank the bind-passing skill-feedback first** — those can actually change a skill; the durable-but-unbindable pitfall (own-learning) notes sit *below* them, not interleaved as equals. (Scan the live session directly — conversation, git log/diff/status. If `$ARGUMENTS` named a focus, bias toward it but still scan wider.) If the session genuinely surfaced nothing keepable, say so plainly — don't manufacture a candidate to have something to show. **A session where the user drove the insight themselves (it's already in the project's docs) and no skill-feedback bind emerged should usually return "nothing keepable" — handing the user back a list of their own thoughts (or your session-recap) is the failure this guards. Bias the whole scan toward skill-feedback; that is observe's load-bearing purpose, and own-learnings are the exception that must clear the news-to-the-user bar.**

## Step 3 — Present the candidates, let the user pick

Show the list — **bind-passing skill-feedback first, then own-learning** — each candidate as **one line: the claim · kind · why it's worth keeping · its selector result** (skill-feedback: the bind it makes — *skill · decision-point · delta*; own-learning: rough durability) (and "overlaps existing `<slug>`" when your dedupe sense already flags one). Mark a skill-feedback pick that would route upstream (downstream runner) so the user knows it means *opening a PR*, not a local note. Then let the user choose **zero, one, or several**.

This is the **gate**: nothing is written until the user picks. Don't pre-decide or auto-write the "best" one — the user owns what enters their knowledge base; observe finds and offers, the user disposes. You may flag a recommended pick, but the choice is theirs. Only the picked candidate(s) proceed to Step 4.

## Step 4 — Route each pick (own KB vs upstream PR)

Per pick, the kind (Step 2) + write-access (Step 1) decide the destination:

| pick | destination |
|---|---|
| **own-learning** | local KB — Step 5 (write to `$TARGET/docs/observations/`) |
| **skill-feedback**, runner CAN write the skills repo (maintainer) | local KB — Step 5 (it's their own skill) |
| **skill-feedback**, runner CANNOT (downstream user) | **upstream PR — Step 5-PR** |
| **standing-rule** (a repeated *behavioral* correction — the "corrected twice" ambient tell) | the user's **always-on config** (their `~/.claude/CLAUDE.md` / preferences file / project CLAUDE.md — wherever their standing rules live): draft the exact one-line rule, show it, write only on approval. A recurring behavior demand belongs where it's loaded every session, not in a KB nobody re-reads; an observation file is the *fallback* when the user prefers to let it ripen first. **Size test**: if the pattern is a multi-step ritual too big for one line, the right landing is a **skill** — route it as skill-feedback (a new skill or a mode on an existing one, private or marketplace per its nature), not as a rule crammed into config. |

**Dedupe applies to the local-KB path only:** `ls "$TARGET/docs/observations/"` — if the learning **overlaps an existing observation**, prefer **appending/strengthening that file** (add an evidence case, move it toward `landed`) over a near-duplicate; surface the overlap, user picks new-vs-append. (The PR path lands in a fresh file in the author's `docs/feedback/` inbox; the author dedupes on triage, not the contributor.)

## Step 5 — Write the picked observation(s) in the established format

(Local-KB path. For the downstream skill-feedback path, see **Step 5-PR**.)

Write **each** candidate the user picked (one file each; if they picked several, repeat this for each). Path: `"$TARGET/docs/observations/<YYYY-MM-DD>-<kebab-topic>.md"`. Read one existing file first to mirror its shape:

```markdown
---
date: <YYYY-MM-DD>
status: raw
---

# <the learning as a full-sentence claim>

> Source: <one line — this session, what it was doing>   (optional)

## What prompted it
<the situation that surfaced it>

## The signal
<the non-obvious mechanism / principle — the core>

## Evidence so far
- **Only case (<date>, <context>)**: <what grounds it>.

(One case → stays `raw`. <the trip-wire / what would promote it>.)
```

Conventions:
- **Progressive disclosure**: title is a claim; sections lead with their point; `head -12` yields the gist.
- **Link** related ADRs and observations relative to the knowledge-base root (e.g. `docs/adr/0xx-...md`, `[[observation-slug]]`); no `./` or `../`.
- **status: raw** for a single case (promotion is by *evidence*, not session count). Add a trip-wire line for what would graduate it.

## Step 5-PR — Contribute downstream skill-feedback upstream (opt-in, scrubbed)

When a picked **skill-feedback** observation routes upstream (downstream runner, Step 4), the contribution path is a **pull request to the skills' author** — `https://github.com/ChenPaulYu/skills` — not a local write that no one will read. Two guardrails are non-negotiable:

- **Opt-in.** A PR is an outward, public action. Confirm explicitly first ("send this upstream as a PR to ChenPaulYu/skills?") — never auto-open. If they decline, offer to drop it or stash it as a local note instead.
- **Scrub first.** The observation likely cites the runner's real files / decisions / proprietary context. Before pushing, **rewrite it to be about the SKILL, generically** — keep the friction + the why + a minimal reproducible shape; strip project names, paths, private detail. Show the scrubbed version for approval before it leaves the machine.

Then open the PR via `gh` (fork → branch → add file → PR):

```bash
gh repo fork ChenPaulYu/skills --clone --remote 2>/dev/null   # fork + clone if not already
# in the fork: add the scrubbed observation to the author's feedback inbox
#   docs/feedback/<YYYY-MM-DD>-<kebab-topic>.md   (NOT docs/observations/ — that's the author's own)
git checkout -b feedback/<kebab-topic>
git add docs/feedback/<...>.md && git commit
git push -u origin feedback/<kebab-topic>
gh pr create --repo ChenPaulYu/skills --title "feedback: <one-line claim>" --body "<why-led body>"
```

- **Lands in `docs/feedback/`** (the author's inbox), one fresh file, same observation format (frontmatter `status: raw`; add `source: external`). The author triages → may graduate into `docs/observations/`. The contributor does NOT dedupe against the author's KB.
- **The PR body leads with WHY.** Open with *why they're sending it* — what they were doing, the friction/gap the skill hit, what they'd want changed — then the scrubbed observation. The why is what lets the author judge it; a finding with no why is noise.
- **If `gh` is missing or unauthenticated**, don't fail silently: write the scrubbed observation to a local file and hand the user the manual path ("`gh auth login`, or open a PR by hand at the repo URL with this file").

## Step 6 — Flag, then hand back (don't over-reach)

- Note whether each written observation likely **feeds an existing ADR** (name it) or is a **candidate for a future ADR** — but **do NOT write the ADR**. Observations are raw evidence; ADRs come later, deliberately.
- **Do not** edit any code, `SKILL.md`, manifest, or site map — observe only adds the observation(s) (or opens the feedback PR).
- **Local-KB picks**: show each written file's path + contents (or the diff if you appended); let the user review/commit. Don't commit unless asked.
- **Upstream-PR picks**: show the **PR URL** (or, if `gh` was unavailable, the local scrubbed file + the manual-PR instructions). The fork/branch/PR was already user-confirmed in Step 5-PR.

## Companion skills

- **`/reflect:catchup`** — where the work stands now (observe captures what's worth *keeping*; catchup orients you in the moment).
