---
date: 2026-06-15
status: raw
---

# Placing a new capability is a 3-question cascade — object → value-guardrail → distribution — and "lives in git" is a different axis from "is a distributable plugin"

> Source: this session — the user felt `think` was "too narrow" when wanting to add `easy-explain` and `record/observe`, and we converged on where each actually belongs.

## What prompted it

A capability felt homeless ("does this go in `think`? is `think` too narrow?"). The instinct to *widen an existing plugin to adopt a newcomer* is the trap. The real question was never the plugin's name — it was **the marketplace's organizing axis**, and that axis answers placement deterministically.

## The signal — the cascade

Run a new capability through three questions, in order. Each can stop the line.

1. **Object** — *what does it operate on?* The marketplace is partitioned by **object**, not by action: `nav` = existing code · `shape` = a product's forward-motion/decisions · `research` = external documents · `think` = your own reasoning about a problem. A capability whose object matches none of them does **not** fold into the nearest one — forcing it in is cross-object contamination (it muddies that plugin's `description` → triggering degrades → grab-bag, the exact thing the marketplace guards against). It's a **new-family signal**, not evidence the nearest plugin is "too narrow."
2. **Value-guardrail** (ADR-034) — *does it force a structure the default would skip?* If not, it isn't a skill — it's a **style/config** (already covered elsewhere) or a **tool**. This kills candidates before they get a home.
3. **Distribution & use-location** — only for what survives 1+2. Two conflations to avoid:
   - **"lives in git" ≠ "is a distributable plugin."** What gets distributed is *only* what's registered under `plugins/` in `marketplace.json`; everything else in the repo (scripts, hooks, `.claude/commands/`) is in git and travels by **clone/fork**, but is never **installed** into a consumer's project. Two different channels.
   - **the tool's home ≠ its data's home.** A capability's *implementation* can be personal/local while its *output* lands in a central, version-controlled knowledge base. One owner each (rule ①).
   - **use-location decides the form**: a thing used only *inside* one repo → a project command (`.claude/commands/`, travels with that repo); a thing fired from *any* project → a global command (`~/.claude/commands/`, available everywhere but not carried by any one repo). A command must run **in the session where the signal occurred** — so where the signal occurs picks the form.

## How it played out (the worked example)

- **`think` stays narrow, not renamed** — its object (your own reasoning) is fixed; the homeless newcomers were the signal, not its narrowness.
- **`easy-explain` → not a skill** — fails the value-guardrail (the model already explains simply; a global style rule already mandates it). It's a *style*.
- **`record/observe` → a real capability, but a personal global command, not a plugin and not a `nav`/`shape` capability** — its object ("a work session → a durable meta-learning") matches no existing plugin; its *use-location* is *other* projects (learnings surface while dogfooding elsewhere), so it must be a **global** command, not a project one; the **tool** lives in personal config while its **data** (the observation) lands in the skills repo's central `docs/observations/`. ("Make it a `nav`/`shape` capability to ride their distribution" is the wrong fix to a real need — distribution convenience doesn't justify breaking the object boundary.)

## Evidence so far

- **Only case (2026-06-15, this marketplace session)**: the cascade was derived live and applied to three concrete candidates (`think` rename · `easy-explain` · `record/observe`); it produced a clean, non-arbitrary verdict for each. Relates to [ADR-005](docs/adr/005-marketplace-plus-plugin-restructure.md) (marketplace/plugin split), [ADR-027](docs/adr/027-research-plugin.md) (research vs think split *by object* — the precedent the object-axis generalizes), [ADR-034](docs/adr/034-think-plugin.md) (the value-guardrail), [ADR-018](docs/adr/018-promotion-gate-is-evidence-not-session-count.md) (evidence-gated promotion).

(One case → stays `raw`. **Trip-wire**: if a second placement question gets answered cleanly by the same object → guardrail → distribution cascade, that's the signal to promote this into an ADR that codifies the test — a reusable "where does a capability go?" checklist for the marketplace.)
