#!/usr/bin/env bash
# Uruchom dev bez globalnego npm (frontend + API na :3002)
set -euo pipefail
cd "$(dirname "$0")/.."

# Zwolnij porty — ignoruj błąd, gdy nic nie nasłuchuje
lsof -ti:3000,3002 -sTCP:LISTEN 2>/dev/null | xargs kill -9 2>/dev/null || true

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
