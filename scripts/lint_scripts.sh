#!/bin/bash
# shellcheck disable=SC2034
USAGE=""
# shellcheck disable=SC2034
DESC="runs shellcheck on scripts directory"

lint_scripts () {
  shellcheck ./scripts/*.sh --shell=sh
}