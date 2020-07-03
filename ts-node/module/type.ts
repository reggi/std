import * as nativeModules from './native_modules.json'
import { matchUrl } from './match_url'

export enum Type { 
  LOCAL = "LOCAL",
  NATIVE_NODE = "NATIVE_NODE",
  URL = "URL",
  NPM = "NPM"
 }

export function type (m: string) {
  const isLocal = m.match(/^\.\.\/|^\.\/|^\//)
  if (isLocal) return Type.LOCAL
  const isNodeNative = nativeModules.includes(m)
  if (isNodeNative) return Type.NATIVE_NODE
  const isUrl = matchUrl(m)
  if (isUrl) return Type.URL
  return Type.NPM
}