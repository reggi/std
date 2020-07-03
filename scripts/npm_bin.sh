#!/bin/bash
# shellcheck disable=SC2034
USAGE="<bin> <...args>"
DESC="executes npm binary from node_modules"
BASEDIR="$(cd "$(dirname "$0")" || exit; pwd)"

npm_bin () {
  BIN="$1"
  shift
  "$BASEDIR/../node_modules/.bin/$BIN" "$@"
}
