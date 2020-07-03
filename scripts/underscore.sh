#!/bin/bash
# shellcheck disable=SC2034
USAGE="<word>"
DESC="converts hyphens to underscore"

underscore () {
  echo "$1" | tr '-' '_'
}
