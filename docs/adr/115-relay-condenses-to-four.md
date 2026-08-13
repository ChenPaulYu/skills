# ADR 115 — relay condenses to four: retire `brief`, `launch`, `migrate`; the rest re-home but barely compress

**Status**: accepted
**Date**: 2026-08-13
**Source**: ratified by Paul 2026-08-13 — 「relay 有根本不會用到的多餘 skill 嗎?」…「請幫我濃縮成真的必要用到的 skill 就好」…「好啊,就這樣做」. Also the first application of ADR-109's three-layer law to the one family that ADR-109 deliberately skipped.
**Precedent**: [ADR-109](docs/adr/109-deep-module-skills-three-layers.md) (the three layers) · [ADR-112](docs/adr/112-one-board-verb-two-tiers.md) (canon has no folder — principles route by how they fire) · [ADR-114](docs/adr/114-verification-and-dispatch-cost-gates.md) (the dispatch gate this round ran under).

## Context

relay was excluded from every consolidation round this week by standing instruction, so it entered this ADR as the only family still in its pre-ADR-109 shape: **7 skills, 606 body lines (average 86 — double every other family), zero `references/` directories, and 2,063 characters of description — 23% of the marketplace's always-resident tax for a family with zero recorded fires in eleven months.**

Two questions had to be separated, because they have opposite answers.

**Is relay used?** Yes — and this was checked rather than assumed. The workspace (`rytho-ai/accord`) is live and GitHub-native: Issue templates for tell/task/needs-input/decision, Discussions, `briefs/`, `decisions/` with three recorded Decisions, an attested `relay.yml` roster merged the week before, and a scheduled conformance CI. Eight open Issues, one assigned to Paul. **The skills have never fired; the workflow has never stopped.**

**Which skills earn their door?** Fire counts cannot discriminate when every count is zero, so this round used a sharper test, and one that generalizes: **does the workspace already enforce the discipline itself?** A skill that restates a rule the repository already carries is not a door — it is a second copy, paid for on every turn.

## Decision 1 — retire three verbs

**`brief`** — the workspace's own `briefs/README.md` states every discipline the skill encodes: lead with current understanding, cite stable URLs, separate known-fact from current-synthesis from still-open, anchor each claim to `[D-0xxx]`, a Brief is not consensus, closes no object, never auto-promotes to `core/`. The skill is that README, re-said. And the two Briefs that exist were written by hand — the rule was followed without the verb.

**`launch`** — its two halves both expired. The **audit** half is superseded by machinery: `.github/scripts/relay-conformance.mjs` runs Checks A–G on schedule and on push (core/** changes must ride an approved PR, ownerless-object sweep, closed-without-Resolution sweep). The **setup** half is once-per-workspace and was completed — the attested roster landed via PR #21. A verb whose audit is now a gate and whose setup is done has nothing left to do.

**`migrate`** — bringing a repository's pre-Relay history into the model is a once-ever, bespoke, cross-repository move; a standing verb cannot know the two repositories in advance, so when it happens it is hand-driven. **Its discipline is preserved, not discarded**: preserve an immutable baseline before touching anything · inventory completely rather than by sample · classify before moving (settled conclusion → Decision file · durable understanding → Brief/Core *citing* Decisions, never restating · living lookup table → a reviewed PR) · show the complete source→destination map before any write · verify every item and inbound reference *before* deleting the source. That now lives in `plugins/relay/CLAUDE.md`, where it costs nothing per turn.

**relay: 7 → 4** (`report` · `digest` · `reply` · `settle`). Marketplace: 28 → **25**.

## Decision 2 — re-home the four, and accept that three barely move

The four survivors were re-homed under ADR-109 by three sub-agents briefed to be **more conservative than any previous round**, for a reason specific to this family: elsewhere, usage data showed which lines had ever caught a real mistake. Here there is none — and relay writes to a live workspace where a wrongly-compressed authorization rule fails against **a real person**, not an untidy repo. The standing instruction was *when in doubt, leave it in the body.*

The result is deliberately unimpressive, and that is the finding:

| skill | body | sunk to `references/` |
|---|---|---|
| `settle` | 132 → 110 | settlement-block template · Decision-file field spec (38 lines) |
| `digest` | 116 → 116 | presentation format · schema field table (12 lines) |
| `report` | 74 → 74 | nothing |
| `reply` | 61 → 61 | nothing |

**`report` and `reply` had no machinery to sink at all.** Their bodies are destination resolution, recipient verification, "never infer a username", authority checks, author sign-off, read-back — gates end to end. The agent that examined them declined to create a `references/` directory for zero content, calling it *process theater, not compression*. That refusal is the correct outcome and is recorded here so a later round does not "fix" it.

`settle` kept **twelve** authority rules resident and sank only two templates: who may close · the promotion test · the native promotion signal chain · all five direct-commit fuses · the Decision-file drafting rules · mechanical supersession · citation law · the ordinary lifecycle authority table · the five process steps including the author sign-off gate · accepted-versus-effective · the completion criterion · every NEVER clause. Losing residency on any of them risks a closure landing as agreed when nobody agreed.

Descriptions **did** compress, and that is where the real saving is: **2,063 → 1,291 characters (-37%)**, with grounded Chinese triggers added where they were natural and missing — `digest` (有什麼要我看的 · 對方有回我嗎 · relay 有東西嗎), `report` (回報給對方 · 跟他說), `reply` (回覆他 · 幫我回), `settle` (結案 · 這件事拍板了). The corpus that precedes a real fire is ~92% Chinese; relay had zero Chinese triggers.

## What is honestly lost

- **`launch`'s audit checklist as a runnable verb.** The conformance CI covers the same ground for *this* workspace; a second workspace would have to be set up by reading `accord`'s own structure as the template. Accepted: one workspace exists, and the template is a repository, not a paragraph.
- **`brief`'s guarantee that the citation law is applied.** It now depends on the author reading `briefs/README.md` — a rule, not a gate. The mitigation is that the rule already governed the two Briefs that exist.
- **A verb for legacy adoption.** Preserved as prose; if a second adoption ever happens, the discipline is there but nothing enforces the sequence.

## What this round did not fix

**`digest` still cannot remind anyone.** It is summoned, and a summoned verb has no way to tell you that a counterpart is waiting — which is the complaint that opened this work, and the third instance today of the same defect (`migrate` never fired because nothing reported tree drift; the session cursor ran cold 7 of 9 times because a leaving ritual depends on discipline). The fix belongs on a **daily schedule**, not a SessionStart hook: a collaboration debt does not change per session, it changes per day, and it is owed regardless of which project directory happens to be open. Deliberately left for the owner to arm, and recorded here so it is not mistaken for done.

## Consequences

- Deleted: `plugins/relay/skills/{brief,launch,migrate}/`. `migrate`'s discipline moved verbatim into `plugins/relay/CLAUDE.md` as a no-verb section.
- `settle` and `digest` gain `references/`; `report` and `reply` deliberately do not.
- Four descriptions re-cut with grounded Chinese triggers; `digest`'s was rewritten earlier the same day and left untouched by the compression round.
- `plugins/relay/.claude-plugin/plugin.json`, relay `CLAUDE.md` roster, `marketplace.json`, README, site map, and the Codex layer follow; mirrors regenerated; validator green at 25 skills.
