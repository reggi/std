import * as path from 'path'
import { createMock } from './mock'
import { resolvePackages } from './resolve_packages'
import * as assert from 'assert'

describe(path.basename(__filename), () => {
  before(() => createMock())
  it('should provide packages with trailing slash', async () => {
    const pkgs = await resolvePackages('https://raw.githubusercontent.com/reggi/std/master/example/modules/js-pkg/')
    assert.deepStrictEqual(pkgs.map(p => p.packageUrl?.toString()), [
      'https://raw.githubusercontent.com/reggi/std/master/example/modules/js-pkg/package.json',
      'https://raw.githubusercontent.com/reggi/std/master/package.json'
    ])
  })
  it('should provide packages without trailing slash', async () => {
    const pkgs = await resolvePackages('https://raw.githubusercontent.com/reggi/std/master/example/modules/js-pkg')
    assert.deepStrictEqual(pkgs.map(p => p.packageUrl?.toString()), [
      'https://raw.githubusercontent.com/reggi/std/master/package.json'
    ])
  })
  it('should provide packages with file', async () => {
    const pkgs = await resolvePackages('https://raw.githubusercontent.com/reggi/std/master/example/modules/js-pkg/foo.js')
    assert.deepStrictEqual(pkgs.map(p => p.packageUrl?.toString()), [
      'https://raw.githubusercontent.com/reggi/std/master/example/modules/js-pkg/package.json',
      'https://raw.githubusercontent.com/reggi/std/master/package.json'
    ])
  })
  it('should provide packages using cache', async () => {
    const cache = {}
    cache['https://raw.githubusercontent.com/reggi/std/master/example/modules/package.json'] = { name: 'love' }
    const pkgs = await resolvePackages('https://raw.githubusercontent.com/reggi/std/master/example/modules/js-pkg/foo.js', cache)
    assert.deepStrictEqual(pkgs.map(p => p.packageUrl?.toString()), [
      'https://raw.githubusercontent.com/reggi/std/master/example/modules/js-pkg/package.json',
      'https://raw.githubusercontent.com/reggi/std/master/example/modules/package.json',
      'https://raw.githubusercontent.com/reggi/std/master/package.json'
    ])
    assert.deepEqual(pkgs[1].packageContent.name, 'love')
  })
})
