#!/bin/sh
# check-global-instructions.sh — warn when a tool's always-loaded instruction file is gone.
#
# Claude Code reads ~/.claude/CLAUDE.md and Codex reads ~/.codex/AGENTS.md at the
# start of every session. When either is missing or is a symlink to a moved file,
# every session on that machine silently runs without the user's standing
# preferences (seen: one machine ran six weeks that way after a relocation).
# This only reports; it never creates or rewrites the files — what they should
# contain is the user's own setup.
#
# Prints one "WARN <path>: <reason>" line per problem; prints nothing when fine.
# Exit 0 always. Used by scripts/sync-installed.sh and scripts/auto-pull.sh.

for g in "$HOME/.claude/CLAUDE.md" "$HOME/.codex/AGENTS.md"; do
  dir=$(dirname "$g")
  [ -d "$dir" ] || continue                 # tool not installed on this machine
  if [ -L "$g" ] && [ ! -e "$g" ]; then
    echo "WARN $g: symlink target is missing ($(readlink "$g")) — global instructions are not loaded"
  elif [ ! -e "$g" ]; then
    echo "WARN $g: missing — sessions run without global instructions"
  fi
done
exit 0
