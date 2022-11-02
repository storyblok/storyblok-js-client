import { ISbResponse, ISbStoriesParams } from './interfaces'
declare type ResponseFn = {
	(arg?: ISbResponse | any): any
}
interface ISbFetch {
	baseURL: string
	timeout?: number
	headers: Headers
	responseInterceptor?: ResponseFn
}
declare class SbFetch {
	private baseURL
	private timeout?
	private headers
	private responseInterceptor?
	private ejectInterceptor?
	private url
	private parameters
	constructor($c: ISbFetch)
	/**
	 *
	 * @param url string
	 * @param params ISbStoriesParams
	 * @returns Promise<ISbResponse | Error>
	 */
	get(url: string, params: ISbStoriesParams): Promise<ISbResponse | Error>
	post(url: string, params: ISbStoriesParams): Promise<ISbResponse | Error>
	put(url: string, params: ISbStoriesParams): Promise<ISbResponse | Error>
	delete(url: string, params: ISbStoriesParams): Promise<ISbResponse | Error>
	private _responseHandler
	private _methodHandler
	eject(): void
	private _statusHandler
}
export default SbFetch
