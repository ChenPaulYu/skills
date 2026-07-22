# ADR 097 — Relay flips the awareness tier from optional to receipt-default

**Status**: accepted
**Date**: 2026-07-22
**Refines**: [ADR-091](docs/adr/091-relay-awareness-review-task-evidence.md), [ADR-093](docs/adr/093-relay-obligations-vs-notices.md), [ADR-096](docs/adr/096-relay-closure-semantics.md)

## Context

Before this ADR, Relay's awareness tier (`[ACK]`) was optional and single-recipient by design: an Announcement Discussion produced an actual obligation only when its author explicitly opted in — an `[ACK]` title prefix or `ack-required` label — and even then, only the *first* `@mention` in the title or body became the designated recipient; every other named account was just context, invisible to `digest`. A plain Discussion naming several people with no explicit ACK marker created no obligation for anyone: every mention was a bare `mentioned-in-prose` notice, and the initiator had no machine signal for "has everyone actually seen this" — they had to read the reaction list by hand, on their own schedule, or not at all.

This machinery consumed disproportionate design and reducer surface for what it delivered: two separate awareness mechanisms (ACK's single-recipient obligation, and the notices tier's best-effort safety net) doing overlapping work, with the notices tier absorbing most real "someone should see this" traffic by default rather than by choice. The user's question, put plainly: *why not force replies* — or more precisely, why not make "you were named, so you owe a look" the default reading of naming someone, the same way assignment already defaults to an obligation on an Issue, rather than requiring an opt-in marker per Announcement.

## Decision

**Receipt obligations are now the default**, not the exception:

- Any open Discussion that is not `fyi`-labeled and not Q&A (`isAnswerable`), and whose title or body names one or more `@recipient`s, is Announcements-tier and receipt-bearing. The pre-097 explicit markers — an `[ACK]` title prefix, an `ack-required` label — still work, but neither is required any more: naming someone in such a Discussion IS the trigger.
- **Every** named account owes its own receipt, completed only by that account's own `👀` reaction. This replaces the old "first mention wins, later mentions are context" rule: naming three people now creates three separate, independently-clearing obligations, not one obligation for whoever happened to be named first.
- `fyi`-labeled remains the explicit **broadcast opt-out**: no obligation for anyone, on purpose. A mentioned account there gets a notice — the pre-097 experience, preserved exactly for the one case it was always meant for: a pure share with nobody specifically on the hook to look.
- **Close-nudge.** Once every named recipient on a receipt-bearing Announcement has left their own `👀`, its author owes closing it — `digest` surfaces `SETTLE close-announcement` (reason `receipts-collected`), symmetric with Q&A's native answered → `close-answered-question`. The initiator no longer has to manually poll the reaction list to know when a broadcast is "done."
- **Notices demoted to the wild-traffic net.** With title/body mentions on receipt-bearing Discussions now formal obligations, the `mentioned-in-prose` notice tier (ADR-093) shrinks to what it was always meant to catch as a *safety net*, not a primary path: a mention buried in a comment (never a receipt trigger — comment-borne mentions stay outside `announcementRecipients` on purpose, so wild conversation under an announcement doesn't spawn new obligations), or a mention on an object with no receipt semantics at all (an Issue, a PR, a Q&A Discussion the viewer didn't author, or an `fyi`-labeled Announcement).

## Considered and rejected

**(i) Full compulsion, no opt-out.** Making every Discussion mention receipt-bearing, with no `fyi`-label escape hatch, was considered and rejected: it kills the cheap, no-obligation weekly-share broadcast that Relay's Announcement category was designed to support in the first place (ADR-090/091). Some traffic genuinely is "here's an update, no action needed, no reply expected" — collapsing that into a receipt obligation would force either noisy compliance-`👀`s or systematic non-compliance, neither of which is better than today's honest opt-out.

**(ii) Content-required ACK via length gates.** An alternative tried to make an ACK prove more than awareness — e.g. requiring a comment of some minimum length instead of, or alongside, `👀` — on the theory that a bare reaction is too cheap a signal. Rejected: this is a textbook Goodhart failure. A length gate buys characters, not substance — recipients pad a comment to clear the bar without actually engaging any more than a `👀` would have shown. The case that genuinely wants response *content* — an opinion, a decision, information — was already correctly served by a different native shape: Q&A, whose obligation is an answer the initiator explicitly accepts, not a mechanically-measured reaction. `report/SKILL.md` now states this routing rule directly: if what you want back is content, it isn't an ACK.

**(iii) Status quo: optional `👀`, no default.** Leaving the pre-097 opt-in model in place — explicit `[ACK]` marker required, single first-mention recipient, no close-nudge — was the default outcome of doing nothing. Rejected because it left exactly the gap this ADR closes: an initiator naming several people got no obligation and no completion signal for any of them unless they remembered the `[ACK]` marker, and even then only the first-named person was ever actually on the hook. The disproportionate-machinery complaint (two overlapping mechanisms, one of them silent by default) does not resolve itself by leaving both in place.

## Accepted limit: signal debasement

