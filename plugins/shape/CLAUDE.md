# shape — plugin maintainer guide

Shape turns intent into findable decisions, evidence and task-owned work. Nav owns
implementation, code health and landing. Read an individual SKILL.md to run that verb.

## Nine entrances

- setup explicitly connects a code repository to its selected workspace; reuses identity and verifies the read path without environment scaffolding or legacy migration.
- idea saves an independent spark without authorizing implementation.
- elicit clarifies an undecided question; idea capture is not elicitation.
- mockup converges a choice through an interactive artifact.
- probe tests an undecided claim with a minimal experiment.
- dogfood uses built behavior to find reproducible friction.
- status reconstructs work and, only on explicit request, helps set priorities.
- wrap saves progress/reasons/next actions in the original tasks.
- tidy reconciles stale or redundant records while preserving useful reasons/recovery.

Align, park and catchup are retired by ADR-146. Their priority, reconstruction and
reason-preservation capabilities survive in status/wrap; legacy data is not deleted.
Setup returns with the workspace-only role in ADR-148; the old environment scaffolder
remains retired. Init, migrate, build and doctor remain retired entrances. Historical
rationale stays in ADRs, not live instructions that summon retired verbs.

## Record ownership

`plugins/shape/references/workspace-records.md` owns typed layout and lifecycle;
`plugins/shape/references/record-interface.md` owns metadata, dates, Relations and
progressive disclosure. The shared-resource builder bundles them into consumers.
Project.md owns context/repository mappings/curated priorities; original tasks own
progress, verification and next actions. State and graphs derive from records;
Git owns committed revisions. No duplicate board, index.md, state.md or handoff.

Shape status scripts own the reader, explicit graph export, renderer and template.
Related record consumers carry generated standalone copies. A home repository
owns private records, not another parser. HTML is an on-demand read-only snapshot,
not an editor or the authority for decisions. Explicit output is outside the home
repo and never overwrites an existing file. Read helpers are optional; report fallback.
The reader's `review` projection supplies both agent and human review candidates;
unverified, unlinked or superseded are signals to inspect, never deletion verdicts.
Exports include one project unless `--all-projects` is explicitly requested.

## Legacy projects and maintenance

Status reads existing boards/handoffs tolerantly and reports the evidence tier.
Its legacy-blueprints/priorities references preserve old conventions; tidy owns the
manual migration ledger. Workspace mappings take precedence, and no ordinary
read/save automatically migrates or discards old data. Priority changes require
user authority; read-only status never silently updates records.

The selected home owns working records and retained artifacts together; product code
and runtime fixtures stay in their code repositories. Development-artifacts owns retention/recovery policy. Mockup owns comparison;
tidy owns retirement after settled choice, useful residue and inbound links are
accounted for. A task closing does not erase an adopted thought or inconclusive probe.

## Seams and execution

Shape converges intent; nav-plan grounds implementation; nav-do/refactor implement;
wrap saves the touched task; status reconstructs the next round. Nav remains
standalone: cross-skill recommendations are soft, bundled references self-contained.
No skill calls another skill's runtime. Planning/judgment/acceptance stay on the
session model; scoped execution follows the marketplace dispatch tier policy.
No whole-turn mechanical override exists in Shape. Live-provider cost/authorization
checks in probe/dogfood still apply independently of executor model cost.

## Artifact interface

Lead with a short conclusion, visible Relations and details only as needed. Mockup
HTML points at one canonical decision card; variants share it. Read the user's UI
preferences and project design canon before UI work. Use real data/relations and
activate artifacts with a URL. No fake graph, completion percentage or selected variant.

## browser-verify — a shared per-project capability slot

`mockup` is the slot's one live consumer since `build`'s verify-against-mockup step retired (ADR-110) — but only *opt-in*, when there's a concrete reason to distrust a render sight-unseen (ADR-124: dispatching it to confirm every routine render cost tokens for no decision-relevant signal). It stays a shared, pluggable capability rather than mockup-specific code, since a future re-entrant orchestrator would need the same slot (N+1 trigger, in reverse):

