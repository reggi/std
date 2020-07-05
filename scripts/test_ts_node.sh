#!/bin/bash
BASEDIR="$(cd "$(dirname "$0")" || exit; pwd)"
# shellcheck source=/dev/null
. "$BASEDIR"/npm_bin.sh
# shellcheck disable=SC2034
USAGE="<file?>"
# shellcheck disable=SC2034
DESC="test ts-node files or optonally a single file"

test_ts_node () {
  if [ -n "$1" ]; then
    npm_bin mocha -r ts-node/register "$1"
  else
    npm_bin mocha -r ts-node/register "$BASEDIR/../ts-node/module/*_test.ts"
  fi
}