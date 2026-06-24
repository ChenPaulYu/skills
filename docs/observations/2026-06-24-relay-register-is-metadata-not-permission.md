---
date: 2026-06-24
status: raw
---

# registering someone in relay (identity or role) is shared metadata, not a permission grant — so an owner may register others; the only fact that must come from the person is their git resolver email

> **TL;DR**: Users reach for the Slack/GitHub mental model ("the owner adds members; members accept an invite") and ask "should I register my boss, or wait for him to do it himself?" relay isn't that. `relay.yml`/`project.yml` are an address book, not an access gate — roles are routing defaults, not locks (only `settle` is owner-gated). So anyone may register anyone; nothing needs the registree's consent to take effect. The *one* thing that genuinely must come from the person is the **git resolver email** (it must match their commit author, or resolution silently fails) — and a handle freezes on first write. `/relay:register` should say this, to preempt the recurring "self-register vs register-for-them" question.

## What prompted it

In one session the "should they do it themselves?" question came up **twice** — once registering a CEO into the roster, once assigning him a project role. Both times the honest answer was the same and not obvious from the skill text.

## The signal

Two things get conflated and should be separated in the skill:

1. **Permission** — registering grants nothing and gates nothing (roles are defaults; `settle` is the only owner-gated act). So there's no "only the owner/the person may do this."
2. **Data accuracy** — the value of a registration is correct resolution, keyed on the person's *commit* email. That email (and how they want their frozen handle/name shown) is the only input that must come from them. A shared inbox (`hello@…`) as a resolver is a smell: it collides across people.

So "can I register my boss?" → yes, freely (it's metadata). "Should I?" → only if you know his real commit email; otherwise you bake in a wrong resolver + a frozen handle he didn't choose.

## Evidence so far

- **Only case (2026-06-24, relay onboarding)**: the same governance question fired twice in one onboarding; a one-line skill note would have answered both up front. A `hello@`-style shared inbox was nearly committed as a resolver key.

(One case but high recurrence-within-case → stays `raw`; promote on the next onboarding that re-asks it.)

## Links

- Feeds [ADR-050](docs/adr/050-relay-plugin.md). Skill: `/relay:register` (identity-gathering + who-may-register).
