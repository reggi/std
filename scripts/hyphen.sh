#!/bin/bash
# shellcheck disable=SC2034
USAGE="<word>"
# shellcheck disable=SC2034
DESC="converts underscore to hyphen"

hyphen () {
  echo "$1" | tr '_' '-'
}