#!/usr/bin/env bash
USAGE=""
DESC="builds a list of native node modules"

build_native_modules () {
  DIR=./ts-node/module/native_modules.json
  node -e "console.log(JSON.stringify(require('module').builtinModules, null, 2))" > $DIR
}