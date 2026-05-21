#!/usr/bin/env bash
# Uruchom dev bez globalnego npm (frontend + API na :3002)
set -euo pipefail
cd "$(dirname "$0")/.."

if command -v node >/dev/null 2>&1; then
  NODE=node
elif [ -x "/Users/jankruk/Desktop/Cursor.app/Contents/Resources/app/resources/helpers/node" ]; then
  NODE="/Users/jankruk/Desktop/Cursor.app/Contents/Resources/app/resources/helpers/node"
elif [ -x ".tools/npm/bin/node" ]; then
  NODE=".tools/npm/bin/node"
else
  echo "Brak Node.js. Zainstaluj Node LTS z https://nodejs.org lub uruchom z Cursor."
  exit 1
fi

exec "$NODE" scripts/dev.mjs
