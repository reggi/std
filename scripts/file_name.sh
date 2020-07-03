#!/bin/bash

# shellcheck disable=SC2034
USAGE=""
DESC="returns a string without extension"

file_name () {
  basename "${1%.*}"
}