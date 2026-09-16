# Engine — docs-render (human-facing surface navigability)

> The check-and-fix procedure for `nav-sync`'s docs leg. Read a repo's hand-maintained human-facing docs (README, CHANGELOG, install guides — whatever the repo has), find the factual claims they make, ground each claim against its real source in the repo, and report any drift with a gated diff to fix it. On-demand only — run it when asked, never as a background sweep.

## What this phase produces

A README goes stale the same way a file header does: someone adds a feature, renames a thing, bumps a version — and forgets the doc that describes it. Unlike a header (one file, one owner, checked every time that file changes), a README describes *many* facts scattered across the repo, so nobody remembers to re-check it on every relevant change. This leg is the check that closes that gap **when you ask for it** — it does not try to catch every drift automatically (see Scope).

## Scope

**Language- and repo-agnostic.** The pattern is: *doc claim → ground truth → diff*. What counts as a "claim" and a "ground truth" varies by repo, so this leg works in two tiers:

### Tier 1 — repo declares its own gate (follow verbatim)

Some repos document, in their own AGENTS.md (or equivalent), exactly which doc(s) must stay in sync with exactly which source(s) — a hard gate a human already wrote down because they got burned by drift once. When one exists: **read it and follow it verbatim.** Don't invent your own checklist on top of a more specific one that's already there.

