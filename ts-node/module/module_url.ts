import * as path from 'path'
import { ExtendUrl } from './extend_url'

function unique(value, index, self) { 
  return self.indexOf(value) === index;
}

function truthy(value, index, self) { 
  return value
}

export class ModuleUrl extends ExtendUrl{
  parent?: ModuleUrl

  constructor(url: string, base?: string | URL | ExtendUrl | ModuleUrl) { 
    super(url, base)
  }

  static parse(url: string | ModuleUrl) { 
    if (url instanceof ModuleUrl) return url.resolve()
    return new ModuleUrl(url)
  }

  get pathnameSplit() { 
    return this.pathname.split('/').filter(i => i !== '')
  }

  get basename() { 
    if (this.pathnameSplit.length) return this.pathnameSplit[this.pathnameSplit.length - 1]
    return ''
  }

  set basename(value: string) { 
    const p = [...this.pathnameSplit]
    p.pop()
    p.push(value)
    this.pathname = p.join('/')
  }

  get ext() {
    const s = this.basename.split('.')
    if (s.length > 1) return `.${s[s.length - 1]}`
    return ''
  }

  set ext(ext: string) { 
    const basename = `${this.filename}${ext}`
    const p = [...this.dirnameSplit, basename]
    this.pathname = p.join('/')
  }

  get filename() {
    return this.basename.replace(new RegExp(`${this.ext}$`), '')
  }

  get hasExt() { 
    return Boolean(this.ext !== '')
  }

  get dirnameSplit() {
    const p = [...this.pathnameSplit]
    if (this.ext) {
      p.pop()
      return p
    }
    return this.pathnameSplit
  }

  get dirname() {
    return "/" + this.dirnameSplit.join('/')
  }

  get localize() {
    const protocol = this.protocol.replace(/:/i, '')
    const host = this.port ? `${this.host}_PORT${this.port}` : this.host
    const parts = [protocol, host, ...this.pathnameSplit]
    return parts.join(path.sep)
  }

  get localizeDir() {
    const directory = this.localize.split('/')
    directory.pop()
    return directory.join('/')
  }

  get levels() {
    return this.pathnameSplit.length
  }

  resolve(path: string = '') {
    const u = new ModuleUrl(path, this.toString())
    u.parent = this
    return u
  }

  get extLiniage() { 
    const EXTS = []
    const recursion = (instance: ModuleUrl) => {
      let STATE = instance
      if (STATE.hasExt) EXTS.push(STATE.ext)
      if (STATE.parent) recursion(STATE.parent)
    }
    recursion(this)
    return EXTS
  }

  discover() {
    if (this.hasExt) return [this]
    const LINIAGE_EXT = this.extLiniage
    const DEFAULT_EXTS = ['.js', '.json']
    const EXTS = [...LINIAGE_EXT, ...DEFAULT_EXTS].filter(unique).filter(truthy)
    
    const APPENDED = EXTS.map(EXT => {
      const n = this.resolve(`./${this.filename}${EXT}`)
      n.ext = EXT
      return n
    })
      
    const INDEXED = EXTS.map(EXT => {
      const n = this.resolve(`./${this.filename}/index${EXT}`)
      return n
    })
    
    const PACKAGE = this.resolve(`./${this.filename}/package.json`)

    return [...APPENDED, PACKAGE, ...INDEXED]
  }

  searchPath(fileName: string) {
    let state = ModuleUrl.parse(this)
    const current = state.resolve(`./${fileName}`).toString()
    const potential = Array.from(Array(state.levels - 1).keys()).map(i => { 
      state = state.resolve(`../${fileName}`)
      return state.toString()
    })
    return [current, ...potential]
  }

  get pkgPotential() { 
    return this.searchPath('package.json')
  }

  get tsConfigPotential() { 
    return this.searchPath('tsconfig.json')
  }

}