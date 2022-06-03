import fetch from 'isomorphic-fetch'
import { SbHelpers } from './sbHelpers'

import { IResponse, IError, IStoriesParams } from './interfaces'
import { Method } from './enum'

type ResponseFn = {
  (arg?: IResponse | any): any
}

interface ISbFetch {
  baseURL: string,
  timeout?: number,
  headers: Headers,
  responseInterceptor?: ResponseFn,
}

class SbFetch {
	private baseURL: string
	private timeout?: number
	private headers: Headers
	private responseInterceptor?: ResponseFn
	private ejectInterceptor?: boolean
	private url: string
	private parameters: IStoriesParams

	public constructor($c: ISbFetch) {
		this.baseURL = $c.baseURL,
		this.timeout = $c.timeout ? $c.timeout * 1000 : 1000,
		this.headers = $c.headers || [],
		this.responseInterceptor = $c.responseInterceptor
		this.ejectInterceptor = false
		this.url = ''
		this.parameters = {} as IStoriesParams
	}

	/**
	 * 
	 * @param url string
	 * @param params IStoriesParams 
	 * @returns Promise<IResponse | Error>
	 */
	public get(url: string, params: IStoriesParams) {
		this.url = url
		this.parameters = params
		return this._methodHandler(Method.GET)
	}

	public post(url: string, params: IStoriesParams) {
		this.url = url
		this.parameters = params
		return this._methodHandler(Method.POST)
	}

	public put(url: string, params: IStoriesParams) {
		this.url = url
		this.parameters = params
		return this._methodHandler(Method.PUT)
	}

	public delete(url: string, params: IStoriesParams) {
		this.url = url
		this.parameters = params
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

		for (const pair of res.headers.entries()) {
			headers[pair[0] as any] = pair[1]
		}

		response.headers = { ...headers }
		response.status = res.status
		response.statusText = res.statusText

		return response
	}

	private async _methodHandler(method: Method): Promise<IResponse | Error> {
		const url = new URL(`${this.baseURL}${this.url}`)
		let body = null

		if(method === 'get') {
			const helper = new SbHelpers()
			url.search = helper.stringify(this.parameters)
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
		} catch ($e: TypeError | RangeError | EvalError | any) {
			const error: Error = $e
			return error
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
