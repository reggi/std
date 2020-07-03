#!/bin/bash
BASEDIR="$(cd "$(dirname "$0")" || exit; pwd)"
# shellcheck source=/dev/null
. "$BASEDIR"/test_ts_node.sh
# shellcheck disable=SC2034
USAGE=""
# shellcheck disable=SC2034
DESC="checks if the package.json file is sorted"

lint_package () {
  if [ "$1" = 'fix' ]; then 
    npm_bin sort-package-json
  else
    npm_bin sort-package-json --check
  fi
}

