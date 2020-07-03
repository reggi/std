import * as path from 'path'
import * as assert from 'assert'
import { Type, type } from './type'

describe(path.basename(__filename), () => { 
  it('should pass basic checks', () => {
    assert.deepEqual(type('/cat'), Type.LOCAL)
    assert.deepEqual(type('./cat'), Type.LOCAL)
    assert.deepEqual(type('../cat'), Type.LOCAL)
    assert.deepEqual(type('cat'), Type.NPM)
    assert.deepEqual(type('assert'), Type.NATIVE_NODE)
    assert.deepEqual(type('http://reggi.com'), Type.URL)
    assert.deepEqual(type('https://reggi.com'), Type.URL)
  })
})