import * as fs from 'fs'
import * as path from 'path'
import * as assert from 'assert'
import { createMock } from './mock'
import { fetch } from './fetch'

describe(path.basename(__filename), () => {
  before(() => createMock())

  it('should read and download itself', async () => {
    const file = await fs.promises.readFile(__filename, 'utf8')
    const fetchedFile = await fetch('https://raw.githubusercontent.com/reggi/std/master/ts-node/module/fetch_test.ts')
    assert.strictEqual(file, fetchedFile)
  })

  it('should get and parse package main', async () => {
    const fetchedFile = await fetch('https://raw.githubusercontent.com/reggi/std/master/example/modules/js-pkg/package.json')
    assert.ok(fetchedFile)
    const pkg = JSON.parse(fetchedFile)
    assert.strictEqual(pkg.main, 'main.js')
  })

  it('should fetch http', async () => {
    const fetchedFile = await fetch('http://raw.githubusercontent.com/reggi/std/master/example/modules/js-pkg/package.json')
    assert.ok(fetchedFile)
    const pkg = JSON.parse(fetchedFile)
    assert.strictEqual(pkg.main, 'main.js')
  })
})
