"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/objectSpread"));

var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));

/**
 * @method isCDNUrl
 * @param  {String} url /cdn/, /stories/, /spaces/...
 * @return {Boolean}
 */
var isCDNUrl = function isCDNUrl() {
  var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return (0, _indexOf.default)(url).call(url, '/cdn/') > -1;
};
/**
 * @method getOptionsPage
 * @param  {Object} options
 * @param  {Number} perPage
 * @param  {Number} page
 * @return {Object}         merged options with perPag and page values
 */


var getOptionsPage = function getOptionsPage() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var perPage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 25;
  var page = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  return (0, _objectSpread2.default)({}, options, {
    per_page: perPage,
    page: page
  });
};
/**
 * @method delay
 * @param  {Number} ms
 * @return {Promise}
 */


var delay = function delay(ms) {
  return new _promise.default(function (res) {
    return (0, _setTimeout2.default)(res, ms);
  });
};

module.exports = {
  delay: delay,
  isCDNUrl: isCDNUrl,
  getOptionsPage: getOptionsPage
};