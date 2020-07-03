import * as path from 'path'
import * as assert from 'assert'
import { parser } from './parser'

describe(path.basename(__filename), () => { 
  it('should pass basic checks', () => { 
    assert.deepStrictEqual(parser(`
    const a = require('url-import')
    import b from 'example'
    const c = a('https://mod.reggi.com/import-examples/js-no-pkg/index.js')
    `), {
      requires: [ 'url-import' ],
      imports: [ 'example' ],
      urlImports: [ 'https://mod.reggi.com/import-examples/js-no-pkg/index.js' ]
    })

    assert.deepStrictEqual(parser(`
    require('alpha')
    require('beta')
    require('gamma')
    `), {
      requires: [ 'alpha', 'beta', 'gamma' ],
      imports: [ ],
      urlImports: [ ]
    })

    assert.deepStrictEqual(parser(`
    const dep = require('url-import')
    const a = dep('https://mod.reggi.com/import-examples/js-no-pkg/foo.js')
    const b = dep('https://mod.reggi.com/import-examples/js-no-pkg/bar.js')
    const c = dep('https://mod.reggi.com/import-examples/js-no-pkg/baz.js')
    `), {
      requires: [ 'url-import' ],
      imports: [ ],
      urlImports: [
        'https://mod.reggi.com/import-examples/js-no-pkg/foo.js',
        'https://mod.reggi.com/import-examples/js-no-pkg/bar.js',
        'https://mod.reggi.com/import-examples/js-no-pkg/baz.js'
      ]
    })

    assert.deepStrictEqual(parser(`
    import dep from 'url-import'
    const a = dep('https://mod.reggi.com/import-examples/js-no-pkg/foo.js')
    const b = dep('https://mod.reggi.com/import-examples/js-no-pkg/bar.js')
    const c = dep('https://mod.reggi.com/import-examples/js-no-pkg/baz.js')
    `), {
      requires: [  ],
      imports: [ 'url-import' ],
      urlImports: [
        'https://mod.reggi.com/import-examples/js-no-pkg/foo.js',
        'https://mod.reggi.com/import-examples/js-no-pkg/bar.js',
        'https://mod.reggi.com/import-examples/js-no-pkg/baz.js'
      ]
    })

    assert.deepStrictEqual(parser(`
    import a from 'https://mod.reggi.com/import-examples/js-no-pkg/foo.js'
    import b from 'https://mod.reggi.com/import-examples/js-no-pkg/bar.js'
    import c from 'https://mod.reggi.com/import-examples/js-no-pkg/baz.js'
    `), {
      requires: [  ],
      imports: [ 
          'https://mod.reggi.com/import-examples/js-no-pkg/foo.js',
          'https://mod.reggi.com/import-examples/js-no-pkg/bar.js',
          'https://mod.reggi.com/import-examples/js-no-pkg/baz.js'
      ],
      urlImports: []
    })

    assert.deepStrictEqual(parser(`
    type Love = 'I Love You!'
    import a from 'https://mod.reggi.com/import-examples/js-no-pkg/foo.js'
    import b from 'https://mod.reggi.com/import-examples/js-no-pkg/bar.js'
    import c from 'https://mod.reggi.com/import-examples/js-no-pkg/baz.js'
    `), {
      requires: [  ],
      imports: [ 
          'https://mod.reggi.com/import-examples/js-no-pkg/foo.js',
          'https://mod.reggi.com/import-examples/js-no-pkg/bar.js',
          'https://mod.reggi.com/import-examples/js-no-pkg/baz.js'
      ],
      urlImports: []
    })
  })
})

