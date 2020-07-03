#!/bin/bash
BASEDIR="$(cd "$(dirname "$0")" || exit; pwd)"
# shellcheck source=/dev/null
. "$BASEDIR"/npm_bin.sh

USAGE=""
DESC="test ts-node files"

test_ts_node () {
  npm_bin mocha -r ts-node/register "$BASEDIR/../ts-node/module/*_test.ts"
}