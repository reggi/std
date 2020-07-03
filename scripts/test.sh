#!/bin/bash
BASEDIR="$(cd "$(dirname "$0")" || exit; pwd)"
# shellcheck source=/dev/null
. "$BASEDIR"/test_ts_node.sh
# shellcheck disable=SC2034
USAGE=""
# shellcheck disable=SC2034
DESC="tests entire project"

test () {
  test_ts_node
}