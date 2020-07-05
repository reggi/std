import * as path from 'path'
import { ExtendUrl } from './extend_url'

function unique (value, index, self) {
  return self.indexOf(value) === index
}

function truthy (value, index, self) {
  return value
}

export class ModuleUrl extends ExtendUrl {
  parent?: ModuleUrl

  static parse (url: string | ModuleUrl) {
    if (url instanceof ModuleUrl) return url.resolve()
    return new ModuleUrl(url)
  }

  get pathnameSplit () {
    return this.pathname.split('/').filter(i => i !== '')
  }

  get basename () {
    if (this.pathnameSplit.length !== 0) return this.pathnameSplit[this.pathnameSplit.length - 1]
    return ''
  }

  set basename (value: string) {
    const p = [...this.pathnameSplit]
    p.pop()
    p.push(value)
    this.pathname = p.join('/')
  }

  get ext () {
    const s = this.basename.split('.')
    if (s.length > 1) return `.${s[s.length - 1]}`
    return ''
  }

  set ext (ext: string) {
    const basename = `${this.filename}${ext}`
    const p = [...this.dirnameSplit, basename]
    this.pathname = p.join('/')
  }

  get filename () {
    return this.basename.replace(new RegExp(`${this.ext}$`), '')
  }

  get hasExt () {
    return Boolean(this.ext !== '')
  }

  get dirnameSplit () {
    const p = [...this.pathnameSplit]
    if (this.ext !== '') {
      p.pop()
      return p
    }
    return this.pathnameSplit
  }

  get dirname () {
    return '/' + this.dirnameSplit.join('/')
  }

  get localize () {
    const protocol = this.protocol.replace(/:/i, '')
    const host = this.port !== '' ? `${this.host}_PORT${this.port}` : this.host
    const parts = [protocol, host, ...this.pathnameSplit]
    return parts.join(path.sep)
  }

  get localizeDir () {
    const directory = this.localize.split('/')
    directory.pop()
    return directory.join('/')
  }

  get levels () {
    return this.pathnameSplit.length
  }

  resolve (path: string = '') {
    const u = new ModuleUrl(path, this.toString())
    u.parent = this
    return u
  }

  get extLineage () {
    const EXTS: string[] = []
    const recursion = (instance: ModuleUrl) => {
      const STATE = instance
      if (STATE.hasExt) EXTS.push(STATE.ext)
      if (STATE.parent !== undefined) {
        recursion(STATE.parent)
      }
    }
    recursion(this)
    return EXTS
  }

  /**
   * Given a url and possible resolve path will return list of possible urls
   * that a node module can be, given that modules can be imported without an
   * extension and may ne nested within a folder as an index.
   * */
  discoverModule (resolve?: string, omitPackage: boolean = false) {
    const STATE = resolve !== undefined ? this.resolve(resolve) : this
    if (STATE.hasExt) return [STATE]
    // this never prioritizes .json even if parent is .json
    const LINEAGE_EXT = STATE.extLineage.filter(ext => ext !== '.json')
    const DEFAULT_EXTS = ['.js', '.json']
    const EXTS = [...LINEAGE_EXT, ...DEFAULT_EXTS].filter(unique).filter(truthy)
    const APPENDED = EXTS.map(EXT => {
      const n = STATE.resolve(`./${STATE.filename}${EXT}`)
      n.ext = EXT
      return n
    })
    const INDEXED = EXTS.map(EXT => {
      const n = STATE.resolve(`./${STATE.filename}/index${EXT}`)
      return n
    })
    if (!omitPackage) {
      const PACKAGE = STATE.resolve(`./${STATE.filename}/package.json`)
      return [...APPENDED, PACKAGE, ...INDEXED]
    } else {
      return [...APPENDED, ...INDEXED]
    }
  }

  /**
   * Similar to discoverModule, but used specifically for package.main, it has
   * two main differences discovered from some testing (1) a package.main path
   * cannot link to a directory with a package.json leading to another
   * package.main (2) main entries can omit current directory "./" whereas for a
   * module it would be treated as a npm or native module [eg. "lib/src.js"]
   * */
  discoverMain (resolve?: string) {
    return this.discoverModule(resolve)
  }

  searchPath (fileName: string) {
    let state = ModuleUrl.parse(this)
    const potentials: ModuleUrl[] = []
    state = state.resolve(`./${fileName}`)
    potentials.push(state)
    Array.from(Array(state.levels - 1).keys()).forEach(i => {
      state = state.resolve(`../${fileName}`)
      potentials.push(state)
    })
    return potentials
  }

  get pkgPotential () {
    return this.searchPath('package.json')
  }

  get tsConfigPotential () {
    return this.searchPath('tsconfig.json')
  }
}
