import * as path from 'path'
import * as assert from 'assert'
import { matchUrl } from './match_url'
import { ModuleUrl } from './module_url'

describe(path.basename(__filename), () => { 
  it('should pass basic checks', () => { 
    const mu = new ModuleUrl("https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/bar.js")
    
    assert.deepEqual(mu.discover().map(t => t.toString()), [
      'https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/bar.js'
    ])
    assert.deepEqual(mu.pathname, "/reggi/modules/master/import-examples/js-no-pkg/bar.js")
    assert.deepEqual(mu.pathnameSplit, ["reggi","modules","master","import-examples","js-no-pkg","bar.js"])
    assert.deepEqual(mu.dirname, "/reggi/modules/master/import-examples/js-no-pkg")
    assert.deepEqual(mu.dirnameSplit, ["reggi", "modules", "master", "import-examples", "js-no-pkg"])
    assert.deepEqual(mu.basename, "bar.js")
    assert.deepEqual(mu.ext, ".js")
    assert.deepEqual(mu.hasExt, true)
    mu.basename = 'john.txt'
    assert.deepEqual(mu.hasExt, true)
    assert.deepEqual(mu.ext, ".txt")
    assert.deepEqual(mu.basename, "john.txt")
    assert.deepEqual(mu.dirnameSplit, ["reggi","modules","master","import-examples","js-no-pkg"])
    assert.deepEqual(mu.levels, 6)
    assert.deepEqual(mu.dirname, "/reggi/modules/master/import-examples/js-no-pkg")
    assert.deepEqual(mu.pathnameSplit, ["reggi","modules","master","import-examples","js-no-pkg","john.txt"])
    assert.deepEqual(mu.pathname, "/reggi/modules/master/import-examples/js-no-pkg/john.txt")
    assert.deepEqual(mu.toString(), "https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/john.txt")
    assert.deepEqual(mu.discover().map(t => t.toString()), [
      'https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/john.txt'
    ])

    assert.deepEqual(mu.pkgPotential, [
      'https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/package.json',
      'https://raw.githubusercontent.com/reggi/modules/master/import-examples/package.json',
      'https://raw.githubusercontent.com/reggi/modules/master/package.json',
      'https://raw.githubusercontent.com/reggi/modules/package.json',
      'https://raw.githubusercontent.com/reggi/package.json',
      'https://raw.githubusercontent.com/package.json'
    ])

    assert.deepEqual(mu.tsConfigPotential, [
      'https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/tsconfig.json',
      'https://raw.githubusercontent.com/reggi/modules/master/import-examples/tsconfig.json',
      'https://raw.githubusercontent.com/reggi/modules/master/tsconfig.json',
      'https://raw.githubusercontent.com/reggi/modules/tsconfig.json',
      'https://raw.githubusercontent.com/reggi/tsconfig.json',
      'https://raw.githubusercontent.com/tsconfig.json'
    ])

    assert.deepEqual(mu.localize, 'https/raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/john.txt')
    assert.deepEqual(mu.localizeDir, 'https/raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg')
    assert.deepEqual(mu.resolve('/doughnout').toString(), 'https://raw.githubusercontent.com/doughnout')
    assert.deepEqual(mu.resolve('/doughnout').levels, 1)
    assert.deepEqual(mu.resolve('./doughnout').toString(), 'https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/doughnout')
    assert.deepEqual(mu.resolve('../doughnouts').toString(), 'https://raw.githubusercontent.com/reggi/modules/master/import-examples/doughnouts')
    
  })

  it('should support prioritize discovering .ts files fom .ts files', () => { 
    const mu = new ModuleUrl("https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/bar.ts")

    assert.deepEqual(mu.discover().map(t => t.toString()), [
      'https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/bar.ts'
    ])
  })

  it('should sustain extension liniage when discovering .ts files', () => { 
    const mu = new ModuleUrl("https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/bar.ts")
    const baz = mu.resolve('./baz')
    const foo = baz.resolve('./foo')

    assert.deepEqual(foo.discover().map(t => t.toString()), [
      "https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/foo.ts",
      "https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/foo.js",
      "https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/foo.json",
      "https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/foo/package.json",
      "https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/foo/index.ts",
      "https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/foo/index.js",
      "https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/foo/index.json",
    ])
  })

  it('discover extensionless paths correctly', () => { 
    const mu = new ModuleUrl("https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/bar")
    
    assert.deepEqual(mu.discover().map(t => t.toString()), [
      "https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/bar.js",
      "https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/bar.json",
      "https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/bar/package.json",
      "https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/bar/index.js",
      "https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-no-pkg/bar/index.json"
    ])
  })
})
