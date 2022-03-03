import fetch from 'unfetch'
import { stringify } from './helpers'

class SbFetch {
  constructor($c) {
    this.baseURL = $c.baseURL,
    this.timeout = $c.timeout ? $c.timeout * 1000 : 0,
    this.headers = $c.headers,
    this.proxy = $c.proxy || false,
    this.responseInterceptor = $c.responseInterceptor
  }

  get($u, $p) {
    return this.resolveByMethod($u, $p, 'get')
  }

  post($u, $p) {
    return this.resolveByMethod($u, $p, 'post')
  }

  put($u, $p) {
    return this.resolveByMethod($u, $p, 'put')
  }

  delete($u, $p) {
    return this.resolveByMethod($u, $p, 'delete')
  }

  assertResponse($r) {
    const response = {}

    Promise.resolve($r.json()).then((res) => response.data = res)

    const headers = {}

    for (let i = 0; i < $r.headers.entries().length; i++) {
      headers[$r.headers.entries()[i][0]] = $r.headers.entries()[i][1]
    }

    response.headers = { ...headers }
    response.status = $r.status
    response.statusText = $r.statusText

    return response
  }

  async resolveByMethod($u, $p, method) {
    const url = new URL(`${this.baseURL}${$u}`)
    let body = null

    if(method === 'get') {
      url.search = stringify($p)
    } else {
      body = JSON.stringify($p)
    }

    const controller = new AbortController()
    const { signal } = controller

    const timeout = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(url, {
        method,
        headers: this.headers,
        body,
        signal,
      })
  
      clearTimeout(timeout)
  
      if(this.responseInterceptor) {
        if (method === 'get') {
          return this.responseInterceptor(this.assertResponse(response))
        }
        return this.responseInterceptor(response)
      } else {
        if (method === 'get') {
          return this.assertResponse(response)
        }
        return response
      }
    } catch ($e) {
      return $e
    }
  }
}

export default SbFetch