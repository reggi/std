import * as assert from 'assert'
import relativeIndex from './index'
import tildeIndex from '~/index'
import tilde from '~'

assert.strictEqual(relativeIndex.id, 'ts-pkg-tilde-nested')
assert.strictEqual(relativeIndex.foo, 'foo')
assert.strictEqual(relativeIndex.bar, 'bar')
assert.strictEqual(relativeIndex.baz, 'baz')

assert.strictEqual(tildeIndex.id, 'ts-pkg-tilde')
assert.strictEqual(tildeIndex.foo, 'foo')
assert.strictEqual(tildeIndex.bar, 'bar')
assert.strictEqual(tildeIndex.baz, 'baz')

assert.strictEqual(tilde.id, 'ts-pkg-tilde')
assert.strictEqual(tilde.foo, 'foo')
assert.strictEqual(tilde.bar, 'bar')
assert.strictEqual(tilde.baz, 'baz')