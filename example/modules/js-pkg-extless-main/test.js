const assert = require('assert')
const relativeMain = require('./main')

assert.strictEqual(relativeMain.id, 'js-pkg-extless-main')
assert.strictEqual(relativeMain.foo, 'foo')
assert.strictEqual(relativeMain.bar, 'bar')
assert.strictEqual(relativeMain.baz, 'baz')

const resolvePackage = require('../js-pkg-extless-main')

assert.strictEqual(resolvePackage.id, 'js-pkg')
assert.strictEqual(resolvePackage.foo, 'foo')
assert.strictEqual(resolvePackage.bar, 'bar')
assert.strictEqual(resolvePackage.baz, 'baz')