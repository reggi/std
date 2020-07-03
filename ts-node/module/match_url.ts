
/** url regex pattern */
export const urlPattern = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/

/** checks if a given string matches a url */
export function matchUrl (string?: string): boolean {
  if (string === undefined) return false
  return Boolean(string.match(urlPattern))
}
