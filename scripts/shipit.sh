#!/bin/bash
# shellcheck disable=SC2034
USAGE="" 
# shellcheck disable=SC2034
DESC="runs git add, commit, and push"

shipit () {
  git add -A && git commit -m "#shipit 🕵️‍♀️🚢" && git push
}