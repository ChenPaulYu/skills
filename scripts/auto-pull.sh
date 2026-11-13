#!/bin/sh
# auto-pull.sh — keep this machine's git checkouts current, safely.
#
# A tool-agnostic scheduled `git pull --ff-only` (Claude Code, Codex, Cursor and
# opencode all read copies of this repo; a hook inside one tool cannot refresh
# the others). A fast-forward fires the repo's own post-merge hook, which runs
# scripts/sync-installed.sh — so installed copies follow with nothing else to
# remember (see CLAUDE.md gate #0). Schedule it with scripts/install-auto-pull.sh.
#
# Repos: one path per line in ${XDG_CONFIG_HOME:-$HOME/.config}/auto-pull/repos
# (blank and # lines ignored, leading ~ expanded). Missing file → this repo only.
#
# Per repo it only ever: fetch, then `git merge --ff-only @{u}`. Never a
# non-ff merge, rebase, stash, reset, or push. Anything unclear (diverged,
# local changes in the way, no upstream) is left untouched and logged.
#
# Log: ${XDG_STATE_HOME:-$HOME/.local/state}/auto-pull/auto-pull.log, one
# timestamped line per repo per run, trimmed to the last 500 lines.
#
#     sh scripts/auto-pull.sh             # pull every configured repo
#     sh scripts/auto-pull.sh --dry-run   # report only, change nothing
#     sh scripts/auto-pull.sh --if-stale 3600   # skip if the last run was <1h ago
#
# Exits 0 unless misused, so a scheduler never reports a failure spree.

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
CONFIG_FILE="${XDG_CONFIG_HOME:-$HOME/.config}/auto-pull/repos"
STATE_DIR="${XDG_STATE_HOME:-$HOME/.local/state}/auto-pull"
LOG="$STATE_DIR/auto-pull.log"
MAX_LOG_LINES=500
FETCH_TIMEOUT=60
DRY=0
STALE=0

usage() {
  sed -n '2,/^$/p' "$0" | sed 's/^# \{0,1\}//'
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --dry-run) DRY=1 ;;
    --if-stale)
      shift
      case "$1" in ''|*[!0-9]*) echo "auto-pull: --if-stale needs seconds" >&2; exit 2 ;; esac
      STALE=$1 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "auto-pull: unknown argument: $1 (try --help)" >&2; exit 2 ;;
  esac
  shift
done

mkdir -p "$STATE_DIR" || { echo "auto-pull: cannot create $STATE_DIR" >&2; exit 2; }

# --if-stale: a cheap throttle for shell-startup triggers (macOS blocks launchd
# jobs from reading ~/Desktop, so a terminal-launched run is the Mac path).
STAMP="$STATE_DIR/last-run"
if [ "$STALE" -gt 0 ] && [ -f "$STAMP" ]; then
  last=$(stat -c %Y "$STAMP" 2>/dev/null || stat -f %m "$STAMP" 2>/dev/null || echo 0)
  [ $(( $(date +%s) - last )) -lt "$STALE" ] && exit 0
fi

# One run at a time; a lock left by a dead process is reclaimed.
LOCK="$STATE_DIR/lock"
if ! mkdir "$LOCK" 2>/dev/null; then
  holder=$(cat "$LOCK/pid" 2>/dev/null)
  if [ -n "$holder" ] && kill -0 "$holder" 2>/dev/null; then
    echo "auto-pull: another run is active (pid $holder); skipping"
    exit 0
  fi
  rm -rf "$LOCK"
  mkdir "$LOCK" 2>/dev/null || { echo "auto-pull: cannot take lock"; exit 0; }
fi
echo "$$" > "$LOCK/pid"
trap 'rm -rf "$LOCK"' EXIT INT TERM
[ "$DRY" = 1 ] || touch "$STAMP"

log() { # log <repo> <LEVEL> <message>
  line="$(date '+%Y-%m-%dT%H:%M:%S%z') $2 $1: $3"
  echo "$line"
  echo "$line" >> "$LOG"
}

TIMEOUT_CMD=
for t in timeout gtimeout; do
  if command -v "$t" >/dev/null 2>&1; then TIMEOUT_CMD=$t; break; fi
done

# GIT_TERMINAL_PROMPT=0: a scheduled job must fail, never wait for a password.
GIT_TERMINAL_PROMPT=0
export GIT_TERMINAL_PROMPT

pull_repo() {
  repo=$1
  if ! git -C "$repo" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    log "$repo" SKIP "not a git repo"
    return
  fi
  if ! git -C "$repo" rev-parse --abbrev-ref '@{u}' >/dev/null 2>&1; then
    log "$repo" SKIP "no upstream branch"
    return
  fi
  if [ -n "$TIMEOUT_CMD" ]; then
    $TIMEOUT_CMD "$FETCH_TIMEOUT" git -C "$repo" fetch --quiet
  else
    git -C "$repo" fetch --quiet
  fi || { log "$repo" WARN "fetch failed (offline or timed out)"; return; }

  counts=$(git -C "$repo" rev-list --left-right --count 'HEAD...@{u}' 2>/dev/null) \
    || { log "$repo" WARN "cannot compare HEAD with upstream"; return; }
  ahead=${counts%%[!0-9]*}
  behind=${counts##*[!0-9]}

  case "$ahead:$behind" in
    0:0)
      log "$repo" OK "up to date"
      ;;
    0:*)
      if [ "$DRY" = 1 ]; then
        log "$repo" DRY "would fast-forward $behind commit(s)"
      elif out=$(git -C "$repo" merge --ff-only '@{u}' 2>&1); then
        log "$repo" PULL "fast-forwarded $behind commit(s)"
      else
        log "$repo" WARN "ff-merge refused: $(echo "$out" | tr '\n' ' ' | cut -c1-200)"
      fi
      ;;
    *:0)
      log "$repo" OK "ahead by $ahead commit(s); nothing to pull (never pushes)"
      ;;
    *)
      log "$repo" WARN "diverged (ahead $ahead, behind $behind); left untouched"
      ;;
  esac
}

if [ -f "$CONFIG_FILE" ]; then
  REPOS=$(cat "$CONFIG_FILE")
else
  REPOS=$ROOT
fi

printf '%s\n' "$REPOS" | while IFS= read -r line || [ -n "$line" ]; do
  case "$line" in ''|'#'*) continue ;; esac
  line=$(printf '%s' "$line" | sed 's/^[[:space:]]*//; s/[[:space:]]*$//')
  [ -n "$line" ] || continue
  case "$line" in
    '~') line=$HOME ;;
    '~/'*) line="$HOME/${line#\~/}" ;;
  esac
  pull_repo "$line"
done

# Surface a broken always-loaded instruction file in the same log (see the script).
sh "$ROOT/scripts/check-global-instructions.sh" | while IFS= read -r line; do
  path=${line#WARN }; log "${path%%:*}" WARN "${path#*: }"
done

if [ -f "$LOG" ] && [ "$(wc -l < "$LOG")" -gt "$MAX_LOG_LINES" ]; then
  tail -n "$MAX_LOG_LINES" "$LOG" > "$LOG.tmp" && mv "$LOG.tmp" "$LOG"
fi
exit 0
