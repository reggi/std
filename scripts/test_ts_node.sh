#!/bin/bash
# shellcheck disable=SC2034
USAGE=""
# shellcheck disable=SC2034
DESC="test ts-node files"
BASEDIR="$(cd "$(dirname "$0")" || exit; pwd)"
# shellcheck source=/dev/null
. "$BASEDIR"/npm_bin.sh

test_ts_node () {
  npm_bin mocha -r ts-node/register "$BASEDIR/../ts-node/module/*_test.ts"
}