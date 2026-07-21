# ADR 095 — Relay gates outbound GitHub prose behind author sign-off

**Status**: accepted
**Date**: 2026-07-21
**Refines**: [ADR-090](docs/adr/090-relay-github-native.md), [ADR-092](docs/adr/092-relay-native-lifecycle-completion.md)

## Context

Every Relay writing verb already shows a preview before it writes — `report`'s "show the proposed object," `reply`'s "show the exact response/action," `settle`'s "show the exact resolution," `brief`'s "show the diff." That preview step was written to satisfy the repo-wide read-only/write-gated convention (`CLAUDE.md`: "a skill that writes files shows the content ... before committing and never writes without explicit user confirmation"), which treats a preview as one undifferentiated thing: content shown, confirmation obtained, write proceeds.

A GitHub object posted through Relay is not an ordinary file write. It posts under the user's own account and speaks to their collaborators as them — a report body, a reply's answer or comment, a settlement's closing resolution, a brief's synthesis are all **authored speech**, not generated artifacts the user merely owns. An agent can check whether such text is factually correct — the completion condition is met, the citations resolve, the resolution matches the recorded outcome — but it cannot check whether the text is what the user actually meant to say, or whether it sounds like them. That judgment cannot be delegated; it is available only to the user, and unlike a local file, a GitHub comment or Discussion post is seen by counterparts immediately and any correction leaves a visible edit history rather than disappearing.

The user ruled that this distinction needs a sharper gate than the general write-gate supplies: any outbound prose in the user's voice must be shown to them verbatim, with an explicit question — "Is this what you mean?" — before it posts, separate from and prior to the ordinary "does this look right, mechanically" preview those SKILL.md files already perform.

## Decision

Every Relay verb that writes prose into a GitHub object under the user's voice now states an explicit **author sign-off gate**, layered on top of (not replacing) its existing preview/write-gate step:

- Show the user the **exact text** that will post — verbatim, not a paraphrase or summary of it.
- Ask the **exact question**: "Is this what you mean?"
- Post only after they confirm. A rewrite goes back through the same gate — a second sign-off, not a silent retry.

This governs `report` (object title/body), `reply` (answer, comment, PR Comment, and Approve/Request-changes verdict text), `settle` (the final resolution text of a closing comment or merge), and `brief` (the synthesis Markdown, whose diff already shows the exact text — the gate adds the explicit question on top of the existing diff-preview).

**Mechanical mutations carry no authored text and are excluded.** A `👀` reaction, a label, an assignment, a review-request, or any read-back-verification step is not speech in the user's voice — it is a state change the ordinary write-gate already covers, and layering a sign-off question onto it would be a no-op (ADR-069's sense: asking "is this what you mean" about clicking a reaction that has no wording changes nothing a plain "confirm?" doesn't already ask).

`plugins/relay/CLAUDE.md` states the gate once, as a plugin-wide law, so a reader of any single SKILL.md sees the rule stated locally (self-contained per repo convention) while the owning statement lives in one place.

## Relation to the existing write-gate

This does not create a second, competing confirmation mechanism. The repo-wide rule ("Read-only / write-gated by default," `CLAUDE.md`) already requires showing content and waiting for confirmation before any write. Author sign-off is a **specialization** of that rule for one payload type — authored prose destined for a GitHub object — adding two things the general rule doesn't specify: the text must be shown **verbatim** (not summarized) and the confirmation question is **fixed wording**, not left to each skill's own phrasing. A skill that was already showing an exact diff (`brief`) needed only the explicit question added; a skill whose preview described the mutation more loosely (`report`'s "show the proposed object") needed the verbatim-text requirement made explicit.

## Consequences

- `plugins/relay/skills/report/SKILL.md`, `reply/SKILL.md`, `settle/SKILL.md`, `brief/SKILL.md` each restate the gate at their existing preview step, upgraded rather than duplicated.
- `plugins/relay/CLAUDE.md` gains an "Author sign-off (outbound prose)" section stating the gate as plugin law, plus this ADR in its refines list.
- One extra confirmation round-trip per outbound prose write. When several texts ship together in one turn (for example, a settlement resolution plus a linked follow-up report), showing all of them together and confirming once is acceptable — the gate requires verbatim text and the sign-off question, not one round-trip per object.
- No schema, reducer, or `compute-state.mjs` change — this is a SKILL.md/CLAUDE.md process gate, not a digest contract change. `relay` moves `1.2.1` → `1.3.0` (a new process requirement across every writing verb is a minor addition, not a patch).
- No new GitHub object type, parallel state store, or daily verb. The daily verb set stays `launch · report · digest · reply · brief · settle` plus explicit-only `migrate`.
