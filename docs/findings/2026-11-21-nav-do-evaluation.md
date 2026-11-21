---
title: "nav:do evaluation: implementation precision and small-fix routing"
description: "Paired Sol trials cover sequencer navigation, reading rules, audio warping, PDF jump stability, and when localized copy edits can proceed directly."
date: 2026-11-21
status: raw
skill: "nav:do"
plugin_version: "0.28.7"
skill_repository_commit: "dd1de7b0579a561f3cd5ebf1c5268b5703290d91"
model: "gpt-6.2-sol"
tags: [skill-evaluation, implementation, regression-testing, routing]
---

# Keep nav:do as the default and test a narrow exception for copy edits

The paired implementations passed their shared acceptance checks. The most
consequential differences appeared during a PDF jump and after trimming warped audio.
The two reading-rule variants missed their preset savings target. The localized copy
edits support trying a narrow exception, with workflow savings still unresolved.

## Skill identity and method

The version in frontmatter is the **Nav plugin version** at the matching marketplace
commit. Use the commit and the SHA-256 of the instruction body to identify the exact
input when comparing future runs. The initial sequencer build used the original
instructions, but its exact skill snapshot was not independently verified.

| Snapshot | Used in | SHA-256 of `SKILL.md` |
|---|---|---|
| [Native nav:do](../../plugins/nav/skills/do/SKILL.md) | Original arm of both reading pilots, Warp, and PDF jump | `6f7cc7c5583086fd4b3db2033427ec05d14e0046dcd5d9191515c5905c56505c` |
| [Codex nav-do](../../.agents/skills/nav-do/SKILL.md) | Nav arm of both copy edits | `d042a0af8b80ec029a6a93201cc02bab82a58f71203876b9496a7fb33525d588` |
| Question-led reading candidate | Reading pilot 1 | `07c4099b7dfe11ea957c9b9e28a8506ad09895c426c410dc08ac22c272284b36` |
| Focused-block reading candidate | Reading pilot 2 | `ea30efc4d0b2ed76cabf165bb4a89f1f377692d0aa99de27250531ddbb952ab8` |

Each implementation arm used a fresh Sol sub-agent. Matched arms got the same
task and starting code except in the sequencer follow-ups, which intentionally
inherited the two different builds. In the direct arms, workers did not load
the Nav skill. The primary session ran common checks and reviewed the diffs.
The shared acceptance checks and supplemental observations below are labeled
separately. These are small paired trials and do not estimate a general win rate.

## Results

