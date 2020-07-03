#!/usr/bin/env bash
USAGE="<path>"
DESC="provides basename of full path without extention"

function fileName () {
    echo $(basename ${1%.*})
}