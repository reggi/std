import assert from 'assert'
import main from './index'

assert.strictEqual(main.id, 'ts-no-pkg')
assert.strictEqual(main.foo, 'foo')
assert.strictEqual(main.bar, 'bar')
assert.strictEqual(main.baz, 'baz')