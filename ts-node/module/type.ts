import * as module from 'module'

export enum Type { 
  LOCAL = "LOCAL",
  NATIVE_NODE = "NATIVE_NODE",
  URL = "URL",
  NPM = "NPM"
 }

export function type (m: string) {
  const isLocal = m.match(/^\.\.\/|^\.\/|^\//)
  if (isLocal) return Type.LOCAL
  const isNodeNative = module.builtinModules.includes(m)
  if (isNodeNative) return Type.NATIVE_NODE
  const isUrl = m.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/)
  if (isUrl) return Type.URL
  return Type.NPM
}