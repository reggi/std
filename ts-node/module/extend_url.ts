/** extendable version or URL */
export class ExtendUrl { 
  parsed: URL
  
  constructor(url: string, base?: string | URL | ExtendUrl) { 
    this.parsed = new URL(url, base)
  }

  get hash() { 
    return this.parsed.hash
  }

  set hash(value) { 
    this.parsed.hash = value
  }

  get host() { 
    return this.parsed.host
  }

  set host(value) { 
    this.parsed.host = value
  }

  get hostname() { 
    return this.parsed.hostname
  }

  set hostname(value) { 
    this.parsed.hostname = value
  }

  get href() { 
    return this.parsed.href
  }

  set href(value) { 
    this.parsed.href = value
  }

  get origin() { 
    return this.parsed.origin
  }

  get password() { 
    return this.parsed.password
  }

  set password(value) { 
    this.parsed.password = value
  }

  get pathname() { 
    return this.parsed.pathname
  }
  
  set pathname(value) {
    this.parsed.pathname = value
  }

  get port() { 
    return this.parsed.port
  }

  set port(value) { 
    this.parsed.port = value
  }

  get protocol() { 
    return this.parsed.protocol
  }

  set protocol(value) { 
    this.parsed.protocol = value
  }

  get search() { 
    return this.parsed.search
  }

  set search(value) { 
    this.parsed.search = value
  }

  get searchParams() { 
    return this.parsed.searchParams
  }

  get username() { 
    return this.parsed.username
  }

  set username(value) { 
    this.parsed.username = value
  }

  toString() { 
    return this.parsed.toString()
  }

  toJSON() { 
    return this.parsed.toJSON()
  }

}