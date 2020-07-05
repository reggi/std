import { ModuleUrl } from './module_url'
import { fetch } from './fetch'

const debug = (...msg) => {
  // msg.forEach(m => console.log(m))
}

interface ResolvedPackage {
  packageUrl?: ModuleUrl
  /** parsed package.json content */
  packageContent?: any
  /** if caught error during JSON.parse package.json */
  packageError?: Error
}

export async function resolvePackages (url: string | ModuleUrl, cache?: any) {
  const authoredUrl = ModuleUrl.parse(url)
  const urls = authoredUrl.pkgPotential
  const findings: ResolvedPackage[] = []
  for (const url of urls) {
    const content = await fetch(url.toString(), cache)
    if (content === undefined) continue
    debug('url is package')
    try {
      const packageContent = JSON.parse(content)
      findings.push({
        packageUrl: url,
        packageContent
      })
      continue
    } catch (e) {
      debug('error parsing package')
      findings.push({
        packageUrl: url,
        packageError: new Error('error parsing package')
      })
      continue
    }
  }
  return findings
}
