#!/bin/bash
USAGE=""
DESC="test ts-node files"
BASEDIR="$(cd "$(dirname "$0")"; pwd)"
. $BASEDIR/npm_bin.sh

test_ts_node () {
  echo 'hi'
  npm_bin mocha -r ts-node/register $BASEDIR/../ts-node/**/*_test.ts
}