#!/bin/bash
USAGE=""
DESC="runs a script from ./node_modules/.bin"
BASEDIR="$(cd "$(dirname "$0")"; pwd)"

npm_bin () {
  BIN=$1
  $BASEDIR/../node_modules/.bin/$1 ${@:2}
}