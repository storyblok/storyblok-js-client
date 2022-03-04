import fetch from 'unfetch'
import { stringify } from './helpers'

class SbFetch {
  constructor($c) {
    this.baseURL = $c.baseURL,
    this.timeout = $c.timeout ? $c.timeout * 1000 : 0,
    this.headers = $c.headers,
    this.proxy = $c.proxy || false,
    this.responseInterceptor = $c.responseInterceptor
    this.ejectInterceptor = false
    this.url = ''
    this.parameters = {}
  }

  get($u, $p) {
    this.url = $u
    this.parameters = $p
    return this.methodHandler('get')
  }

  post($u, $p) {
    this.url = $u
    this.parameters = $p
    return this.methodHandler('post')
  }

  put($u, $p) {
    this.url = $u
    this.parameters = $p
    return this.methodHandler('put')
  }

  delete($u, $p) {
    this.url = $u
    this.parameters = $p
    return this.methodHandler('delete')
  }

  responseHandler($r) {
    const response = {}

    $r.json().then((res) => response.data = res)

    const headers = {}

    for (let i = 0; i < $r.headers.entries().length; i++) {
      headers[$r.headers.entries()[i][0]] = $r.headers.entries()[i][1]
    }

    response.headers = { ...headers }
    response.status = $r.status
    response.statusText = $r.statusText

    return response
  }

  async methodHandler(method) {
    const url = new URL(`${this.baseURL}${this.url}`)
    let body = null

    if(method === 'get') {
      url.search = stringify(this.parameters)
    } else {
      body = JSON.stringify(this.parameters)
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
  
      if(this.responseInterceptor && !this.ejectInterceptor) {
        if (method === 'get') {
          return this.statusHandler(this.responseInterceptor(this.responseHandler(response)))
        }
        return this.statusHandler(this.responseInterceptor(response))
      } else {
        if (method === 'get') {
          return this.statusHandler(this.responseHandler(response))
        }
        return this.statusHandler(response)
      }
    } catch ($e) {
      return $e
    }
  }

  eject() {
    this.ejectInterceptor = true
  }

  statusHandler($r) {
    const statusOk = /20[01]/g

    if (statusOk.test($r.status)) {
      return $r
    }
    
    const error = new Error($r.statusText || `status: ${$r.status}`)
    error.response = $r
    return Promise.reject(error)
  }
}

export default SbFetch