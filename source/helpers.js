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

module.exports = {
  delay,
  isCDNUrl,
  getOptionsPage
}