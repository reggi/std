
# shellcheck disable=SC2034
USAGE="<word>"
DESC="converts hyphens to underscore"

underscore () {
  echo "$1" | tr '-' '_'
}

hyphen () {
  echo "$1" | tr '_' '-'
}