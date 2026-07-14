#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
APP_NAME="Super Mario.app"
ARCH="$(uname -m)"
DIST_DIR="$ROOT/dist/mac-${ARCH}"
# electron-builder may still emit the old productName during rename transitions.
SRC_APP=""
for candidate in "$DIST_DIR/$APP_NAME" "$DIST_DIR/Sprout.app"; do
  if [[ -d "$candidate" ]]; then
    SRC_APP="$candidate"
    break
  fi
done
DEST_APP="/Applications/$APP_NAME"

cd "$ROOT"
npm run build:mac

# Prefer the freshly built Super Mario.app; fall back to legacy name if needed.
SRC_APP=""
for candidate in "$DIST_DIR/$APP_NAME" "$DIST_DIR/Sprout.app"; do
  if [[ -d "$candidate" ]]; then
    SRC_APP="$candidate"
    break
  fi
done

if [[ -z "$SRC_APP" || ! -d "$SRC_APP" ]]; then
  echo "Build failed: neither Super Mario.app nor Sprout.app found in $DIST_DIR" >&2
  ls -la "$DIST_DIR" 2>/dev/null || true
  exit 1
fi

# Quit any running widgets first so we replace a live binary cleanly.
pkill -f '/Applications/Super Mario.app' 2>/dev/null || true
pkill -f '/Applications/Sprout.app' 2>/dev/null || true
sleep 0.5

if [[ -d "$DEST_APP" ]]; then
  rm -rf "$DEST_APP"
fi
# Remove leftover Sprout.app so Spotlight doesn't open the wrong one.
rm -rf "/Applications/Sprout.app" 2>/dev/null || true

cp -R "$SRC_APP" "$DEST_APP"
# Ensure Applications copy is named Super Mario even if dist was still Sprout.
if [[ "$(basename "$SRC_APP")" != "$APP_NAME" ]]; then
  :
fi

# Login item so it starts without opening Terminal.
osascript <<'EOF' >/dev/null 2>&1 || true
tell application "System Events"
  if not (exists login item "Super Mario") then
    make login item at end with properties {path:"/Applications/Super Mario.app", hidden:false}
  end if
end tell
EOF

echo "Installed $DEST_APP"
echo "Open from Spotlight (⌘Space → Super Mario), Launchpad, or Applications."
echo "Also set to open at login — no Terminal needed."
open "$DEST_APP"
