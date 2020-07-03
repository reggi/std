#!/usr/bin/env bash
USAGE="<path>"
DESC="provides basename of full path without extention"

fileName () {
    echo $(basename ${1%.*})
}