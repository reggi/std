#!/bin/bash

# shellcheck disable=SC2034
USAGE=""
DESC="provides current git branch"

current_branch () {
  git branch --show-current
}