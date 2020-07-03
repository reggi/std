#!/bin/bash

BASEDIR=$(dirname "$0")
# shellcheck source=/dev/null
. "$BASEDIR"/file_name.sh

FILES="$(find "$BASEDIR" ! -name 'main.sh' -type f -name '*.sh' -print | sort -t '\0' -n)"
TUSAGE="\\n"
USAGE=""
DESC=""
FOUND=false

# loop over script files
for FILE in $FILES; do
  if [ -f "$FILE" ]; then
    # shellcheck source=/dev/null
    . "$FILE"
    FNAME=$(file_name "$FILE")
    BUSAGE="$FNAME $USAGE"
    TUSAGE="$TUSAGE\\t$BUSAGE\\n              $DESC\n\n"
    USAGE=""
    if [ "$1" = "$FNAME" ]; then
      FOUND=true
    fi
  fi
done

if [ "$FOUND" = true ]; then
  "$@"
else
  printf "Usage: <...args>\n"
  # shellcheck disable=SC2059
  printf "$TUSAGE"
  exit 1
fi