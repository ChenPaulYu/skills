# retrace — neighbor boundaries, anti-patterns

> Moved verbatim from the pre-ADR-109 SKILL.md body. The SKILL.md description carries the
> compact NOT-boundary; this is the full per-neighbor table plus the complete refuse-these
> table, loaded on demand.

## Boundaries

| Neighbor | Boundary |
|---|---|
| Plain recap | Lists what happened in order. Use no skill for that. Retrace exists only when causal re-entry and a concrete artifact are needed. |
| `reflect-catchup` | Reports the present cursor: goal, done, now, open, next. Retrace reconstructs the full pressure-bearing path. |
| `nav-tour` | Builds a corrected model of the current codebase. Retrace explains development causality across decisions, probes, implementations, and artifacts. |
| Planned `reflect-retro` | Evaluates where the process went wrong and prescribes a process change. Retrace explains neutrally. |
| `shape-mockup` | Renders disposable candidates to decide a future shape. Retrace renders a durable account of an already-lived arc. |
| `shape-align` / `shape-elicit` | Decide priorities or principles. Retrace only exposes the current boundary and unresolved questions. |

## Anti-patterns

| Temptation | Instead — and the tell |
|---|---|
| Turn git log into a timeline | Reconstruct pressure-bearing stages. Tell: removing the dates leaves no explanation of why the next stage happened. |
| Invent a smooth bridge | Label Inferred/Unknown and ask at the outline gate. Tell: "we chose X because Y" has no decision source or user confirmation. |
| Treat current code as original intent | Separate shipped state from recorded rationale. Tell: a source file is the only citation for a historical "why." |
| Merge unrelated threads because they were adjacent | Split or branch the arc. Tell: the decision in stage N does not respond to its stated pressure. |
| Conflate decided with shipped | Show exact status. Tell: a thought or conversation is cited as implementation evidence. |
| Render before the user checks the outline | Stop at Step 3. Tell: polishing HTML while stage boundaries are still inferred. |
| Use abstract prose where a witness exists | Put the real shape, command, metric, or media beside the claim. Tell: the reader must trust "this was hard/broken/different." |
| Add decorative interactivity | Make each control reveal evidence or remove it. Tell: clicking changes color but not understanding. |
| Store the output under mockups by habit | Use a retrace/artifact home. Tell: a historical alignment record is about to enter a disposable decision-candidate lifecycle. |
| Turn the ending into a roadmap decision | State the boundary and stop. Tell: the artifact begins prioritizing unresolved work. |
