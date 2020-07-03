#!/bin/bash
USAGE=""
DESC="test ts-node files"
BASEDIR="$(cd "$(dirname "$0")"; pwd)"
. $BASEDIR/npm_bin.sh

test_ts_node () {
  DIR="./ts-node/module/*_test.ts"
  echo $DIR
  npm_bin mocha -r ts-node/register $DIR
}