Receipt-default is not free of risk. Forcing awareness receipts by default, rather than by explicit opt-in, can degrade `👀` toward reflex over time — a recipient trains themselves to react without reading, the same way an email "read receipt" becomes a Pavlovian click rather than a genuine attestation. This is an accepted limit, not a solved problem: ADR-091's boundary still holds exactly as stated — `👀` attests awareness only, never comprehension, acceptance, or external work, and Relay makes no claim otherwise. Making the receipt *owed* by default does not change what a completed receipt actually proves; it only changes whether the obligation is visible before the reaction happens. A second accepted limit follows directly from making this the default rather than opt-in: any `@mention` in the title or body of a wild (non-`fyi`) Discussion mints a real, individually-owed receipt for that account, whether or not the author meant to hand out an obligation — a habit of casual mentions ("cc a few people just in case") now produces real obligation-spam, not a harmless ping. Authors must mention deliberately under receipt-default; a bystander who shouldn't owe anything belongs on an `fyi`-labeled Announcement instead (see `report/SKILL.md`'s routing refinement).

## What this does NOT change

- **No obligation change to FYI.** An `fyi`-labeled Announcement remains obligation-free under every reading — the opt-out is unconditional, not merely the pre-097 default flipped in the other direction.
- **No Q&A change.** Q&A's native `isAnswerable`/`isAnswered` obligation path (ADR-093) is untouched; `isAnswerable === true` continues to exclude a Discussion from Announcements-tier detection entirely.
- **No ACK completion semantics change.** A receipt still completes only by its own owner's own `👀` — ADR-091's "designated recipient" reading generalizes to "each named recipient," it is not replaced by some new completion signal.
- **No PR/Issue behavior change.** `announcementRecipients` only ever applies to Discussions; the PR review-obligation invariant (ADR-093) and Issue assignment are untouched.
- **No schema version bump.** `digest`'s `schemaVersion` stays at 3 — this is new obligation *volume* (more receipts fire by default) and one new SETTLE action (`close-announcement`), not a new output shape.

## Reducer change

- `designatedAckRecipient()` (first-mention-wins, single recipient) is removed. `isAnnouncementDiscussion(object)` decides whether a Discussion is Announcements-tier (non-`fyi`, non-answerable, and either an `[ACK]`/`ack-required` marker or a title/body `@mention`); `announcementRecipients(object)` returns every distinct title/body-mentioned account for a Discussion that qualifies, `[]` otherwise.
- The per-viewer obligation loop replaces the single-recipient ACK check with `recipients.some(...)`, so each named account gets its own `ACK` obligation (`announcement-receipt-missing`, action `add-eyes-reaction`) independent of the others.
- A new close-nudge block: when the current viewer is the Discussion's author, at least one recipient is named, and every recipient's own `👀` is present, a `SETTLE close-announcement` obligation (reason `receipts-collected`) is recorded.
- `hasFormalSignal()` now checks `announcementRecipients(object)` instead of the old single designated recipient, so every named recipient (not just one) is correctly excluded from the notices tier regardless of completion state (ADR-090's original noise-suppression intent, now correctly scoped to everyone actually named, not just the first).
- `compute-state.test.mjs` grew from 66 to 69: three pre-existing tests were updated in place because their premise ("mention-only, no obligation," "the first mention wins, later mentions are ignored," "an uninvolved mentioned Discussion party gets only a notice") is now literally false for a plain Discussion mention — each was rewritten with a comment explaining the ADR-097 supersession, and the third was moved onto an Issue fixture (unaffected by receipt-default) to keep testing the underlying formal-signal-isn't-blanket principle it was written for. Three new tests cover: a multi-recipient announcement clearing per-recipient (one reacting does not clear the other's); the close-nudge firing once every recipient has reacted; and a comment-borne mention never creating a receipt obligation (wild traffic stays on the notice tier). All 69 green.

## Consequences

- `plugins/relay/skills/report/SKILL.md` — the Announcement router refinement now states receipt-default plus the close-nudge, and gains the new "content wanted, not just receipt → Q&A" routing rule.
- `plugins/relay/skills/digest/SKILL.md` — the obligation contract states multi-recipient receipt-default and the close-nudge; the notices section states its narrowed wild-traffic-only scope.
- `plugins/relay/skills/reply/SKILL.md` — states that your own `👀` completes only your own receipt, never another named recipient's.
- `plugins/relay/skills/settle/SKILL.md` — states that closing a receipt-bearing Announcement needs no resolution comment, same as FYI, once the close-nudge fires.
- `plugins/relay/CLAUDE.md` — the lifecycle matrix's old "FYI" and "Awareness ACK" rows are replaced by two rows: a receipt-default "Announcement" row and a narrower "FYI" opt-out row, keeping the Owner column single-meaning (obligation-owner) per ADR-096's fable-flagged fix; the obligations-and-authority bullets and the obligations-versus-notices paragraph both restate the receipt-default rule.
- `plugins/relay/skills/launch/references/templates/DISCUSSION_TEMPLATE/announcements.yml` — the Recipients field description states the receipt-default rule and the `fyi`-label opt-out.
- `docs/adr/096-relay-closure-semantics.md` — amended (not rewritten): its FYI-closure description is scoped to the narrower `fyi`-labeled case; its "No ACK lifecycle change" consequence is marked superseded.
- `docs/design/relay.md` — the closure-semantics paragraph and lifecycle matrix gain the receipt-default distinction; a new changelog line records this ADR.
- `relay` stays `1.4.0` — this ships in the same 1.4.0 unit as ADR-096; no separate version bump for this delta.
- No new GitHub object type, schema field, or daily verb. The daily verb set stays `launch · report · digest · reply · brief · settle` plus explicit-only `migrate`.
