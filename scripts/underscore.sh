#!/bin/bash
# shellcheck disable=SC2034
USAGE="<word>"
# shellcheck disable=SC2034
DESC="converts hyphens to underscore"

underscore () {
  echo "$1" | tr '-' '_'
}
