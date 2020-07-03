import * as path from 'path'
import * as assert from 'assert'
import { matchUrl } from './match_url'

describe(path.basename(__filename), () => {
  it('should pass basic checks', () => {
    assert.deepStrictEqual(matchUrl('http://reggi.com'), true)
    assert.deepStrictEqual(matchUrl('meow'), false)
    assert.deepStrictEqual(matchUrl(), false)
  })
})
