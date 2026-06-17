---
date: 2026-06-17
status: raw
---

# To retire a wide legacy API surface that is also an internal call target, gate the deprecation on the caller's module — don't rewrite the call graph

> Source: the API-improvement coda of the brownfield nav conversion ([[brownfield-to-nav-deep-module-is-a-campaign]]) — declaring ~5 sub-APIs canonical and deprecating ~100 legacy flat methods without breaking external consumers.

## What prompted it

After the refactor, the public surface was two things bolted together: a narrow, good sub-API facade (the deep module) and ~100 wide, untyped legacy flat methods (the smell). The goal was to mark the flat methods deprecated with a *runtime* `DeprecationWarning`. The obvious implementation — decorate each flat method — looked simple, then wasn't.

## The signal

**In a layered codebase a public method is often BOTH the external API and an internal call target, so a naïve runtime deprecation fires on the recommended path too.** The recommended facade (`toolkit.get.video()`) and the services route their cross-domain calls *through* the very flat methods being deprecated. Decorating those methods makes "the user did it right" emit a warning — wrong signal.

The instinct was to fix it structurally: re-route the facade and services to call the service layer directly, freeing the flat methods to be pure external shims. **Estimating that rewrite from one layer badly undercounts the blast radius** — it looked like ~67 facade call-sites; the services added ~45 more cross-domain callbacks (≈112 total), and it broke 8 tests that mocked at the api-method seam, and would break any *external* consumer who mocks api methods. That is a rule-⑦ "stop and re-scope" moment, not a quick refactor.

**The clean move is a caller-aware decorator: warn only when the immediate caller's module is outside the package.**

```python
def deprecated(alternative):
    def deco(func):
        @functools.wraps(func)
        def wrapper(*a, **k):
            caller = sys._getframe(1).f_globals.get("__name__", "") or ""
            if not (caller == PKG or caller.startswith(PKG + ".")):
                warnings.warn(f"...; prefer {alternative}.", DeprecationWarning, stacklevel=2)
            return func(*a, **k)
        return wrapper
    return deco
```

Internal callers (the facade, the services) are inside the package → silent; external user code → warned. **Zero call-graph rewrite, zero test breakage, recommended path stays clean** — same external signal as the structural flip, an order of magnitude less risk. The general principle: when the deprecation target sits *inside* the internal call graph, gate on *who is calling* (provenance), don't surgically remove the target from the graph.

## Where it could live

A generic design observation, not tied to one skill — but it strengthens the deprecation/retirement story that [`/nav:refactor`](docs/adr/025-refactor-syncs-headers-inline.md) and a future nav campaign conductor would touch (see [[brownfield-to-nav-deep-module-is-a-campaign]]). It also rhymes with the "verbatim move first, measure before restructuring" discipline (rule ⑥ + rule ⑦): the safe deprecation is the one that doesn't move the call graph.

## Caveats it forces you to document (the residual breaks)

Two edges a caller-aware decorator does NOT cover, both worth a changelog line rather than more machinery:
- `isinstance(x, dict)` / direct `json.dumps(x)` on a return value that later becomes a typed object — unrelated to deprecation but the same "don't chase 100% compat with heavy machinery" judgment (cf. the Tier-3 Dict→dataclass plan from the same session, which uses a dict-access mixin + a documented exception rather than subclassing `dict`).
- `sys._getframe(1)` reads the *immediate* caller; an internal helper that itself wraps the deprecated call would mask the warning. Fine here (facade/services call directly); note it if call depth grows.

## Sequel — when removal IS on the table, deprecate → flip internals → remove (two steps, never one)

The caller-aware decorator is the right move when you must **keep** the methods (external consumers you can't break). Later in the same session the constraint changed: a usage scan ([[vendored-copies-inflate-usage-scans]]) showed all consumers were internal and a breaking change was acceptable with a migration guide. So removal went back on the table — and the earlier "structural flip" the decorator had let us *avoid* now became the **enabling first step**, viable precisely because breaking + fixing our own tests was now allowed.

The decisive sequencing: **you cannot just delete an internally-load-bearing public method — flip the internal callers off it first.**
1. **Flip** (internal-only, zero public change): re-route every internal caller (the facade + cross-domain service calls — the ~112 sites) to call the service layer directly. After this the legacy methods have **zero internal callers** → pure external shims. Update the mock-point tests that mocked at the api-method seam (now mock at the service seam) — forward-compatible, since the methods are about to go.
2. **Remove** (the breaking change): now deletion is a clean `rm` — the 100 methods drop, the file collapses (2017→149 lines), nothing internal depends on them. Ship a migration guide + major version bump.

And the caller-aware deprecation wasn't wasted work: it became the **transition on-ramp** — the runtime warnings point each internal call site at its replacement *during* the migration, before step 2 lands. Deprecate-then-remove, with the flip in between.

A clean intra-vs-cross refinement fell out of the flip: a service method calling another method *on the same service* should be `self.<m>()`, not `self._toolkit._<svc>.<m>()` — don't bounce through the back-ref to call yourself. A blanket "rewrite every `self._toolkit.<flat>` → `self._toolkit._<svc>.<m>`" over-routes intra-service calls; fix them to `self.` (it's also what made the mock-based unit tests mock the service's own method cleanly).

## Trip-wire to revisit

If a second *independent* project needs the "retire a wide legacy surface that's also internally load-bearing" move (either the keep-it caller-aware path OR the remove-it flip-then-delete path), this graduates from a one-off toward a documented pattern (and possibly a tiny shared helper in the nav refactor toolkit). Watch also for the masking caveat actually biting (a deprecated method warns from inside the package because an intermediate wrapper changed the immediate caller).

## Evidence so far

- **Case 1 — keep-it (2026-06-17, brownfield nav conversion coda)**: structural flip implemented, measured (~112 internal calls, 8 broken mock-point tests), reverted; caller-aware decorator applied to 49 legacy flat methods — external call warns, `toolkit.get.video()` (recommended path, internally routing through the deprecated method) stays silent; 224 tests green.
- **Case 2 — remove-it, same project, constraint relaxed (2026-06-17, later)**: usage scan proved consumers were internal → flip-then-remove. Step 1 flipped 67 facade + ~38 service call-sites to the service layer (intra-service calls simplified to `self.`), fixed the mock-point tests, zero public change; step 2 deleted ~100 flat methods (api.py 2017→149) + the deprecation shim, shipped MIGRATION.md + 2.0.0. Tests green throughout. The Case-1 deprecation served as the migration on-ramp.

(Two facets of one project, not two independent projects → stays `raw`. Graduation = a second *independent* codebase needing either path, or the masking caveat biting in practice.)
