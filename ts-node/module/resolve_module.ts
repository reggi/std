import { ModuleUrl } from './module_url'
import { fetch } from './fetch'

const debug = (...msg) => {
  // msg.forEach(m => console.log(m))
}

/** used to iterate possible place the module can exist */
export interface ResolvedModule {
  /** the url attempted */
  moduleUrl?: ModuleUrl
  /** content from fetched file */
  moduleContent?: string | undefined
  /** checks to see if basename is a boolean */
  packageUrl?: ModuleUrl
  /** parsed package.json content */
  packageContent?: any
  /** if caught error during JSON.parse package.json */
  packageError?: Error
}

/**
 * resolves a module url, will attempt to locate a module based on possible locations
 */
export async function resolveModule (
  /** authored url */
  url: string | ModuleUrl
): Promise<{ attempts: ResolvedModule[], resolved: ResolvedModule | null }> {
  const authoredUrl = ModuleUrl.parse(url)
  const urls = authoredUrl.discoverModule()
  const attempts: ResolvedModule[] = []
  const isFinished = () => {
    if (attempts.length === 0) return null
    const last = attempts[attempts.length - 1]
    if (last.moduleContent !== undefined) return last
    return null
  }
  for (const url of urls) {
    const pureUrl = url.toString()
    const finished = isFinished()
    debug(pureUrl, { finished })
    if (finished !== null) break
    const content = await fetch(pureUrl)
    if (content === undefined) {
      debug('content is undefined')
      attempts.push({ moduleUrl: url, moduleContent: content })
      continue
    }
    if (url.basename === 'package.json') {
      debug('url is package')
      let packageContent
      try {
        packageContent = JSON.parse(content)
      } catch (e) {
        debug('error parsing package')
        attempts.push({
          packageUrl: url,
          packageError: new Error('error parsing package')
        })
        continue
      }
      if (typeof packageContent?.main !== 'string') {
        debug('package no main')
        attempts.push({
          packageUrl: url,
          packageError: new Error('package has invalid main property')
        })
        continue
      }
      for (const childUrl of url.discoverMain(packageContent.main)) {
        const pureChildUrl = childUrl.toString()
        debug(pureChildUrl)
        const content = await fetch(childUrl.toString())
        attempts.push({
          moduleUrl: childUrl,
          moduleContent: content,
          packageUrl: url,
          packageContent
        })
        if (content === undefined) {
          continue
        } else {
          break
        }
      }
    } else {
      debug('found content')
      attempts.push({
        moduleUrl: url,
        moduleContent: content
      })
    }
  }
  return { attempts, resolved: isFinished() }
}
