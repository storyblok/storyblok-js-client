import fetch from 'unfetch'
import { stringify } from './helpers'

class SbFetch {
  constructor($c) {
    this.baseURL = $c.baseURL,
    this.timeout = ($c.timeout || 0),
    this.headers = $c.headers,
    this.proxy = ($c.proxy || false)
  }

  async get($u, $p) {
    const url = new URL(`${this.baseURL}${$u}`)
    url.search = stringify($p)

    const response = await fetch(url, {
      method: 'get',
      headers: this.headers,
    })

    return this.assertResponse(response)
  }

  async post($u, $p) {
    const url = new URL(`${this.baseURL}${$u}`)
    const body = JSON.stringify($p)

    const response = await fetch(url, {
      method: 'post',
      headers: this.headers,
      body,
    })

    return response
  }

  async put($u, $p) {
    const url = new URL(`${this.baseURL}${$u}`)
    const body = JSON.stringify($p)

    const response = await fetch(url, {
      method: 'put',
      headers: this.headers,
      body,
    })

    return response
  }

  async delete($u, $p) {
    const url = new URL(`${this.baseURL}${$u}`)
    const body = JSON.stringify($p)

    const response = await fetch(url, {
      method: 'delete',
      headers: this.headers,
      body,
    })

    return response
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
}

export default SbFetch