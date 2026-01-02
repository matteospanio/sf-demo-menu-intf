#!/usr/bin/env sh
set -eu

if command -v yarn >/dev/null 2>&1; then
  yarn lint
else
  npm run lint
fi
