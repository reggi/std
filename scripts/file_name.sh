#!/bin/bash
USAGE="<path>"
DESC="provides basename of full path without extention"

file_name () {
  echo $(basename ${1%.*})
}