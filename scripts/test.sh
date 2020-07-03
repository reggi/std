#!/bin/bash
BASEDIR="$(cd "$(dirname "$0")" || exit; pwd)"
# shellcheck source=/dev/null
. "$BASEDIR"/test_ts_node.sh

USAGE=""
DESC="tests entire project"

test () {
  test_ts_node
}