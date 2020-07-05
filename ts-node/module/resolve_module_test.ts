import * as fs from 'fs'
import * as path from 'path'
import * as assert from 'assert'
import { createMock } from './mock'
import { resolveModule } from './resolve_module'
import { ModuleUrl } from './module_url'

const harness = {
  async resolveModuleContent (urlPath: string, localPath?: string) {
    if (localPath === undefined) localPath = urlPath
    const url = new ModuleUrl(`https://raw.githubusercontent.com/reggi/std/master/example/modules/${urlPath}`)
    const file = await fs.promises.readFile(path.join(__filename, '../../../', 'example/modules/', localPath), 'utf8')
    const { resolved } = await resolveModule(url)
    assert.strictEqual(file, resolved?.moduleContent)
  }
}

describe(path.basename(__filename), () => {
  before(() => createMock())

  it('should read and download itself', async () => {
    const file = await fs.promises.readFile(__filename, 'utf8')
    const { resolved } = await resolveModule('https://raw.githubusercontent.com/reggi/std/master/ts-node/module/resolve_module_test.ts')
    assert.strictEqual(file, resolved?.moduleContent)
  })

  it('should handle resolve cases', async () => {
    await harness.resolveModuleContent('js-no-pkg', 'js-no-pkg/index.js')
    await harness.resolveModuleContent('js-no-pkg/index.js')
    await harness.resolveModuleContent('js-pkg', 'js-pkg/main.js')
    await harness.resolveModuleContent('js-pkg/main.js')
    await harness.resolveModuleContent('js-pkg-extless-main', 'js-pkg-extless-main/main.js')
    await harness.resolveModuleContent('js-pkg-extless-main/main.js')
    await harness.resolveModuleContent('ts-no-pkg/index.ts')
  })

  it('should not resolve index.ts at root', async () => {
    const urlPath = 'ts-no-pkg'
    const url = new ModuleUrl(`https://raw.githubusercontent.com/reggi/std/master/example/modules/${urlPath}`)
    const { resolved } = await resolveModule(url)
    assert.strictEqual(undefined, resolved?.moduleContent)
  })
})
