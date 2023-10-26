import { SbHelpers } from './sbHelpers'

import { ISbResponse, ISbError, ISbStoriesParams } from './interfaces'
import Method from './constants'

export type ResponseFn = {
	(arg?: ISbResponse | any): any
}

interface ISbFetch {
	baseURL: string
	timeout?: number
	headers: Headers
	responseInterceptor?: ResponseFn
	fetch?: typeof fetch
}

type FetchOptions = {
	[key: string]: any
}

class SbFetch {
	private baseURL: string
	private timeout?: number
	private headers: Headers
	private responseInterceptor?: ResponseFn
	private fetch: typeof fetch
	private ejectInterceptor?: boolean
	private url: string
	private parameters: ISbStoriesParams
	private fetchOptions?: FetchOptions

	public constructor(config: ISbFetch) {
		this.baseURL = config.baseURL
		this.headers = config.headers || new Headers()
		this.timeout = config?.timeout ? config.timeout * 1000 : 0
		this.responseInterceptor = config.responseInterceptor
		this.fetch = (...args) =>
			config.fetch ? config.fetch(...args) : fetch(...args)
		this.ejectInterceptor = false
		this.url = ''
		this.parameters = {} as ISbStoriesParams
		this.fetchOptions = {}
	}

	/**
	 *
	 * @param url string
	 * @param params ISbStoriesParams
	 * @returns Promise<ISbResponse | Error>
	 */
	public get(url: string, params: ISbStoriesParams, fetchOptions?: object) {
		if (fetchOptions && Object.keys(fetchOptions).length > 0) {
			this.fetchOptions = fetchOptions
		}

		this.url = url
		this.parameters = params
		return this._methodHandler('get')
	}

	public post(url: string, params: ISbStoriesParams, fetchOptions?: object) {
		if (fetchOptions && Object.keys(fetchOptions).length > 0) {
			this.fetchOptions = fetchOptions
		}

		this.url = url
		this.parameters = params
		return this._methodHandler('post')
	}

	public put(url: string, params: ISbStoriesParams, fetchOptions?: object) {
		if (fetchOptions && Object.keys(fetchOptions).length > 0) {
			this.fetchOptions = fetchOptions
		}

		this.url = url
		this.parameters = params
		return this._methodHandler('put')
	}

	public delete(url: string, params: ISbStoriesParams, fetchOptions?: object) {
		if (fetchOptions && Object.keys(fetchOptions).length > 0) {
			this.fetchOptions = fetchOptions
		}

		this.url = url
		this.parameters = params
		return this._methodHandler('delete')
	}

	private async _responseHandler(res: Response) {
		const headers: string[] = []
		const response = {
			data: {},
			headers: {},
			status: 0,
			statusText: '',
		}

		if (res.status !== 204) {
			await res.json().then(($r) => {
				response.data = $r
			})
		}

		for (const pair of res.headers.entries()) {
			headers[pair[0] as any] = pair[1]
		}

		response.headers = { ...headers }
		response.status = res.status
		response.statusText = res.statusText

		return response
	}

	private async _methodHandler(
		method: Method
	): Promise<ISbResponse | ISbError> {
		let urlString = `${this.baseURL}${this.url}`

		let body = null

		if (method === 'get') {
			const helper = new SbHelpers()
			urlString = `${this.baseURL}${this.url}?${helper.stringify(
				this.parameters
			)}`
		} else {
			body = JSON.stringify(this.parameters)
		}

		const url = new URL(urlString)

		const controller = new AbortController()
		const { signal } = controller

		let timeout

		if (this.timeout) {
			timeout = setTimeout(() => controller.abort(), this.timeout)
		}

		try {
			let response
			if (this.fetchOptions && Object.keys(this.fetchOptions).length > 0) {
				const { method } = this.fetchOptions
				const getRegex = /get/gi

				const fetchOptions = {
					...this.fetchOptions,
					headers: this.headers,
					body: getRegex.test(method) ? null : JSON.stringify(this.parameters),
					signal,
				}
				response = await this.fetch(`${url}`, fetchOptions)
			} else {
				const fetchOptions = {
					method,
					headers: this.headers,
					body,
					signal,
				}
				response = await this.fetch(`${url}`, fetchOptions)
			}

			if (this.timeout) {
				clearTimeout(timeout)
			}

			const res = (await this._responseHandler(response)) as ISbResponse

			if (this.responseInterceptor && !this.ejectInterceptor) {
				return this._statusHandler(this.responseInterceptor(res))
			} else {
				return this._statusHandler(res)
			}
		} catch (err: TypeError | RangeError | EvalError | any) {
			const error: ISbError = {
				message: err,
			}
			return error
		}
	}

	public eject() {
		this.ejectInterceptor = true
	}

	private _statusHandler(res: ISbResponse): Promise<ISbResponse | ISbError> {
		const statusOk = /20[0-6]/g

		if (statusOk.test(`${res.status}`)) {
			return Promise.resolve(res)
		}

		const error: ISbError = {
			message: res.statusText,
			status: res.status,
			response: Array.isArray(res.data)
				? res.data[0]
				: res.data.error || res.data.slug,
		}

		return Promise.reject(error)
	}
}

export default SbFetch
