import * as path from 'path'
import * as assert from 'assert'
import { ExtendUrl } from './extend_url'

describe(path.basename(__filename), () => {
  it('should pass basic checks', () => {
    const url = new ExtendUrl('http://reggi.com')
    assert.strictEqual(url.hostname, 'reggi.com')
    assert.strictEqual(url.protocol, 'http:')
  })
})
