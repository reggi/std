
# shellcheck disable=SC2034
USAGE="<word-to-underscore>"
DESC=""

hyphen_to_underscore () {
  echo "$1" | tr '-' '_'
}