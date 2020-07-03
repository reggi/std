import * as path from 'path'
import * as assert from 'assert'
import * as nativeModules from './native_modules.json'

describe(path.basename(__filename), () => { 
  it('should pass basic checks', () => { 
    assert.strictEqual(nativeModules.includes('assert'), true)
    assert.strictEqual(nativeModules.includes('url'), true)
    assert.strictEqual(nativeModules.includes('events'), true)  
  })
})