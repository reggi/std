import * as path from 'path'
import * as assert from 'assert'
import { ModuleUrl } from './module_url'

describe(path.basename(__filename), () => {
  it('should pass basic checks', () => {
    const mu = new ModuleUrl('https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/bar.js')

    assert.deepStrictEqual(mu.discover().map(t => t.toString()), [
      'https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/bar.js'
    ])
    assert.deepStrictEqual(mu.pathname, '/reggi/modules/master/import-examples/js-no-pkg/bar.js')
    assert.deepStrictEqual(mu.pathnameSplit, ['reggi', 'modules', 'master', 'import-examples', 'js-no-pkg', 'bar.js'])
    assert.deepStrictEqual(mu.dirname, '/reggi/modules/master/import-examples/js-no-pkg')
    assert.deepStrictEqual(mu.dirnameSplit, ['reggi', 'modules', 'master', 'import-examples', 'js-no-pkg'])
    assert.deepStrictEqual(mu.basename, 'bar.js')
    assert.deepStrictEqual(mu.ext, '.js')
    assert.deepStrictEqual(mu.hasExt, true)
    mu.basename = 'john.txt'
    assert.deepStrictEqual(mu.hasExt, true)
    assert.deepStrictEqual(mu.ext, '.txt')
    assert.deepStrictEqual(mu.basename, 'john.txt')
    assert.deepStrictEqual(mu.dirnameSplit, ['reggi', 'modules', 'master', 'import-examples', 'js-no-pkg'])
    assert.deepStrictEqual(mu.levels, 6)
    assert.deepStrictEqual(mu.dirname, '/reggi/modules/master/import-examples/js-no-pkg')
    assert.deepStrictEqual(mu.pathnameSplit, ['reggi', 'modules', 'master', 'import-examples', 'js-no-pkg', 'john.txt'])
    assert.deepStrictEqual(mu.pathname, '/reggi/modules/master/import-examples/js-no-pkg/john.txt')
    assert.deepStrictEqual(mu.toString(), 'https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/john.txt')
    assert.deepStrictEqual(mu.discover().map(t => t.toString()), [
      'https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/john.txt'
    ])

    assert.deepStrictEqual(mu.pkgPotential, [
      'https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/package.json',
      'https://raw.githubusercontent.com/reggi/modules/master/import-examples/package.json',
      'https://raw.githubusercontent.com/reggi/modules/master/package.json',
      'https://raw.githubusercontent.com/reggi/modules/package.json',
      'https://raw.githubusercontent.com/reggi/package.json',
      'https://raw.githubusercontent.com/package.json'
    ])

    assert.deepStrictEqual(mu.tsConfigPotential, [
      'https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/tsconfig.json',
      'https://raw.githubusercontent.com/reggi/modules/master/import-examples/tsconfig.json',
      'https://raw.githubusercontent.com/reggi/modules/master/tsconfig.json',
      'https://raw.githubusercontent.com/reggi/modules/tsconfig.json',
      'https://raw.githubusercontent.com/reggi/tsconfig.json',
      'https://raw.githubusercontent.com/tsconfig.json'
    ])

    assert.deepStrictEqual(mu.localize, 'https/raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/john.txt')
    assert.deepStrictEqual(mu.localizeDir, 'https/raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg')
    assert.deepStrictEqual(mu.resolve('/doughnout').toString(), 'https://raw.githubusercontent.com/doughnout')
    assert.deepStrictEqual(mu.resolve('/doughnout').levels, 1)
    assert.deepStrictEqual(mu.resolve('./doughnout').toString(), 'https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/doughnout')
    assert.deepStrictEqual(mu.resolve('../doughnouts').toString(), 'https://raw.githubusercontent.com/reggi/modules/master/import-examples/doughnouts')
  })

  it('should support prioritize discovering .ts files fom .ts files', () => {
    const mu = new ModuleUrl('https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/bar.ts')

    assert.deepStrictEqual(mu.discover().map(t => t.toString()), [
      'https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/bar.ts'
    ])
  })

  it('should sustain extension liniage when discovering .ts files', () => {
    const mu = new ModuleUrl('https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/bar.ts')
    const baz = mu.resolve('./baz')
    const foo = baz.resolve('./foo')

    assert.deepStrictEqual(foo.discover().map(t => t.toString()), [
      'https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/foo.ts',
      'https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/foo.js',
      'https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/foo.json',
      'https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/foo/package.json',
      'https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/foo/index.ts',
      'https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/foo/index.js',
      'https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/foo/index.json'
    ])
  })

  it('should do relative discovery', () => {
    const mu = new ModuleUrl('https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/bar.ts')
    assert.deepStrictEqual(mu.discover('./foo').map(t => t.toString()), [
      'https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/foo.ts',
      'https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/foo.js',
      'https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/foo.json',
      'https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/foo/package.json',
      'https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/foo/index.ts',
      'https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/foo/index.js',
      'https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/foo/index.json'
    ])
  })

  it('should do relative discovery with ext', () => {
    const mu = new ModuleUrl('https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/bar.ts')
    assert.deepStrictEqual(mu.discover('./foo.ts').map(t => t.toString()), [
      'https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/foo.ts'
    ])
  })

  it('should do relative discovery with json', () => {
    const mu = new ModuleUrl('https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/bar.ts')
    assert.deepStrictEqual(mu.discover('./foo.json').map(t => t.toString()), [
      'https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/foo.json'
    ])
  })

  it('should discover extensionless paths correctly', () => {
    const mu = new ModuleUrl('https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/bar')

    assert.deepStrictEqual(mu.discover().map(t => t.toString()), [
      'https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/bar.js',
      'https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/bar.json',
      'https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/bar/package.json',
      'https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/bar/index.js',
      'https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/bar/index.json'
    ])
  })
})
