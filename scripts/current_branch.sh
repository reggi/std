#!/usr/bin/env bash
USAGE=""
DESC="provides current git branch"

function current_branch () {
  git branch --show-current
}