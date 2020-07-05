import assert from 'assert'
import main from './index.mjs'
assert.strictEqual(main.id, 'mjs-no-pkg')
assert.strictEqual(main.foo, 'foo')
assert.strictEqual(main.bar, 'bar')
assert.strictEqual(main.baz, 'baz')