#!/bin/bash
USAGE="<word>"
DESC="converts underscore to hyphen"

hyphen () {
  echo "$1" | tr '_' '-'
}