#!/bin/bash 
BASEDIR="$(cd "$(dirname "$0")"; pwd)"
echo '----------------------------------------'
echo "testing $BASEDIR"
echo '----------------------------------------'
cd "$BASEDIR" || exit

set -e

find . -name "node_modules" -exec rm -rf '{}' +

if [ -z "$CI" ]
then
  echo "\$CI is not set, delete package locks"
  find . -name 'package-lock.json' -type f -delete
else
  echo "\$CI is set"
fi

alias ts-node=../node_modules/.bin/ts-node

node ./js-no-pkg/test.js
echo "js-no-pkg ✅"

node ./js-pkg/test.js
echo "js-pkg ✅"

npm -C ./js-pkg-tilde -s install && node ./js-pkg-tilde/test.js
echo "js-pkg-tilde ✅"

npm -C ./js-pkg-tilde-nested -s install && node ./js-pkg-tilde-nested/test.js
echo "js-pkg-tilde-nested ✅"

node --experimental-modules ./mjs-no-pkg/test.mjs
echo "mjs-no-pkg ✅"

npm -C ./mjs-pkg-tilde -s install && node --experimental-modules ./mjs-pkg-tilde/test.mjs
echo "mjs-pkg-tilde ✅"

npm -C ./mjs-pkg-tilde-nested -s install && node --experimental-modules ./mjs-pkg-tilde-nested/test.mjs
echo "mjs-pkg-tilde-nested ✅"

ts-node ./ts-no-pkg/index.ts
echo "ts-no-pkg ✅"

npm -C ./ts-pkg-tilde -s install && ts-node -p ./ts-pkg-tilde/tsconfig.json ./ts-pkg-tilde/test.ts
echo "ts-pkg-tilde ✅"

npm -C ./ts-pkg-tilde-nested -s install && ts-node -p ./ts-pkg-tilde-nested/tsconfig.json ./ts-pkg-tilde-nested/test.ts
echo "ts-pkg-tilde-nested ✅"