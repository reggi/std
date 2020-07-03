#!/bin/bash

BASEDIR=$(dirname "$0")
# shellcheck source=/dev/null
. "$BASEDIR"/file_name.sh
# shellcheck source=/dev/null
. "$BASEDIR"/hyphen_to_underscore.sh

FILES="$(find "$BASEDIR" ! -name 'main.sh' -type f -name '*.sh' -print | sort -t '\0' -n)"
TUSAGE="\\n"
USAGE=""
DESC=""
FOUND=false
SAVE=$1
FIRST=$(hyphen_to_underscore "$SAVE")

# loop over script files
for FILE in $FILES; do
  if [ -f "$FILE" ]; then
    # shellcheck source=/dev/null
    . "$FILE"
    FNAME=$(file_name "$FILE")
    BUSAGE=$(printf '%-30s' "$FNAME $USAGE")   
    TUSAGE="$TUSAGE $BUSAGE $DESC\n"
    USAGE=""
    if [ "$1" = "$FNAME" ]; then
      FOUND=true
    fi
    if [ "$FIRST" = "$FNAME" ]; then
      FOUND=true
    fi
  fi
done

if [ "$FOUND" = true ]; then
  shift
  "$FIRST" "$@"
else
  printf "Usage: <...args>\n"
  echo "$TUSAGE"
  exit 1
fi