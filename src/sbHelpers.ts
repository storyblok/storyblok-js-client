import { ISbStoriesParams, ISbResult, AsyncFn } from './interfaces'
interface ISbParams extends ISbStoriesParams {
	[key: string]: any
}

type ArrayFn = (...args: any) => void

type FlatMapFn = (...args: any) => [] | any

type RangeFn = (...args: any) => []

export class SbHelpers {
	public isCDNUrl = (url = '') => url.indexOf('/cdn/') > -1

	public getOptionsPage = (
		options: ISbStoriesParams,
		perPage = 25,
		page = 1
	) => {
		return {
			...options,
			per_page: perPage,
			page,
		}
	}

	public delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

	public arrayFrom = (length = 0, func: ArrayFn) => [...Array(length)].map(func)

	public range = (start = 0, end = start): Array<any> => {
		const length = Math.abs(end - start) || 0
		const step = start < end ? 1 : -1
		return this.arrayFrom(length, (_, i: number) => i * step + start)
	}

	public asyncMap = async (arr: RangeFn[], func: AsyncFn) =>
		Promise.all(arr.map(func))

	public flatMap = (arr: ISbResult[] = [], func: FlatMapFn) =>
		arr.map(func).reduce((xs, ys) => [...xs, ...ys], [])

	/**
	 * @method stringify
	 * @param  {Object} params
	 * @param  {String} prefix
	 * @param  {Boolean} isArray
	 * @return {String} Stringified object
	 */
	public stringify(
		params: ISbParams,
		prefix?: string,
		isArray?: boolean
	): string {
		const pairs = []
		for (const key in params) {
			if (!Object.prototype.hasOwnProperty.call(params, key)) {
				continue
			}
			const value = params[key]
			const enkey = isArray ? '' : encodeURIComponent(key)
			let pair
			if (typeof value === 'object') {
				pair = this.stringify(
					value,
					prefix ? prefix + encodeURIComponent('[' + enkey + ']') : enkey,
					Array.isArray(value)
				)
			} else {
				pair =
					(prefix ? prefix + encodeURIComponent('[' + enkey + ']') : enkey) +
					'=' +
					encodeURIComponent(value)
			}
			pairs.push(pair)
		}
		return pairs.join('&')
	}

	/**
	 * @method getRegionURL
	 * @param  {String} regionCode region code, could be eu, us or cn
	 * @return {String} The base URL of the region
	 */
	public getRegionURL(regionCode?: string): string {
		const EU_API_URL = 'api.storyblok.com'
		const US_API_URL = 'api-us.storyblok.com'
		const CN_API_URL = 'app.storyblokchina.cn'

		switch (regionCode) {
			case 'us':
				return US_API_URL
			case 'cn':
				return CN_API_URL
			default:
				return EU_API_URL
		}
	}
}
