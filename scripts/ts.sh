#!/bin/bash
BASEDIR="$(cd "$(dirname "$0")" || exit; pwd)"
# shellcheck source=/dev/null
. "$BASEDIR"/npm_bin.sh
# shellcheck disable=SC2034
USAGE="<file?>"
# shellcheck disable=SC2034
DESC="runs ts files"

ts () {
  if [ -n "$1" ]; then
    npm_bin ts-node \
      -r tsconfig-paths/register \
      "$1"
  else
    npm_bin ts-node \
      -r tsconfig-paths/register
  fi
}