| Case | Shared result | What the comparison showed |
|---|---|---|
| [Vanilla sequencer and follow-ups](#sequencer-and-follow-ups) | Both sequencers played correctly under the shared checks. Both pattern renames passed 41 Chromium checks. | The Nav-built sequencer split engine responsibilities. The follow-ups did not establish lower total reading effort. |
| [Reading-rule pilots](#reading-rule-pilots) | Both arms in both pilots passed all 41 Chromium checks. | Neither candidate reached the preset 20% reduction in source lines read before the first edit. |
| [Per-clip audio warping](#per-clip-audio-warping) | Both passed 25 checks in Chromium. | Only the Nav arm preserved the exact overlapping audio samples after trimming the warped clip. |
| [PDF jump under delayed rendering](#pdf-jump-under-delayed-rendering) | Both passed five Electron runs, including two cold replays. | The Nav arm kept the requested page steady and preserved the expected wheel displacement. |
| [Two copy edits and a routing check](#copy-edits-and-routing) | All four implementations passed their tests and browser checks without user intervention. | A separate routing run caught a shared component. The overall work saved by bypassing the skill remains unresolved. |

### Sequencer and follow-ups

From empty repositories, build a 16-step, three-track drum sequencer in vanilla
JavaScript with synthesized audio, live BPM changes, and Play/Stop. The Nav arm
separated sequencing, drums, and transport. The direct arm kept them in one
script. Fresh agents added Swing without Nav. The Nav-built arm showed 631
source lines before the first edit versus 580 in the other arm, with repeated
reads counted.

Both builds then grew into a pattern DAW and were tested again by fresh agents
renaming patterns without Nav. Finding the data and storage owner took 68 vs.
201 lines. Total pre-edit reading was 846 vs. 785 lines. The data module was
introduced during the follow-up without Nav, so its contribution cannot be
attributed to the original skill alone.

### Reading-rule pilots

On the same frozen pattern DAW, compare one instruction change at a time with
the original. Have each agent rename both patterns. Verify repeated
arrangement labels, legacy saves, whitespace rejection, preserved pattern and
mixer state, and playback. The preset adoption signal was at least 20% fewer
pre-edit source lines with the same acceptance and reproducible checks.

| Candidate | Lines to find the owner, original / candidate | Lines before first edit, original / candidate |
|---|---:|---:|
| Read by question | 327 / 155 | 599 / 809 |
| Read the enclosing code block | 80 / 115 | 582 / 570 |

The first candidate found the owner earlier and then read more before editing.
The second reduced pre-edit reading by about 2%. Both preserved stable
pattern IDs and existing saves. Neither candidate was adopted.

### Per-clip audio warping

Start both arms from the same vanilla JavaScript multitrack DAW and
pitch-preserving stretch implementation. Import a synthetic two-bar 120 BPM
loop with a 440 Hz tone and detectable attacks. At a project tempo of 90 BPM,
both arms played it for 5.333 seconds at 440 Hz, with about 3.3 ms error in
alignment against a second track. The common checks also exercised trim,
tempo change, seek, cross-track drag and mute, reopening, and loading old
unwarped state.

In a supplemental PCM comparison, the 224,000 samples retained across the
same trim matched exactly in the Nav arm and changed in the direct arm. The
Nav arm stretched the full source and then sliced the result. The direct arm
re-ran stretching on the selected segment. Audibility and the resource cost
of stretching long sources were not measured.

### PDF jump under delayed rendering

Use the same frozen desktop PDF reader and saved guide link for both arms.
Delay the target and nearby page loads by 700 ms to reproduce the known
failure. Start on page 100 and jump to 106. In Electron at 1180×760, replay
the cold jump twice, scroll before the destination renders, issue a new jump
to 111 before rendering, and jump to a nearby warm page. Both variants
passed the settled-page and input acceptance checks, including persistence.

The supplementary frame trace showed that the Nav arm held page 106
throughout both cold replays. The direct arm went 106 → 110 → 106 both
times. Under the same 2,150 px wheel input before paint, viewport
displacement was about 2,149 px with Nav and 6,210 px in the direct arm.
Both passed the original wheel criterion, which checked forward motion and
that the viewport was not pulled back. This result covers one task in a
larger codebase. It does not measure the effect of repository size alone.

### Copy edits and routing

Use one frozen reader checkout for two matched pairs. Change the vault
chooser's open button label, keeping its visible and accessible names in
sync and preserving the open/create actions. In a second pair, change only the Library
search placeholder and preserve its accessible name, results, and clearing
behavior. Both arms passed the same 24 chooser tests or 73 search tests,
respectively, and eight independent Chromium checks per implementation
across 1180×760 and 900×600. The two search diffs were identical. The browser
trial used local fixtures. It did not exercise the native file picker.

The preset adoption rule also required a concrete step saved in each direct
run and a successful routing check. A separate fresh agent traced a request
to change a PDF-only tooltip to a component shared by PDF, web and video
readers. It also found that the main PDF entry renders a different branch.
It correctly selected Nav. One direct run's Electron availability probe
triggered a lazy install in its isolated dependency directory. Independent
checks used clean copies. The trials established equivalent output in these
two cases, but did not establish overall workflow savings or exercise the
cost of looking up a live workspace record.

## Implications for the next revision

- Keep the original implementation workflow as the default. The evidence
  supports a narrow trial exception for decided copy edits when source
  inspection confirms a single affected surface and an existing user flow
  can verify the result. Shared ownership or uncertain impact sends the
  change through Nav. This routing rule was evaluated separately and has
  not been installed by this finding.
- For delayed interactions, a candidate verification example should observe
  the operation during the transition, after settling, and after a new user
  action interrupts it. Compare the result with the original instructions
  before making the example a standing rule.
- Keep the report as the durable evidence summary. Its cases describe how
  to construct comparable trials. The original app snapshots, private
  fixtures, runners, and full traces were retained in local scratch during
  evaluation and are not bundled for exact replay.
