#!/bin/bash
USAGE=""
DESC="runs shellcheck on scripts directory"

lint_scripts () {
  shellcheck ./scripts/*.sh --shell=sh
}