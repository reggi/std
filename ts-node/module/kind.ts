import * as nativeModules from './native_modules.json'
import { matchUrl } from './match_url'

export enum Kind {
  LOCAL = 'LOCAL',
  NATIVE_NODE = 'NATIVE_NODE',
  URL = 'URL',
  NPM = 'NPM'
}

export function kind (m: string) {
  const isLocal = Boolean(m.match(/^\.\.\/|^\.\/|^\//))
  if (isLocal) return Kind.LOCAL
  const isNodeNative = nativeModules.includes(m)
  if (isNodeNative) return Kind.NATIVE_NODE
  const isUrl = matchUrl(m)
  if (isUrl) return Kind.URL
  return Kind.NPM
}
