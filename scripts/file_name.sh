#!/bin/bash

# shellcheck disable=SC2034
USAGE=""
DESC="provides a string without extension"

file_name () {
  basename "${1%.*}"
}