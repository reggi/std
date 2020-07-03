#!/bin/bash
USAGE=""
DESC="provides a string without extension"

file_name () {
  basename "${1%.*}"
}