#!/usr/bin/env bash
# Uruchom dev: frontend http://127.0.0.1:3000 + API http://localhost:3002
set -euo pipefail
cd "$(dirname "$0")/.."

lsof -ti:3000,3002 -sTCP:LISTEN 2>/dev/null | xargs kill -9 2>/dev/null || true

NODE=""
for candidate in \
  "$(command -v node 2>/dev/null || true)" \
  "/Users/jankruk/Desktop/Cursor.app/Contents/Resources/app/resources/helpers/node" \
  "/Applications/Cursor.app/Contents/Resources/app/resources/helpers/node" \
  "$(pwd)/.tools/npm/bin/node"; do
  if [ -n "$candidate" ] && [ -x "$candidate" ]; then
    NODE="$candidate"
    break
  fi
done

if [ -z "$NODE" ]; then
  echo "Brak Node.js. Zainstaluj z https://nodejs.org lub uruchom terminal z Cursora."
  exit 1
fi

if [ ! -d node_modules ]; then
  echo "Brak node_modules — uruchom: npm install"
  exit 1
fi

echo "Node: $NODE"
echo "Start: http://127.0.0.1:3000/  (API :3002)"
echo "Zatrzymaj: Ctrl+C"
echo ""

exec "$NODE" scripts/dev.mjs
