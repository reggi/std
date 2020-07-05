import * as path from 'path'
import { EventEmitter } from 'events'
import { ModuleUrl } from './module_url'
import { parser } from './parser'
import { kind, Kind } from './kind'
import { ResolvedModule, resolveModule } from './resolve_module'
import * as fs from 'fs'
import { resolvePackages } from './resolve_packages'
import { matchUrl } from './match_url'

const debug = (...msg) => {
  msg.forEach(m => console.log(m))
}

const SAVE_LOCATION = path.join('./download')
const URL_LIST: Array<string | undefined> = []
const PKG_STORE = {}
const LOCAL_FILE = Symbol('LOCAL_FILE')
const FILE = Symbol('FILE')
const DOWNLOAD = Symbol('DOWNLOAD')
const MODULE = Symbol('MODULE')
const PKG_USE_MAIN = Symbol('PKG_USE_MAIN')
const PKG_USE_DEPENDENCY = Symbol('PKG_USE_DEPENDENCY')

const e = new EventEmitter()

async function saveFile (filePath: string, content: any) {
  debug('saving file')
  await fs.promises.mkdir(path.dirname(filePath), { recursive: true })
  return await fs.promises.writeFile(filePath, content)
}

interface UpdatePackage { main?: string, dependencies?: any, devDependencies?: any }

/** check to see if file currently exists, if so updates the file, if not creates it */
async function updateJson (filePath: string, content: UpdatePackage) {
  debug('updating package')
  const existing = await (async () => {
    try {
      const file = await fs.promises.readFile(filePath, 'utf8')
      return JSON.parse(file)
    } catch (e) {
      return {}
    }
  })()
  const pkg = (() => {
    const dependencies = {
      ...(existing?.dependencies !== undefined ? existing?.dependencies : {}),
      ...(content?.dependencies !== undefined ? content?.dependencies : {})
    }
    const devDependencies = {
      ...(existing?.devDependencies !== undefined ? existing?.devDependencies : {}),
      ...(content?.devDependencies !== undefined ? content?.devDependencies : {})
    }
    const root = {
      ...(existing !== undefined ? existing : {}),
      ...(content !== undefined ? content : {})
    }
    return { ...root, dependencies, devDependencies }
  })()
  await fs.promises.mkdir(path.dirname(filePath), { recursive: true })
  return await fs.promises.writeFile(filePath, JSON.stringify(pkg, null, 2))
}

/** adds usage for main within a package */
e.on(PKG_USE_MAIN, (pl: ResolvedModule) => {
  debug('pkg use main')
  if (pl?.packageUrl === undefined) return
  if (pl?.packageContent === undefined) return
  // stores the package for later
  PKG_STORE[pl.packageUrl.toString()] = pl?.packageContent
  if (pl?.packageContent?.main === undefined) return
  const filePath = path.join(SAVE_LOCATION, pl.packageUrl.localize)
  updateJson(filePath, { main: pl.packageContent.main })
    .catch(e => { throw e })
})

/** adds usage for a given module with a local package */
e.on(PKG_USE_DEPENDENCY, (packageUrl: ModuleUrl, u: UpdatePackage) => {
  debug('pkg use dep')
  const filePath = path.join(SAVE_LOCATION, packageUrl.localize)
  updateJson(filePath, u).catch(e => { throw e })
})

e.on(MODULE, (pl: ResolvedModule & { mod: string }) => {
  debug(`module ${pl.mod}`);
  (async () => {
    if (pl.moduleUrl === undefined) return
    const coreModule = pl.mod.split('/')[0]
    const packages = await resolvePackages(pl.moduleUrl, PKG_STORE)
    for (const p of packages) {
      if (p.packageContent === undefined) return
      if (p.packageUrl === undefined) return
      if (p.packageError !== undefined) return
      PKG_STORE[p.packageUrl.toString()] = p.packageContent
      const depMatch = p?.packageContent?.dependencies[coreModule]
      const devDepMatch = p?.packageContent?.devDependencies[coreModule]
      if (depMatch !== undefined) {
        e.emit(PKG_USE_DEPENDENCY, p.packageUrl, { dependencies: { [coreModule]: depMatch } })
        break
      }
      if (devDepMatch !== undefined) {
        e.emit(PKG_USE_DEPENDENCY, p.packageUrl, { devDependencies: { [coreModule]: depMatch } })
        break
      }
    }
  })().catch(e => { throw e })
})

e.on(FILE, (pl: ResolvedModule) => {
  debug('file')
  if (pl.moduleContent === undefined) return
  if (pl.moduleUrl === undefined) return
  const deps = parser(pl.moduleContent)
  const handle = (mod: string) => {
    const k = kind(mod)
    if (k === Kind.LOCAL) {
      if (pl.moduleUrl !== undefined) {
        e.emit(DOWNLOAD, pl.moduleUrl.resolve(mod))
      }
    } else if (k === Kind.URL) {
      e.emit(DOWNLOAD, pl.moduleUrl?.resolve(mod))
    } else if (k === Kind.NPM) {
      e.emit(MODULE, { ...pl, mod })
    }
  }
  deps.requires.map(handle)
  deps.imports.map(handle)
  deps.urlImports.map(handle)
  const filePath = path.join(SAVE_LOCATION, pl.moduleUrl.localize)
  saveFile(filePath, pl.moduleContent).catch(e => { throw e })
})

e.on(DOWNLOAD, (url: string | ModuleUrl) => {
  debug('DOWNLOAD')
  if (URL_LIST.includes(url.toString())) return
  url = ModuleUrl.parse(url)
  resolveModule(url).then(({ resolved }) => {
    if (resolved === null) {
      throw new Error(`file not found for ${url.toString()}`)
    }
    URL_LIST.push(resolved.moduleUrl?.toString())
    URL_LIST.push(resolved.packageUrl?.toString())
    URL_LIST.push(url?.toString())
    if (resolved?.packageContent !== undefined) {
      e.emit(PKG_USE_MAIN, resolved)
    }
    if (resolved?.moduleContent !== undefined) {
      e.emit(FILE, resolved)
    }
  }).catch(e => { throw e })
})

e.on(LOCAL_FILE, (file: string) => {
  const deps = parser(file)
  const handle = (mod: string) => {
    const k = kind(mod)
    if (k === Kind.URL) {
      e.emit(DOWNLOAD, mod)
    }
  }
  deps.requires.map(handle)
  deps.imports.map(handle)
  deps.urlImports.map(handle)
})

const args = process.argv.slice(2)

if (matchUrl(args[0])) {
  e.emit(DOWNLOAD, args[0])
} else {
  const file = fs.readFileSync(args[0], 'utf8')
  e.emit(LOCAL_FILE, file)
}
