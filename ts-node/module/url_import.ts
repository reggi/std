import { ModuleUrl } from './module_url'
import * as path from 'path'

/** points to a local version of a downloaded file */
export default function urlImport (url: string) {
  const e = ModuleUrl.parse(url)
  return require(path.join('./download', e.localize))
}
