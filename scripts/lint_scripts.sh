# shellcheck disable=SC2034
USAGE=""
DESC="runs shellcheck on scripts directory"

lint_scripts () {
  shellcheck ./scripts/*.sh --shell=sh
}