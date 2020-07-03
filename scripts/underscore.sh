#!/bin/bash
USAGE="<word>"
DESC="converts hyphens to underscore"

underscore () {
  echo "$1" | tr '-' '_'
}
