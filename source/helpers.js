/**
 * @method isCDNUrl
 * @param  {String} url /cdn/, /stories/, /spaces/...
 * @return {Boolean}
 */
const isCDNUrl = (url = '') => url.indexOf('/cdn/') > -1

/**
 * @method getOptionsPage
 * @param  {Object} options
 * @param  {Number} perPage
 * @param  {Number} page
 * @return {Object}         merged options with perPag and page values
 */
const getOptionsPage = (options = {}, perPage = 25, page = 1) => {
  return {
    ...options,
    per_page: perPage,
    page
  }
}

/**
 * @method delay
 * @param  {Number} ms
 * @return {Promise}
 */
const delay = ms => new Promise(res => setTimeout(res, ms))

/**
 * @template R
 * @method   arrayFrom<R>
 * @param    {Number} length
 * @param    {function(undefined, int, Array<undefined>):R} func
 * @return   {Array<R>}
 */
const arrayFrom = (length = 0, func) => [...Array(length)].map(func)

/**
 * @method range
 * @param  {Number} start
 * @param  {Number} end
 * @return {Array<Number>}
 */
const range = (start = 0, end = start) => {
  const length = Math.abs(end - start) || 0
  const step = start < end ? 1 : -1
  return arrayFrom(length, (_, i) => i * step + start)
}

/**
 * @template T, R
 * @method   asyncMap<T, R>
 * @param    {Array<T>} arr
 * @param    {function(T, Number, Array<T>):Promise<R>} func
 * @return   {Promise<Array<R>>}
 */
const asyncMap = async (arr = [], func) => Promise.all(arr.map(func))

/**
 * @template T, R
 * @method   flatMap<T, R>
 * @param    {Array<T>} arr
 * @param    {function(T, Number, Array<T>):R} func
 * @return   {Array<R>}
 */
const flatMap = (arr = [], func) => arr.map(func).reduce((xs, ys) => [...xs, ...ys], [])

/**
 * @method stringify
 * @param  {Object} obj
 * @param  {String} prefix
 * @param  {Boolean} isArray
 * @return {String} Stringified object
 */
const stringify = (obj, prefix, isArray) => {
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

export {
  delay,
  isCDNUrl,
  getOptionsPage,
  arrayFrom,
  range,
  asyncMap,
  flatMap,
  stringify
}
