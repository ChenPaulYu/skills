# ADR 098 — Relay routes pre-owner convergence talk to Discussions (upstream nursery)

**Status**: accepted
**Date**: 2026-07-22
**Refines**: [ADR-090](docs/adr/090-relay-github-native.md), [ADR-096](docs/adr/096-relay-closure-semantics.md)

## Context

The user observed a routing inversion in real repository traffic: convergence-talk — "should we do X," "what's the right shape for Y," open-ended exploration — had been pulled almost entirely into Issues, because Relay's obligation model requires a stated assignee and completion rule to produce any signal in `digest` at all. An idea with no owner yet, routed to an Issue anyway just to have *somewhere* to put it, sat obligation-free and invisible — worse than useless, since an Issue's whole native promise is "someone owes this." The practical effect: Discussions' official upstream role sat vacant. This is not merely a Relay-internal drift; it inverts GitHub's own stated design for the two object types — Discussions exist for developing and prioritizing ideas *before* an Issue is created, while Issues exist for actionable, trackable work with an owner. Relay's router (ADR-090, restated in `plugins/relay/CLAUDE.md`) already asked "is there a clear completion condition?" and "is one person accountable?", answering "no" to either with "use a Discussion" — but nothing made that boundary an explicit, nameable test, and nothing described the two-way path (Discussion → graduate to Issue, linked back) that real convergence work actually needs.

## Decision

**The routing boundary is: can you state an owner and a completion rule yet?**

- **Not yet** — still diverging, unclear whether or what to do — routes to a **Discussion**: Ideas for open-ended exploration, Q&A when there's a specific question with an accepted-answer completion condition. Nobody owing work here is a **feature**, not a gap: a Discussion is Relay's nursery for convergence, exactly matching GitHub's own purpose for the object type.
- **Once an owner and a completion rule can be stated**, open the Issue and link back to the originating Discussion. GitHub's own create-issue-from-discussion affordance preserves that lineage natively — no separate Relay bookkeeping needed.
- **Born-crisp exemption.** An ask that arrives already knowing its owner and its completion rule may open the Issue directly. The two-stage Discussion → Issue path is never mandatory ceremony; it exists for asks that genuinely need to converge first, not as a gate every Issue must pass through regardless of how obvious it already is.

**The smell this rule names and kills:** an Issue where nobody can say what "done" looks like. That Issue should have been a Discussion — either it never had a real owner in the first place, or its completion rule was never actually settled, and routing it to an Issue anyway just hid the fact that nothing was actually ready to be tracked as work.

## Rejected

**Mandatory two-stage routing for everything.** Requiring every Issue to originate from a Discussion, with no born-crisp exemption, was considered and rejected: it is ceremony at `n=1`. Most real asks — "fix this bug," "review this diff," "add this field" — already know their owner and their completion rule the moment they're written down; forcing them through a Discussion first adds a mandatory extra round-trip with no convergence to actually do. The two-stage path earns its cost only when convergence is genuinely needed, which the owner-and-completion-rule test already detects without a blanket rule.

## Consequences

- `plugins/relay/skills/report/SKILL.md` states the upstream-nursery boundary test, the graduation link-back, the born-crisp exemption, and the named smell, as a router-level paragraph (not a single object-type refinement bullet, since it governs the choice between Discussion and Issue itself).
- `plugins/relay/CLAUDE.md`'s router paragraph gains the same boundary test, stated once as plugin-wide law.
- `docs/design/relay.md`'s object-routing section gains one clause naming the nursery role and the graduation path.
- No reducer, schema, or obligation-contract change: this is a routing-guidance ADR, not a `digest` signal. `compute-state.test.mjs` stays at 69/69, untouched.
- No new GitHub object type, label, or daily verb. The daily verb set stays `launch · report · digest · reply · brief · settle` plus explicit-only `migrate`.
