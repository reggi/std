import * as path from 'path'
import * as assert from 'assert'
import { matchUrl } from './match_url'

describe(path.basename(__filename), () => { 
  it('should pass basic checks', () => { 
    assert.deepEqual(matchUrl('http://reggi.com'), true)
    assert.deepEqual(matchUrl('meow'), false)
    assert.deepEqual(matchUrl(), false)
  })
})
