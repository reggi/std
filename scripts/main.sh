#!/usr/bin/env bash
BASEDIR=$(dirname "$0")
source $BASEDIR/file_name.sh

# define variables
FILES="$(find "$BASEDIR" ! -name 'main.sh' -type f -name '*.sh' -print | sort -t '\0' -n)"
TUSAGE="\\n"
HELP=false
FNPREFIX=''
USAGE=""
DESC=""
FOUND=false

# loop over script files
for FILE in $FILES; do
    if [ -f "$FILE" ]; then
        # shellcheck source=/dev/null
        . "$FILE" --source-only
        FNAME=`fileName $FILE`

        BUSAGE="$FNAME $USAGE"
        TUSAGE="$TUSAGE\\t$BUSAGE\\n              $DESC\n\n"
        USAGE=""
        if [[ "$1" = "$FNAME"  ||  "$FOUND" = true ]]; then
            FOUND=true
        fi
    fi
done

namespaceRmDash () {
    echo "$1" | tr -d -
}

namespaceUpperCase () {
    echo "$(echo "${1:0:1}" | tr '[:lower:]' '[:upper:]')${1:1}"
}

showUsage {
    printf "Usage: <...args>\n"
    printf "$TUSAGE"
    exit 0
}

if [[ ! -z "$@" && "$FOUND" = true ]]; then
    eval "$@"
else
    showUsage
fi