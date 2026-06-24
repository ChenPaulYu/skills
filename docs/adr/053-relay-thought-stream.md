# ADR 053 — relay collapses to a thought-stream: report → review, no consensus protocol

**Status**: accepted
**Date**: 2026-06-24
**Supersedes**: [ADR-052](docs/adr/052-relay-three-kinds.md) (the three `kind`s + per-kind digest); **refines** [ADR-050](docs/adr/050-relay-plugin.md) (the consensus mechanic)

## Context

ADR-050 built relay around **multi-party consensus**: a `[D]`'s `@`-set graduates to `decisions/` when everyone accepts. ADR-052 (same day) added three `kind`s — discuss / converge / sync — with per-kind digest sections. Dogfooding the actual usage revealed both are over-engineered for the real pattern: **1–2 people, progress-report-centric, little discussion**. The dominant loop is **report → review** (a progress update, or an occasional alignment briefing, that the counterpart reviews) — not multi-party convergence.

## Decision

**Collapse relay to a thought-stream.** There is **one entry type — a thought** (`thoughts/<date>-<handle>-<slug>.md`); `report` opens one, `review` answers one. The three kinds, the `@`-set consensus protocol, and the `decisions/` graduation are all retired.

- **report** — write a thought. One flexible shape (subject + body): *progress* (short — done · doing · next · `@`-flag what needs the counterpart) or *alignment* (longer — a briefing that brings someone's mental model up to date). Tone, not a `kind` field.
- **review** (renamed from `reply`) — respond to a thought with `agree` / `comment` / `change`, **linking** the answered thought by id (markdown link, not id-matching). With 1–2 people **the review resolves it**; no `@`-set, no graduation.
- **digest** — one thing: "what's waiting for my review" (thoughts that `@`-mention you and you haven't answered). The per-kind sections are gone.
- **settle** — **re-positioned from "owner hygiene" to "沉澱"**: crystallize the running stream into a durable `index.md` snapshot (`## Where things stand` + `## Decisions (pinned)`) and archive the settled thoughts. A **decision is just a thought that got an agreeing review** — settle *pins* it; there is no separate `decisions/` file. Settle runs **lazily** — clean when it's worth cleaning, not eagerly.
- **launch / register** — unchanged (structure), minus the `decisions/` scaffold dir.

The marketplace stays six relay verbs (launch · register · report · review · digest · settle); relay → `0.2.0`.

## Why retire so much, so soon

The three kinds + consensus protocol were the right *general* design and the wrong *fit*. A 1–2 person progress loop needs a low-ceremony log + a review, not a convergence engine — and a simple tool that's used beats an elaborate one that isn't. The one durable insight from ADR-052 survives: **progress vs alignment** is a real distinction — but it's a *tone* the author flexes (short vs briefing-length), not a frontmatter `kind` the protocol enforces.

## Consequences

- **Retired**: the `kind` field; the `@`-set/graduation consensus (ADR-050 §Consensus → §Resolution); `decisions/` files; `skills/reply/scripts/check-acceptance.mjs` (the consensus gate); the per-kind digest sections.
- **Renamed**: `reply` → `review` (skill dir, registration, codex mirror, manifests regenerated).
- **Format contract** (`plugins/relay/CLAUDE.md`) rewritten: one thought type, `re:` link, `index.md` carries the pinned decisions, no `decisions/`.
- **Observations** [[relay-conflates-converge-sync-discuss]] / [[sync-is-distilled-state-not-worklog]] remain as the raw record of the reasoning that led here (status: raw); this ADR is where it landed.
- **Codex/manifests**: `node scripts/build-manifests.mjs` + `build-codex.mjs` regenerated (relay-review replaces relay-reply); validator green.

## Out of scope

- **Multi-party consensus** — if relay ever needs >2-party ratification again, that's a new ADR re-introducing an `@`-set gate, not a revert of this.
