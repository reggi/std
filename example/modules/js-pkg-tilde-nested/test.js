const assert = require('assert')
const relativeIndex = require('./index')
const tildeIndex = require('~/index')
const tilde = require('~')

assert.strictEqual(relativeIndex.id, 'js-pkg-tilde-nested')
assert.strictEqual(relativeIndex.foo, 'foo')
assert.strictEqual(relativeIndex.bar, 'bar')
assert.strictEqual(relativeIndex.baz, 'baz')

assert.strictEqual(tildeIndex.id, 'js-pkg-tilde')
assert.strictEqual(tildeIndex.foo, 'foo')
assert.strictEqual(tildeIndex.bar, 'bar')
assert.strictEqual(tildeIndex.baz, 'baz')

assert.strictEqual(tilde.id, 'js-pkg-tilde')
assert.strictEqual(tilde.foo, 'foo')
assert.strictEqual(tilde.bar, 'bar')
assert.strictEqual(tilde.baz, 'baz')