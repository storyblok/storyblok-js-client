interface IParams extends Object {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any
}

export class SbHelpers {

	/**
		* @method stringify
		* @param  {Object} params
		* @param  {String} prefix
		* @param  {Boolean} isArray
		* @return {String} Stringified object
		*/
	public stringify(params: IParams, prefix?: string, isArray?: boolean): string {
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
}
