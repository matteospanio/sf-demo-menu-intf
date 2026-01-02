#!/usr/bin/env sh
set -eu

if command -v yarn >/dev/null 2>&1; then
  yarn tsc --noEmit
else
  npm exec -- tsc --noEmit
fi