- **Default implementation: `agent-browser`** (vercel-labs/agent-browser) — a browser-automation CLI. Detect: `which agent-browser`. Usage: `agent-browser open <url>` → `agent-browser screenshot <file>.png`; `snapshot -i` / `click @e` / `fill @e "..."` to interact.
- **Desktop targets: `agent-desktop`** — a native app (Tauri, Electron, OS-native) has no URL for a browser to open, so the slot drives it through the OS accessibility tree instead. Detect: `which agent-desktop`, then `agent-desktop status` (macOS needs Accessibility + Screen Recording permission; `agent-desktop permissions --guide` fixes a denial). Usage: `agent-desktop snapshot --app "<App>" -i --compact` → `click @ref` / `set-value @ref "..."` → `agent-desktop screenshot`. Same contract as the browser default: capture at decision points, and leave the app as the user had it.
- **Don't hardcode the tool — name the capability.** A skill describes the contract ("open the running feature → screenshot → compare to mockup → **close when done**"); `agent-browser` is the named **default**, not the contract. The close is *part of* the contract, not optional cleanup: an unclosed headless browser silently burns a core after the pass returns, and the cost lands on the user's machine — invisible from inside the loop, so it has to be in the contract, not left to judgment (trap #3). Caveat: this written contract is *polled* knowledge, not a *cue* — it fires only if the executing path actually walks it. So bind the close where open *executes*: write each verify step so its last move is `close` (a walked step is a cue, a reference doc is not), and lean on a turn-end browser reaper as the cross-path backstop. The doc raises the odds it's in-context; it does not make it fire.
- **If the default tool is missing**, use an available project-bound equivalent that can provide the required evidence. If none is available, report the blocked check and its effect on confidence. Ask only for missing installation authority or a consequential scope choice; reuse existing authorization and do not require a fixed menu. A skipped check remains explicitly unverified.
- **Per-project override:** a project may bind a different helper (Playwright, puppeteer) in its own CLAUDE.md; the agent reads that. Absent an override, the default is agent-browser.
- **Skills don't call skills:** name the capability + describe the contract; the executing agent invokes the tool (CLI shell-out, or triggers the agent-browser skill in its own turn).
- **Delegate the pass to the `browser-verifier` subagent — the cost tier (ADR-058).** The slot's default *executor* is the plugin's [`agents/browser-verifier.md`](plugins/shape/agents/browser-verifier.md) (model: sonnet). The caller injects URL · screenshot destination · expectation (mockup path or stated behaviour) · any interaction steps / tool override, and receives back a compact verdict (`PASS | DRIFT | BLOCKED | MISSING-TOOL` + reason + paths) — the drive-and-capture loop and its **image tokens stay in the subagent's context**, never entering the main conversation (where every screenshot is re-paid on every later turn). Delegate whenever the pass is mechanical and actually invoked (mockup's slot is opt-in, ADR-124 — a handfeel/gesture verify or an explicit user request, not a routine render); drive inline only when the user is being walked through the page live. The close-contract binds inside the subagent — its last move is `close`. Ships with the plugin, so it works on any machine that installed shape.
- **Verify economy — capture at decision points, not per step, and not by default.** A screenshot is *evidence* (a pick's record, friction-evidence), never a progress note: `dogfood` screenshots at friction/gap moments and records video **only on explicit request**; `mockup` doesn't invoke the slot at all for a routine render (ADR-124) — activation + a clickable link *is* the confirmation — and confirms at most once, never per iteration, on the rare occasion it's actually invoked (a board snapshot included). Screenshots live on disk (report/mockups tree) — referenced by path, not pasted into the chat.
- **Known traps:** the slot's field manual ([`references/browser-verify-gotchas.md`](plugins/shape/references/browser-verify-gotchas.md)) is organized by scope — **universal** (session isolation · assert state-not-text · measure-before-toggle · selector-over-pixel clicks · poll-don't-snapshot · rule-out-mock-data · daemon-reset · teardown/`close` with its knowledge≠trigger cue-ladder + provenance-keyed reaper), **audio** (dual-backend mute · real-input for user-activation), **transform-canvas** (`position:fixed` → portal to body), and **React+Vite** (controlled-input native-setter, HMR console ghosts). Read before trusting a screenshot or console scan, and `close` the browser when the pass ends.
