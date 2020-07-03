#!/bin/bash
# shellcheck disable=SC2034
USAGE=""
# shellcheck disable=SC2034
DESC="test ts-node files"
BASEDIR="$(cd "$(dirname "$0")" || exit; pwd)"

npm_bin () {
  "$BASEDIR/../node_modules/.bin/$1" "${@:2}"
}
