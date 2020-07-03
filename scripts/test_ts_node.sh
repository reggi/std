#!/usr/bin/env bash
USAGE=""
DESC="test ts-node files"
BASEDIR="$(cd "$(dirname "$0")"; pwd)"
source $BASEDIR/npm_bin.sh

function test_ts_node () {
  npm_bin mocha -r ts-node/register $BASEDIR/../ts-node/**/*_test.ts
}