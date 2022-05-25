import { stringify } from 'helpers'

import fetch from 'isomorphic-fetch'

interface ISbFetch {
  baseURL: string,
  timeout?: number,
  headers?: HeadersInit,
  responseInterceptor?: Function,
}

interface IError {
  message: Error,
  response: IResponse,
}

interface IResponse {
  status: number,
  statusText: string,
}

enum Method {
  GET = 'get',
  DELETE = 'delete',
  POST = 'post',
  PUT = 'put'
}

class SbFetch {
  baseURL: string
  timeout: number
  headers: HeadersInit
  responseInterceptor?: Function
  ejectInterceptor: boolean
  url: string
  parameters: Object

  private constructor($c: ISbFetch) {
    this.baseURL = $c.baseURL,
    this.timeout = $c.timeout ? $c.timeout * 1000 : 1000,
    this.headers = $c.headers || [],
    this.responseInterceptor = $c.responseInterceptor
    this.ejectInterceptor = false
    this.url = ''
    this.parameters = {}
  }

  public get(url: string, param: Object) {
    this.url = url
    this.parameters = param
    return this._methodHandler(Method.GET)
  }

  public post(url: string, param: Object) {
    this.url = url
    this.parameters = param
    return this._methodHandler(Method.POST)
  }

  public put(url: string, param: Object) {
    this.url = url
    this.parameters = param
    return this._methodHandler(Method.PUT)
  }

  public delete(url: string, param: Object) {
    this.url = url
    this.parameters = param
    return this._methodHandler(Method.DELETE)
  }

  private async _responseHandler(res: Response) {
    const headers: string[] = []
    const response = {
      data: {},
      headers: {},
      status: 0,
      statusText: '',
    }

    await res.json().then(($r) => {
      response.data = $r
    })

    for (let pair of res.headers.entries()) {
      headers[pair[0] as any] = pair[1]
    }

    response.headers = { ...headers }
    response.status = res.status
    response.statusText = res.statusText

    return response
  }

  private async _methodHandler(method: Method) {
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
      const response = await fetch(`${url}`, {
        method,
        headers: this.headers,
        body,
        signal,
      })
  
      clearTimeout(timeout)
  
      const res = await this._responseHandler(response) as IResponse

      if(this.responseInterceptor && !this.ejectInterceptor) {
        return this._statusHandler(this.responseInterceptor(res))
      } else {
        return this._statusHandler(res)
      }
    } catch ($e) {
      return $e
    }
  }

  public eject() {
    this.ejectInterceptor = true
  }

  private _statusHandler(res: IResponse) {
    const statusOk = /20[01]/g

    if (statusOk.test(`${res.status}`)) {
      return res
    }
    
    const error: IError = {
      message: new Error(res.statusText || `status: ${res.status}`),
      response: res,
    }

    throw error
  }
}

export default SbFetch
