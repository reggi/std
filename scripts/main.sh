#!/bin/bash
BASEDIR="$(cd "$(dirname "$0")" || exit; pwd)"
# shellcheck source=/dev/null
. "$BASEDIR"/file_name.sh
# shellcheck source=/dev/null
. "$BASEDIR"/underscore.sh
# shellcheck source=/dev/null
. "$BASEDIR"/hyphen.sh

FILES="$(find "$BASEDIR" ! -name 'main.sh' -type f -name '*.sh' -print | sort -t '\0' -n)"
TUSAGE="\\n"
USAGE=""
DESC=""
FOUND=false
SAVE=$1
FIRST=$(underscore "$SAVE")

# loop over script files
for FILE in $FILES; do
  if [ -f "$FILE" ]; then
    # shellcheck source=/dev/null
    . "$FILE"
    FNAME=$(file_name "$FILE")
    PRETTYNAME=$(hyphen "$FNAME")
    BUSAGE=$(printf '%-30s' "$PRETTYNAME $USAGE")   
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