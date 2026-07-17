---
name: report
description: "Write a thought into a relay coordination repo — progress, or a concept/framing alignment — so a counterpart's agent grasps where things stand. One flexible shape: short for progress, longer for alignment; the counterpart responds with /relay:review. Fires on \"report in relay\" or \"post progress\". Content verb; read side /relay:digest. Writes one append-only thought into the relay CONTENT repo ONLY — an ADR / design doc / README in a code repo is /nav:compose, not a report. Gated by a diff."
---

# report — write a thought (progress or alignment)

Post a **thought** the counterpart's agent can pick up: where the work stands (**progress** — the common case), or how you're now framing something (**alignment** — occasional, heavier). One shape, flexible length.

> report and `/relay:review` write the **same thing** — an append-only thought. report opens; review responds (referencing a thought's id). The two tones (progress / alignment) are *how you write it*, not a frontmatter flag.

## Scope

Operates on the **content repo** — a *separate* coordination repo located via `$RELAY_REPO`, else a cached prior resolution, else the current dir if it has `relay.yml`, else **ask the user** and cache the answer (never assume cwd; see CLAUDE.md) — one project at a time. Writes **one append-only thought** (`thoughts/<date>-<handle>-<slug>.md`, one per file); shows a diff and is gated. Authored to `/nav:compose` discipline (lead with the point; head-able top).

**Relay content repo ONLY — not a doc authoring tool.** report writes a *coordination message to a counterpart*, and it lands **only** in the relay content repo (the one with `relay.yml`). A **durable document that lives in a code / tooling repo** — an ADR, a design doc, a README, a spec — is **`/nav:compose`**, never a report (even though both write prose and report borrows compose's *discipline*). The test: *message to a counterpart* → report; *document in a codebase* → compose. If the artifact's home is anywhere but the relay content repo, stop — it's not a report.

## Process

### Step 1 — Resolve + pull + read current state
- **Resolve who's running**: match the git author email to a person's `git:` field in `relay.yml` → your handle.
- **Pull** (get the latest), then **read the current state** — recent `thoughts/` — so you *continue* threads (reference existing ids) rather than restart them.

### Step 2 — Write the thought
Write `thoughts/<date>-<handle>-<slug>.md` (`<slug>` from the subject):
```markdown
---
date: <ISO>
by: <handle>
subject: "<one line — the headline; the reader and /relay:digest read it first>"     # quote it — a colon in the subject breaks unquoted YAML
thread: "<link to the discussion root>"   # REQUIRED, quote it — which discussion. Opening a NEW topic? point to YOURSELF (this file). Continuing one? the existing root
re: "<link to the thought you answer>"    # optional — set it (like a reply) when this continues a thread by answering a specific thought
relate:                                    # optional — cross-discussion "see also" links; may be several
  - "<link to a related thought>"
---
<body — lead with the point, head-able; flex the depth to the job>
```

Natural tones (same format, different depth — tone, not a `kind` field):
- **Progress** (common, short): what's **done** · what's **in progress** · what's **next** · and **flag anything that needs the reviewer**. One line per item; not a changelog.
- **Alignment** (occasional, longer): a briefing that brings someone's mental model up to date on a concept / framing / decision. Lead with a TL;DR, group by knowledge, end with a concrete example. Length is fine *when it's for understanding*, never a chronological dump (that lives in the project repo; link to it). When the reader's model is **out of date**, these moves earn their keep:
  - **State why you're sending it** — the doc's purpose, one line, *before* the content (don't make them infer it).
  - **Anchor on the reader's OWN prior terms** — the vocabulary *they* authored or already know, not your cleanest metaphor. Lead with the **old→new mapping in their words**, *then* transform; a reader meets new names cold unless you bridge from theirs first. (Span generations if they do: anchor on the most concrete, footnote the earlier.)
  - **Call out what actually changed** — renames **and** level / structure shifts — explicitly; don't only say "core unchanged" and leave them wondering what moved.
  - **Mark shipped vs planned vs hypothesis** — never let a target read as already done.
  - **One concrete walkthrough** (a real request flowing end-to-end) makes the abstract tangible.
  - **Verify by reading it as someone with ONLY the old knowledge** — if they'd hit unfamiliar names before the bridge, reorder.
- **Conclusion** (occasional): synthesize a long / iterated discussion into its outcome + why. Write one **only when the thread doesn't read linearly into the conclusion** (a one-line `log.md` entry would undersell it) — never to restate the thread. `settle` points `log.md` at it (the index → the synthesis). It's also the discussion's **navigation hub**: **link the related thoughts inline** (one-stop — grasp the whole arc + jump to any piece); the `thread` anchor keeps the set complete, the inline links are the human-readable map.

Mark anything needing the counterpart with **`@<handle>`** + what you want back (a look / a call / unblock). That's what `/relay:digest` surfaces to them and what `/relay:review` answers. **A thought with no `@`-flag is FYI** — it informs, wants nothing back, and `digest` won't park it on anyone; that's a feature, not a forgotten ask. (The ask-vs-FYI / termination contract is owned by `relay/CLAUDE.md` → *Resolution & decisions*.)

**Carrying images** (a screenshot, a mockup, a diagram) — embed them as standard markdown images pointing at a **relative** path (never an absolute path or an off-repo URL), per the content repo's asset convention (its `CLAUDE.md`: small-in-git / large-linked). The picture is part of the message, but `digest` is a *text* triage that can't see it — so when the visuals carry the point, **say so in the body** ("see the mockups below") so the counterpart's agent opens + renders them instead of reading the subject alone. (Format-contract rule + the surface duty: `relay/CLAUDE.md` → *Format contract*; `digest` does the flagging.)

### Step 3 — Gate + commit
**Show the diff. Wait for OK** (or "just post"), then commit + push.

## Discipline
- **One thought per file, append-only** — write only *your* dated file; never edit someone else's.
- **Continue, don't restart** — continuing an existing discussion? Set `thread` (+ `re`) in frontmatter like a reply; only open a fresh thread (no `thread`/`re`) for a genuinely new topic.
- **Lead with the point** (`/nav:compose`); group by knowledge, not chronology; the subject is the headline.
- **Flex length to the job** — progress is short; alignment may run long *for understanding*, never as a raw work-log.
- **Pull before, push after; gate before commit.**

## Anti-patterns (refuse these)
| Temptation | Instead — and the tell |
|---|---|
| Dump a chronological changelog | Group by knowledge instead — a raw work-log lives in the project repo; a thought carries distilled state + a link. Tell: the report reads like `git log`, one bullet per commit. |
| Pad an alignment thought to look thorough | Let length track understanding, not effort — ramble is the smell. Tell: a paragraph could be cut without losing any decision or fact. |
| Re-raise an open item with a new id | Continue the existing thread by referencing its id. Tell: about to post a thought that restates a question already open elsewhere instead of linking to it. |
| Edit a teammate's thought to "tidy" | Leave it — append-only, never touch others' files. Tell: about to open someone else's thought file in an editor. |
| Use report to author an ADR / design doc / README in a code or tooling repo | Route that to `/nav:compose` instead — report writes a coordination thought into the relay content repo only. Tell: the content being written belongs in the target codebase, not the relay repo. |

## Companion skills
- **`/relay:digest`** — the read side ("what's waiting on me").
- **`/relay:review`** — how the counterpart responds (ack / comment / change).
- **`/relay:settle`** — periodically settles the thought-stream into a current-state snapshot + pinned decisions.
- **`/nav:compose`** — the prose discipline the thought is written to.

## Communication style

- Explain in the user's language with simple, direct wording.
- Lead each reply with one plain sentence; use a metaphor when it clarifies the concept.
- Put precise technical detail after the plain explanation and only where it's needed.
