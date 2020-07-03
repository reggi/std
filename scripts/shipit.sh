#!/bin/bash
USAGE="" 
DESC="runs git add, commit, and push"

shipit () {
  git add -A && git commit -m "#shipit 🕵️‍♀️🚢" && git push
}