Example instance (this marketplace's own AGENTS.md, gate #3 — "Human-facing surfaces are gating"): `README.md`'s plugin table + per-plugin skills list + install commands must match the current plugin/skill roster (`plugins/*/.claude-plugin/plugin.json`, `plugins/*/skills/*/SKILL.md`) in the same commit as any roster change. When running this leg against a repo that has such a gate, that gate's own enumerated checklist **is** the check — walk it item by item.

### Tier 2 — no declared gate (universal fallback)

When the repo's AGENTS.md (or README itself) doesn't name an explicit doc-consistency gate, fall back to universal checks — the kinds of claims almost any README makes:

| Claim kind | Ground truth to check against |
|---|---|
| Version number(s) mentioned in prose | The package/plugin manifest (`package.json`, `plugin.json`, `Cargo.toml`, …) |
| A feature / component / skill / endpoint roster or table | The actual directory listing or registry (source folders, plugin dirs, route definitions) |
| Install / setup commands | Whether the named scripts/commands still exist (`package.json` scripts, Makefile targets, CLI entry points) |
| Internal links (to other docs, anchors, files) | Whether the target still exists at that path |
| "N things" counts (e.g. "5 plugins", "12 endpoints") | A count of the actual items |

**Self-report which tier you read from** (tolerant-reader convention, ADR-071) — say plainly "this repo has a documented gate, I followed it" or "no documented gate, ran the universal checklist" so the user can judge how much to trust the result.

## Generation process

### Step 1 — Find the declared gate, if any

```bash
grep -n -i "gate\|README.*sync\|README.*up to date\|README.*current" AGENTS.md 2>/dev/null
```

Read any hit's full section. If it names specific docs + specific facts + specific sources: that's Tier 1, use it as the checklist for Step 2 onward. Otherwise: Tier 2.

### Step 2 — Enumerate ground truth

For each fact kind in scope (from the Tier 1 gate, or the Tier 2 table): gather the actual current values from their real source.

```bash
# Example (Tier 2, roster-style claim):
find plugins -maxdepth 1 -type d | sort                       # actual plugin list
cat plugins/*/.claude-plugin/plugin.json | grep -E '"name"|"version"'  # actual versions
find plugins/<name>/skills -maxdepth 1 -type d | sort          # actual skill list for a plugin
```

Never derive ground truth from another doc — a second doc restating the same fact is exactly the leakage this check exists to catch, not a valid source.

### Step 3 — Read the doc's current claims

Read the target doc (usually README.md) in full. For each claim in scope, note what it currently says (line number + text).

### Step 4 — Diff claim vs. ground truth

For each claim: does it match? If not:
- **Missing** — ground truth has an item the doc doesn't mention (a skill/plugin/feature added, never documented)
- **Stale** — the doc mentions an item whose stated fact (version, description, path) no longer matches
- **Orphaned** — the doc mentions something that no longer exists (renamed, removed, retired)

### Step 5 — Show diff before applying

Same gate as the header leg: propose the doc edit as a diff (which lines change, old → new), and wait for the user's OK before writing — unless the user's invocation already signaled "just fix it." Never silently patch a human-facing doc.

### Step 6 — Apply + report

Apply the confirmed edits. Report: which tier was used (declared gate vs. universal fallback), what was checked, what drifted, what was fixed, what was skipped and why (e.g. "no evidence establishing whether X still applies — left alone, flagged for you").

## Discipline (do not skip)

- **Ground every claim.** No fact gets asserted as "drifted" without checking a real source — never guess, never infer from a doc's own internal consistency.
- **Never treat one doc as another doc's ground truth.** Two docs agreeing with each other proves nothing; both could be stale together. Always trace to the manifest/directory/code.
- **Tier 1 beats Tier 2.** A repo's own declared gate is more specific than the universal checklist — follow it verbatim rather than layering a generic check on top.
- **Diff-gated, always.** Same as headers — a doc is read by humans; show the change before it lands.
- **Ground drift in evidence.** If the governing source remains ambiguous, ask before changing the claim (rule ⑦).
- **On-demand only.** This leg does not run automatically after every code change — it runs when the user asks whether a doc is current. Don't fold it into the header leg's continuous cadence.

## The 8 rules (the through-line of every nav skill)

1. **Deep modules through information hiding** — a simple interface hiding significant complexity. *Applied here:* a fact (a version, a roster) should have exactly one owning source; a doc that restates it is a derived view, and two derived views drifting apart is **information leakage** made visible.
2. **Interface-first at every scale** — the doc IS the interface a human reads first; this leg keeps that interface honest without demanding the human re-derive it from the code.
3. **Explicit dependencies** — every claim this leg checks has an explicit, named ground-truth source; it never depends on an inferred or ambient "should be."
4. **Right grain** — don't invent a Tier-1-style rigid checklist for a repo that never asked for one; use the lighter Tier 2 fallback and say so.
5. **Fit the framework** — read whatever consistency convention the repo already declared (AGENTS.md, a linter, a doc-gate script) rather than imposing an external one.
6. **Rearrange, don't rewrite** — a fix patches the drifted fact in place; it doesn't restructure the doc's prose (that's `nav-compose`'s job).
7. **Resolve consequential uncertainty** — inspect evidence first; ask when missing intent or authority would change scope, behavior, compatibility, or a material trade-off. Label unsupported claims rather than presenting guesses as facts.
8. **Agent-navigability is the audit** — struggling to find *any* ground truth for a claim (no manifest, no registry, nothing to check against) is itself a signal: that fact has no single owner in this repo, which is the rule ① smell this leg exists to surface.

## Anti-patterns (refuse these)

| Temptation | Instead — and the tell |
|---|---|
| Invent a bespoke checklist when the repo already documents one | Read the repo's own gate and follow it verbatim — don't duplicate or diverge from a more specific rule that already exists. Tell: about to write your own "things to check" list without first grepping AGENTS.md for one. |
| Cross-check one doc against another doc | Trace to the real source (manifest, directory, code) — two docs agreeing proves nothing. Tell: citing README to justify a claim about the site map, or vice versa. |
| Auto-apply the fix | Show the diff, wait for OK — same gate as headers, because this leg mutates a human-facing file. Tell: about to write to README before the user has seen the proposed change. |
| Run this leg after every small code change | Save it for on-demand ("is the README current?") — this is not the header leg's continuous cadence. Tell: reaching for the docs leg right after a one-line code edit nobody asked you to document. |
| Restructure the doc's prose while fixing a stale fact | Patch the fact in place; route a real restructure to `nav-compose`. Tell: the diff changes sentence order/structure, not just the drifted value. |
