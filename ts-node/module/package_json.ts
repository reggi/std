import { ModuleUrl } from './module_url'

interface ModuleMatch {
  /** the url of the matched package.json file */
  url: ModuleUrl
  /** the module name */
  mod: string
  /** the version of the module */
  version: string
  /** the property the module was found under */
  property: 'devDependecies"' | 'dependencies'
}

/**
 * library to help with the delegation of detected npm modules found in a
 * downloaded file from a url. This should handle caching all found package
 * files indexed by their id. Given a url and a module, should respond either
 * with (1) an error because no match was found (2) report that module used was
 * must resort to native node module (3) placement of top level "general"
 * package placement (4) placement of bottom level "specific" package placement
 * to handle duplicate dependencies with differing module versions.
 */
export class PackageJson {
  store = {}
  /** caches the package.json file for later use */
  save (url: ModuleUrl, file: string | any) {
    const id = url.toString()
    if (typeof file === 'string') {
      file = JSON.parse(file)
    }
    this.store[id] = file
  }

  /** checks store or fetches package.json and addes it to store */
  fetch (url: ModuleUrl) {
    const id = url.toString()
    if (this.store[id] !== 'undefined') {
      return this.store[id]
    }
  }

  findDependency (url: ModuleUrl, mod: string) {

  }
}
