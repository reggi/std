#!/bin/bash

# shellcheck disable=SC2034
USAGE="" 
DESC="runs git add, commit, and push"

shipit () {
  git add -A && git commit -m "#shipit 🕵️‍♀️🚢" && git push
}