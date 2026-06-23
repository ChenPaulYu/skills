# Archetype: python-lib — uv + hatchling + src-layout Python library/capability package

> Seeded 2026-06-22 from the **tactus** scaffold-verify run(first python-lib exemplar), grounded against two living siblings. **Exemplars(ground these, don't trust prose):**
> - **tactus**(`rytho-ai/packages/tactus` — cleanest minimal baseline; verification chain made green in commit `fa2d712`)— the canonical shape to copy.
> - **agent-daw**(`rytho-ai/archive/agent-daw` — proven, richer/stateful; src-layout + `[project.scripts]` CLI face + `[tool.uv.sources]` for path/git deps)— what a mature internal package grows into.
> - **youtube-toolkit**(`rytho-ai/packages/youtube-toolkit` — published-grade)— a *partial* contrast: still carries **legacy black/flake8/mypy lint, dual dev-dep tables, and a missing `py.typed`**(see Decisions), so it stays the "don't copy these" case for lint/typing — **but its layout is no longer a counter-example**: it was migrated flat→src + uv-first on **2026-06-23**, closing the last flat holdout.
>
> Stack rulings come from `../stack-principles.md`(Python → uv · ruff line-100). This file = composition, decisions where the exemplars disagree, gotchas, and the verification chain.
>
> **These exemplars are rytho-ai-private — a downstream user who forked this skill cannot clone them, and a negative exemplar can be *fixed* out from under this prose(as youtube-toolkit's flat layout was on 2026-06-23).** So every decision below is stated *abstractly, with its reason*, and stands on its own; the named repos are something to ground against **when you have them**, not the source of truth. Cite a live repo for a *flaw* only with an "as of <date>" pin. (See observation `2026-06-23-grounding-on-living-repos-fails-two-ways`.)

## Composition

```
<project>/
├── src/<pkg_name>/           src layout (NOT flat) — import-isolates the installed pkg from the repo dir
│   ├── __init__.py           module docstring header (head -12 retrievable) + __version__
│   └── py.typed              ship it — this is a typed library
├── tests/
│   ├── __init__.py
│   └── test_smoke.py         imports pkg + asserts __version__ → keeps the pytest leg a REAL green
├── docs/{core, blueprints/{thoughts,plans,mockups}}
├── pyproject.toml            [project] · [build-system] hatchling · [dependency-groups] dev · [tool.ruff] · [tool.pytest.ini_options]
├── .python-version · .gitignore · README.md · uv.lock (present on disk)
```

## Decisions(the parts the exemplars disagree on — ground these, don't average them)

- **Layout = src layout — always.** The reason is structural, not consensus-by-count: src **import-isolates the installed package from the repo dir**, so it dodges the classic pytest "imports the repo dir, not the installed package" trap with no `pythonpath` hack. All three rytho-ai libs now use `src/<pkg>`(youtube-toolkit was migrated flat→src on 2026-06-23, the last holdout). Flat is never the choice for a new lib, whatever any exemplar happens to show.
- **Lint = ruff, line-length 100**(per stack-principles). The exemplars genuinely diverge — agent-daw configured *no* linter, youtube-toolkit still runs black+flake8+mypy@88(as of 2026-06-23 — left legacy even after its layout migration). That's legacy/unset, **not a counter-vote**; new python-libs use ruff. ruff must be a **declared dev dep**, not just a `[tool.ruff]` block(see Gotcha 1).
- **Dev deps = `[dependency-groups].dev` only**(uv-native, single source). youtube-toolkit carries *both* that and a legacy `[project.optional-dependencies].dev` — two truths for the same thing = drift. Don't.
- **`uv.lock`: internal pkg → gitignore + untrack · published pkg → commit.** tactus/agent-daw(monorepo siblings)untrack the lock; youtube-toolkit(distributed to PyPI)commits it for reproducibility. Pick by whether the package is shipped or internal — both are correct for their case.
- **`py.typed`: ship it.** tactus + agent-daw include it; youtube-toolkit forgot — a typed-library gap to not repeat.
- **CLI entry(`[project.scripts]`)is optional** — add only when the lib has a CLI face(agent-daw has one; tactus core is a pure library, its MCP/CLI face is a later concern).
- **Lean core + extras.** Heavy/optional deps go behind a named `[project.optional-dependencies]` extra(tactus: `[render]` for audio synthesis), so the core install stays dep-light.

## Gotchas(field-hit on the tactus run — check each)

1. **"Configured ≠ installed."** A `[tool.ruff]` block(or `[tool.mypy]`, etc.) does NOT install the tool. If it's not in `[dependency-groups].dev`, `uv run ruff check` dies with `Failed to spawn: ruff` — a silently-broken lint leg that only surfaces when you actually run it. Every lint/type tool you configure must also be a declared dev dep.
2. **"pytest exit-5 is a hollow green."** A scaffold with zero tests makes `pytest` exit **5**(no-tests-collected), not 0 — the test leg looks fine in a glance but is not a real pass. Add one `test_smoke.py`(import the package + assert `__version__`)from day one so the leg is genuinely green; real tests are mined/added later.
3. **flat layout → pytest import ambiguity.** If you ever deviate to flat layout, pytest may import the source tree instead of the installed package and needs `[tool.pytest.ini_options] pythonpath`/conftest gymnastics. src layout avoids the whole class of problem — prefer it.(youtube-toolkit was the cautionary case here until its 2026-06-23 flat→src migration.)

## Preflight(this archetype)

`uv`(`uv --version`)· a Python matching `.python-version`(`uv` will fetch it). **No node/pnpm, no `agent-browser`** — a library has no server or browser leg, so those tools are not required(don't preflight what the chain never runs).

## Verification chain(done = all green, in order)

1. `uv sync` — deps + dev group resolve/install.
2. `uv run ruff check` — lint clean(exit 0). Broken if ruff wasn't added as a dev dep(Gotcha 1).
3. `uv run pytest` — at least the smoke test passes(exit 0, not 5 — Gotcha 2).
4. `uv run python -c "import <pkg>; print(<pkg>.__version__)"` — import smoke: the package installs and imports as a real package(catches src-layout / packaging mistakes).
5. `uv build` — hatchling builds wheel + sdist cleanly(`dist/` is gitignored).
6. **(published packages only)** **Clean-venv install smoke** — the only leg that proves the *shipped artifact* works, not just that the source resolves: `uv venv /tmp/x` → `VIRTUAL_ENV=/tmp/x uv pip install dist/*.whl` → `import` the package **with cwd OUTSIDE the repo**. Catches mis-declared wheel contents(a module excluded from `[tool.hatch.build.targets.wheel]` passes legs 1–5 and only `ImportError`s after a real `pip install`) + dependency-resolution gaps the dev env masks. Two details are load-bearing: a **fresh** venv(the dev env hides under-declared deps) and **cwd outside the repo**(else the source tree shadows the installed package and you're re-running leg 4). **Skip for internal-only libs** — editable sync + leg 4 is enough; don't pay the clean-room cost for an artifact no one installs.

No server curl, no browser leg. If the lib grows a CLI face, add a further leg: `uv run <cli> --help` smoke.

## Per-project adaptation checklist

Name(pyproject `name`/`description`, `src/<pkg>` dir, `__init__` header + `__version__`, README)· pick the `.python-version` pin · core deps stay lean, heavy bits behind a named extra · decide lock-file policy by internal-vs-published · **no port registry entry**(a library binds no ports). The smoke test is the verification floor, not the test suite — real op/parity tests land as the package's actual code does.
