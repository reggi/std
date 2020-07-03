#!/bin/bash
# shellcheck disable=SC2034
USAGE="" 
# shellcheck disable=SC2034
DESC="runs eslint"
# shellcheck source=/dev/null
. "$BASEDIR"/npm_bin.sh


eslint () {
  npm_bin eslint . "$@"
}


