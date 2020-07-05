import * as http from 'http'
import * as https from 'https'

/**
 * Downloads file from remote HTTP[S] host and returns the contents
 */
export async function fetch (url: string, cache?: any): Promise<string | undefined> {
  if (typeof cache !== 'undefined' && typeof cache[url] !== 'undefined') return JSON.stringify(cache[url])
  return await new Promise((resolve, reject) => {
    const p = new URL(url)
    const proto = p.protocol === 'https:' ? https : http
    proto.get(url, res => {
      if (res.statusCode !== 200) {
        resolve(undefined)
      }
      res.setEncoding('utf8')
      let body = ''
      res.on('data', (chunk: string) => {
        body += chunk
      })
      res.on('end', () => resolve(body))
    }).on('error', reject)
  })
}
