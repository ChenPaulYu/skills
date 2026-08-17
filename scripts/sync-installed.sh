#!/bin/sh
# sync-installed.sh — make THIS machine's INSTALLED skills match the repo.
#
# The repo is the source of truth; every tool that runs these skills reads a
# COPY of it, and each copy rots in its own way:
#
#   Claude Code  → ~/.claude/plugins/cache/skills/<plugin>/<version>/
#                  A version-PINNED snapshot. A content change with a version
#                  bump does not reach a session until `claude plugin update`
#                  materialises the new pin; a retired plugin stays loadable
#                  from its old pin forever.
#   Codex        → ~/.agents/skills/<plugin>-<skill>/
#   Cursor       → the SAME ~/.agents/skills/ (cursor-agent scans, per its own
#                  resolver, ~/.claude/skills · ~/.codex/skills · ~/.agents/skills
#                  · ~/.cursor/skills). One directory, two tools, no second copy.
#   opencode     → also reads the .agents/skills convention.
#
# This script is the SINGLE OWNER of "bring the copies back in line" (rule ①).
# The git hooks in scripts/hooks/ are thin callers — post-commit (you authored a
# change) and post-merge / post-checkout / post-rewrite (you pulled someone
# else's). Nothing here must be remembered by a human: a step that must be
# remembered is a step that will be skipped.
# Full account: docs/observations/2026-08-12-skill-copies-outlive-their-source.md
#
# Enable the hooks once per clone:
#     git config core.hooksPath scripts/hooks
#
# Run by hand any time:
#     sh scripts/sync-installed.sh          # verbose
#     sh scripts/sync-installed.sh --quiet  # hook mode: silent unless something changed
#
# Safe to re-run; a no-op when everything is already current, and a no-op on a
# machine that has neither `claude` nor `node`.

set -e
ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
cd "$ROOT"

QUIET=0
[ "$1" = "--quiet" ] && QUIET=1

say() { [ "$QUIET" -eq 1 ] || echo "$@"; }

# ── Codex · Cursor · opencode — the shared ~/.agents/skills mirror ────────────
GLOBAL="$HOME/.agents/skills"

# Fingerprint the mirror so quiet mode can stay silent when nothing moved.
fingerprint() {
  [ -d "$GLOBAL" ] || { echo "absent"; return; }
  {
    ls -1 "$GLOBAL"
    find "$GLOBAL" -maxdepth 2 -name SKILL.md -print0 2>/dev/null \
      | sort -z | xargs -0 cat 2>/dev/null
  } | cksum
}

if command -v node >/dev/null 2>&1; then
  before=$(fingerprint)
  # --sync-global installs the COMPILED mirror and prunes skills that left the
  # repo (a retirement that reaches the source but not the runtime has not
  # happened). --dedupe-global-roots removes generated duplicates that older
  # installs left under ~/.codex/skills, so one skill = one file on disk.
  if out=$(node scripts/build-codex.mjs --sync-global --dedupe-global-roots 2>&1); then
    say "$out"
    after=$(fingerprint)
    if [ "$QUIET" -eq 1 ] && [ "$before" != "$after" ]; then
      echo "✓ Codex/Cursor skill mirror updated → $GLOBAL"
    fi
  else
    echo "$out" >&2
    echo "✗ Codex/Cursor mirror sync failed — run \`node scripts/build-codex.mjs --sync-global --dedupe-global-roots\` by hand" >&2
  fi
  # build-codex.mjs regenerates the repo's own committed mirror as a side
  # effect. After a clean pull that is a no-op; if it is not, the tree that was
  # pushed was already out of sync — say so rather than leaving a silent diff.
  if [ -n "$(git status --porcelain -- .agents AGENTS.md .codex plugins 2>/dev/null)" ]; then
    echo "⚠ regenerating left the working tree dirty (.agents / AGENTS.md / plugins):" >&2
    git status --porcelain -- .agents AGENTS.md .codex plugins >&2
    echo "  Someone committed a stale mirror. Review, then commit the regeneration." >&2
  fi
else
  say "· node not found — skipping the Codex/Cursor mirror"
fi

# ── Claude Code — the version-pinned plugin cache ─────────────────────────────
command -v claude >/dev/null 2>&1 || { say "· claude CLI not found — skipping the plugin cache"; exit 0; }
CACHE="$HOME/.claude/plugins/cache/skills"
[ -d "$CACHE" ] || { say "· skills plugins not installed here — skipping the plugin cache"; exit 0; }

refreshed_marketplace=0
for manifest in plugins/*/.claude-plugin/plugin.json; do
  [ -f "$manifest" ] || continue
  p=$(basename "$(dirname "$(dirname "$manifest")")")
  v=$(sed -n 's/.*"version"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' "$manifest" | head -1)
  [ -n "$v" ] || continue
  if [ ! -d "$CACHE/$p" ]; then
    # NEW plugin — present in the repo, never installed here. The original hook
    # skipped this case, which is why fathom sat unreachable from the moment it
    # was authored: the repo had it, no session did.
    echo "→ new plugin $p not installed here — installing…"
    claude plugin marketplace update skills >/dev/null 2>&1 || true
    refreshed_marketplace=1
    if claude plugin install "$p@skills" >/dev/null 2>&1 && [ -d "$CACHE/$p" ]; then
      echo "  ✓ $p installed (applies next session)"
    else
      echo "  ✗ $p: install failed — run \`claude plugin install $p@skills\` by hand" >&2
    fi
    continue
  fi
  if [ ! -d "$CACHE/$p/$v" ]; then
    if [ "$refreshed_marketplace" -eq 0 ]; then
      echo "→ plugin cache behind the repo — refreshing…"
      claude plugin marketplace update skills >/dev/null 2>&1 || true
      refreshed_marketplace=1
    fi
    claude plugin update "$p@skills" >/dev/null 2>&1 || true
    # The CLI can report success without materializing the snapshot (it
    # no-ops when its registry already believes $v is installed). The dir
    # on disk is the only truth — never prune on the exit code alone.
    if [ -d "$CACHE/$p/$v" ]; then
      echo "  ✓ $p → $v (applies next session)"
      # Drop superseded snapshots so a retired skill can't be served from an
      # old pin — the exact failure that kept reflect:summarize loadable for
      # a month after its retirement.
      for old in "$CACHE/$p"/*/; do
        [ -d "$old" ] || continue
        [ "$(basename "$old")" = "$v" ] || rm -rf "$old"
      done
    else
      echo "  ✗ $p: cache still missing $v after update — reinstall by hand:" >&2
      echo "      claude plugin uninstall $p@skills && claude plugin install $p@skills" >&2
    fi
  fi
done

# Orphans — installed here, gone from the repo. Walking only the plugins the
# REPO has propagates a retirement halfway: reflect stayed installed with
# catchup/park/retrace loadable for three hours after the commit that deleted
# it, and reflect:summarize survived a month the same way.
for cached in "$CACHE"/*/; do
  [ -d "$cached" ] || continue
  p=$(basename "$cached")
  [ -d "plugins/$p" ] && continue
  echo "→ $p is installed but no longer in the repo — uninstalling…"
  claude plugin uninstall "$p@skills" >/dev/null 2>&1 || true
  rm -rf "$cached"                       # the CLI can exit 0 without removing the snapshot
  echo "  ✓ $p uninstalled"
done

exit 0
