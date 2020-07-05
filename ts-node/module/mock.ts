
import * as fs from 'fs'
import * as path from 'path'
import * as nock from 'nock'

export function createMock () {
  nock(/https?:\/\/raw\.githubusercontent\.com/)
    .persist()
    .get(/.+/)
    .reply((uri) => {
      const ignore = /^\/reggi\/std\/master\//
      if (uri.match(ignore) === null) return [404, '404: Not Found']
      const core = uri.replace(ignore, '')
      const file = path.join(__dirname, '../../', core)
      try {
        const content = fs.readFileSync(file, 'utf8')
        return [200, content]
      } catch (e) {
        return [404, '404: Not Found']
      }
    })
}
