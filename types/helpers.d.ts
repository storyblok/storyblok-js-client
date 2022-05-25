declare module 'helpers' {
/**
* @method stringify
* @param  {Object} obj
* @param  {String} prefix
* @param  {Boolean} isArray
* @return {String} Stringified object
*/
const stringify = (obj: object, prefix?: string, isArray?: boolean): string => {
	const pairs = []
	for (const key in obj) {
		if (!Object.prototype.hasOwnProperty.call(obj, key)) {
			continue
		}
		const value = obj[key]
		const enkey = isArray ? '' : encodeURIComponent(key)
		let pair
		if (typeof value === 'object') {
			pair = stringify(
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
 