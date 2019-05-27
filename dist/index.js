'use strict';

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs2/regenerator"));

var _parseInt2 = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/parse-int"));

require("regenerator-runtime/runtime");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/asyncToGenerator"));

var _assign = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/assign"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/promise"));

var qs = require('qs');

var axios = require('axios');

var throttledQueue = require('./throttlePromise');

var delay = function delay(ms) {
  return new _promise.default(function (res) {
    return setTimeout(res, ms);
  });
};

var memory = {};

var Storyblok =
/*#__PURE__*/
function () {
  function Storyblok(config, endpoint) {
    (0, _classCallCheck2.default)(this, Storyblok);

    if (!endpoint) {
      var region = config.region ? "-".concat(config.region) : '';
      var protocol = config.https === false ? 'http' : 'https';
      endpoint = "".concat(protocol, "://api").concat(region, ".storyblok.com/v1");
    }

    var headers = (0, _assign.default)({}, config.headers);
    var rateLimit = 5; // per second for cdn api

    if (typeof config.oauthToken != 'undefined') {
      headers['Authorization'] = config.oauthToken;
      rateLimit = 3; // per second for management api
    }

    if (typeof config.rateLimit != 'undefined') {
      rateLimit = config.rateLimit;
    }

    this.maxRetries = config.maxRetries || 5;
    this.throttle = throttledQueue(this.throttledRequest, rateLimit, 1000);
    this.cacheVersion = this.cacheVersion || this.newVersion();
    this.accessToken = config.accessToken;
    this.cache = config.cache || {
      clear: 'manual'
    };
    this.client = axios.create({
      baseURL: endpoint,
      timeout: config.timeout || 0,
      headers: headers,
      proxy: config.proxy || false
    });
  }

  (0, _createClass2.default)(Storyblok, [{
    key: "get",
    value: function get(slug, params) {
      var query = params || {};
      var url = "/".concat(slug);

      if (url.indexOf('/cdn/') > -1) {
        if (!query.version) {
          query.version = 'published';
        }

        if (!query.cv) {
          query.cv = this.cacheVersion;
        }

        if (!query.token) {
          query.token = this.getToken();
        }
      }

      return this.cacheResponse(url, query);
    }
  }, {
    key: "post",
    value: function post(slug, params) {
      var url = "/".concat(slug);
      return this.throttle('post', url, params);
    }
  }, {
    key: "put",
    value: function put(slug, params) {
      var url = "/".concat(slug);
      return this.throttle('put', url, params);
    }
  }, {
    key: "delete",
    value: function _delete(slug, params) {
      var url = "/".concat(slug);
      return this.throttle('delete', url, params);
    }
  }, {
    key: "getStories",
    value: function getStories(params) {
      return this.get('cdn/stories', params);
    }
  }, {
    key: "getStory",
    value: function getStory(slug, params) {
      return this.get("cdn/stories/".concat(slug), params);
    }
  }, {
    key: "setToken",
    value: function setToken(token) {
      this.accessToken = token;
    }
  }, {
    key: "getToken",
    value: function getToken() {
      return this.accessToken;
    }
  }, {
    key: "cacheResponse",
    value: function cacheResponse(url, params, retries) {
      var _this = this;

      if (typeof retries === 'undefined') {
        retries = 0;
      }

      return new _promise.default(
      /*#__PURE__*/
      function () {
        var _ref = (0, _asyncToGenerator2.default)(
        /*#__PURE__*/
        _regenerator.default.mark(function _callee(resolve, reject) {
          var cacheKey, provider, cache, res, response;
          return _regenerator.default.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  cacheKey = qs.stringify({
                    url: url,
                    params: params
                  }, {
                    arrayFormat: 'brackets'
                  });
                  provider = _this.cacheProvider();
                  cache = provider.get(cacheKey);

                  if (_this.cache.clear === 'auto' && params.version === 'draft') {
                    _this.flushCache();
                  }

                  if (!(params.version === 'published' && cache)) {
                    _context.next = 8;
                    break;
                  }

                  resolve(cache);
                  _context.next = 30;
                  break;

                case 8:
                  _context.prev = 8;
                  _context.next = 11;
                  return _this.throttle('get', url, {
                    params: params,
                    paramsSerializer: function paramsSerializer(params) {
                      return qs.stringify(params, {
                        arrayFormat: 'brackets'
                      });
                    }
                  });

                case 11:
                  res = _context.sent;
                  response = {
                    data: res.data,
                    headers: res.headers
                  };

                  if (res.headers['per-page']) {
                    response = (0, _assign.default)({}, response, {
                      perPage: (0, _parseInt2.default)(res.headers['per-page']),
                      total: (0, _parseInt2.default)(res.headers['total'])
                    });
                  }

                  if (!(res.status != 200)) {
                    _context.next = 16;
                    break;
                  }

                  return _context.abrupt("return", reject(res));

                case 16:
                  if (params.version === 'published') {
                    provider.set(cacheKey, response);
                  }

                  resolve(response);
                  _context.next = 30;
                  break;

                case 20:
                  _context.prev = 20;
                  _context.t0 = _context["catch"](8);

                  if (!(_context.t0.response && _context.t0.response.status === 429)) {
                    _context.next = 29;
                    break;
                  }

                  retries = retries + 1;

                  if (!(retries < _this.maxRetries)) {
                    _context.next = 29;
                    break;
                  }

                  console.log("Hit rate limit. Retrying in ".concat(retries, " seconds."));
                  _context.next = 28;
                  return delay(1000 * retries);

                case 28:
                  return _context.abrupt("return", _this.cacheResponse(url, params, retries).then(resolve).catch(reject));

                case 29:
                  reject(_context.t0);

                case 30:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, null, [[8, 20]]);
        }));

        return function (_x, _x2) {
          return _ref.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "throttledRequest",
    value: function throttledRequest(type, url, params) {
      return this.client[type](url, params);
    }
  }, {
    key: "newVersion",
    value: function newVersion() {
      return new Date().getTime();
    }
  }, {
    key: "cacheProvider",
    value: function cacheProvider() {
      var cacheConfig = this.cache;

      switch (this.cache.type) {
        case 'memory':
          return {
            get: function get(key) {
              return memory[key];
            },
            set: function set(key, content) {
              memory[key] = content;
            },
            flush: function flush() {
              memory = {};
            }
          };
          break;

        default:
          this.cacheVersion = this.newVersion();
          return {
            get: function get() {},
            set: function set() {},
            flush: function flush() {}
          };
      }
    }
  }, {
    key: "flushCache",
    value: function flushCache() {
      this.cacheVersion = this.newVersion();
      this.cacheProvider().flush();
      return this;
    }
  }]);
  return Storyblok;
}();

module.exports = Storyblok;