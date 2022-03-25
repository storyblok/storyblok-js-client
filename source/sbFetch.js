import { stringify } from './helpers'

class SbFetch {
  constructor($c) {
    this.baseURL = $c.baseURL,
    this.timeout = $c.timeout ? $c.timeout * 1000 : 1000,
    this.headers = $c.headers,
    this.responseInterceptor = $c.responseInterceptor
    this.ejectInterceptor = false
    this.url = ''
    this.parameters = {}
  }

  get($u, $p) {
    this.url = $u
    this.parameters = $p
    return this._methodHandler('get')
  }

  post($u, $p) {
    this.url = $u
    this.parameters = $p
    return this._methodHandler('post')
  }

  put($u, $p) {
    this.url = $u
    this.parameters = $p
    return this._methodHandler('put')
  }

  delete($u, $p) {
    this.url = $u
    this.parameters = $p
    return this._methodHandler('delete')
  }

  async _responseHandler($r) {
    const response = {}
    const headers = {}

    await $r.json().then((res) => {
      response.data = res
    })

    for (let pair of $r.headers.entries()) {
      headers[pair[0]] = pair[1]
    }

    response.headers = { ...headers }
    response.status = $r.status
    response.statusText = $r.statusText

    return response
  }

  async _methodHandler(method) {
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
      let response = null

      const options = {
        method,
        headers: this.headers,
        body,
        signal,
      }

      if (typeof window === 'undefined') {
        const nodeFetch = await import('node-fetch')
        response = await nodeFetch(url, options)
      } else {
        response = await fetch(url, options)
      }
  
      clearTimeout(timeout)
  
      const res = await this._responseHandler(response)

      if(this.responseInterceptor && !this.ejectInterceptor) {
        return this._statusHandler(this.responseInterceptor(res))
      } else {
        return this._statusHandler(res)
      }
    } catch ($e) {
      return $e
    }
  }

  eject() {
    this.ejectInterceptor = true
  }

  _statusHandler($r) {
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
