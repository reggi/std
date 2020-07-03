import * as path from 'path'
import * as assert from 'assert'
import { Kind, kind } from './kind'

describe(path.basename(__filename), () => {
  it('should pass basic checks', () => {
    assert.deepStrictEqual(kind('/cat'), Kind.LOCAL)
    assert.deepStrictEqual(kind('./cat'), Kind.LOCAL)
    assert.deepStrictEqual(kind('../cat'), Kind.LOCAL)
    assert.deepStrictEqual(kind('cat'), Kind.NPM)
    assert.deepStrictEqual(kind('assert'), Kind.NATIVE_NODE)
    assert.deepStrictEqual(kind('http://reggi.com'), Kind.URL)
    assert.deepStrictEqual(kind('https://reggi.com'), Kind.URL)
  })
})
