#!/bin/sh
# install-auto-pull.sh — schedule scripts/auto-pull.sh on this machine.
#
#     sh scripts/install-auto-pull.sh [install] [--interval SECONDS]   # default 3600
#     sh scripts/install-auto-pull.sh uninstall
#     sh scripts/install-auto-pull.sh status
#
# macOS → a launchd LaunchAgent; Linux → a systemd --user timer. Also seeds
# ${XDG_CONFIG_HOME:-$HOME/.config}/auto-pull/repos with this repo if absent;
# add other repos there, one path per line. What the job does is owned by
# scripts/auto-pull.sh (fast-forward only, never pushes).

set -e
ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
SCRIPT="$ROOT/scripts/auto-pull.sh"
CONFIG_DIR="${XDG_CONFIG_HOME:-$HOME/.config}/auto-pull"
CONFIG_FILE="$CONFIG_DIR/repos"
STATE_DIR="${XDG_STATE_HOME:-$HOME/.local/state}/auto-pull"
LOG="$STATE_DIR/auto-pull.log"
LABEL="io.github.skills.auto-pull"
PLIST="$HOME/Library/LaunchAgents/$LABEL.plist"
UNIT_DIR="$HOME/.config/systemd/user"
INTERVAL=3600
ACTION=install

while [ "$#" -gt 0 ]; do
  case "$1" in
    install|uninstall|status) ACTION=$1 ;;
    --interval)
      shift
      [ "$#" -gt 0 ] || { echo "✗ --interval needs seconds" >&2; exit 2; }
      INTERVAL=$1
      ;;
    -h|--help) sed -n '2,/^$/p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "✗ unknown argument: $1" >&2; exit 2 ;;
  esac
  shift
done
case "$INTERVAL" in ''|*[!0-9]*) echo "✗ --interval must be whole seconds" >&2; exit 2 ;; esac

OS=$(uname -s)

seed_config() {
  mkdir -p "$CONFIG_DIR" "$STATE_DIR"
  if [ ! -f "$CONFIG_FILE" ]; then
    printf '# repos auto-pull keeps current: one path per line (~ ok)\n%s\n' "$ROOT" > "$CONFIG_FILE"
    echo "• created $CONFIG_FILE"
  fi
  echo "• repos list: $CONFIG_FILE  (add other repos there, one path per line)"
}

status_log() {
  echo "--- last 10 log lines ($LOG)"
  if [ -f "$LOG" ]; then tail -n 10 "$LOG"; else echo "(no log yet)"; fi
}

case "$OS:$ACTION" in
  Darwin:install)
    seed_config
    mkdir -p "$(dirname "$PLIST")"
    cat > "$PLIST" <<PLISTEOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>$LABEL</string>
  <key>ProgramArguments</key>
  <array><string>/bin/sh</string><string>$SCRIPT</string></array>
  <key>StartInterval</key><integer>$INTERVAL</integer>
  <key>RunAtLoad</key><true/>
  <key>EnvironmentVariables</key>
  <dict><key>PATH</key><string>/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin</string></dict>
  <key>StandardOutPath</key><string>$STATE_DIR/launchd.out.log</string>
  <key>StandardErrorPath</key><string>$STATE_DIR/launchd.err.log</string>
</dict>
</plist>
PLISTEOF
    launchctl bootout "gui/$(id -u)/$LABEL" 2>/dev/null || true
    launchctl bootstrap "gui/$(id -u)" "$PLIST" 2>/dev/null || echo "• bootstrap reported an error (already loaded?)"
    echo "✓ installed $LABEL (every ${INTERVAL}s)"
    ;;
  Darwin:uninstall)
    launchctl bootout "gui/$(id -u)/$LABEL" 2>/dev/null || true
    rm -f "$PLIST"
    echo "✓ uninstalled $LABEL (config and log kept in $CONFIG_DIR, $STATE_DIR)"
    ;;
  Darwin:status)
    if launchctl print "gui/$(id -u)/$LABEL" >/dev/null 2>&1; then echo "loaded: $LABEL"; else echo "not loaded: $LABEL"; fi
    status_log
    ;;
  Linux:install)
    seed_config
    mkdir -p "$UNIT_DIR"
    cat > "$UNIT_DIR/auto-pull.service" <<UNITEOF
[Unit]
Description=Fast-forward configured git repos (auto-pull)

[Service]
Type=oneshot
ExecStart=/bin/sh $SCRIPT
UNITEOF
    cat > "$UNIT_DIR/auto-pull.timer" <<UNITEOF
[Unit]
Description=Run auto-pull periodically

[Timer]
OnBootSec=5min
OnUnitActiveSec=${INTERVAL}s
Persistent=true

[Install]
WantedBy=timers.target
UNITEOF
    systemctl --user daemon-reload
    systemctl --user enable --now auto-pull.timer
    echo "✓ installed auto-pull.timer (every ${INTERVAL}s)"
    echo "• to keep it running without a login session: loginctl enable-linger \"\$USER\""
    ;;
  Linux:uninstall)
    systemctl --user disable --now auto-pull.timer 2>/dev/null || true
    rm -f "$UNIT_DIR/auto-pull.service" "$UNIT_DIR/auto-pull.timer"
    systemctl --user daemon-reload 2>/dev/null || true
    echo "✓ uninstalled auto-pull (config and log kept)"
    ;;
  Linux:status)
    systemctl --user list-timers auto-pull.timer --no-pager 2>/dev/null || echo "not loaded"
    status_log
    ;;
  *)
    echo "✗ unsupported OS: $OS" >&2
    exit 2
    ;;
esac
