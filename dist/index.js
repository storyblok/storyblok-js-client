'use strict';

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _parseInt2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/parse-int"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _assign = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/assign"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var qs = require('qs');

var axios = require('axios');

var throttledQueue = require('./throttlePromise');

var delay = function delay(ms) {
  return new _promise.default(function (res) {
    return (0, _setTimeout2.default)(res, ms);
  });
};

var RichTextResolver = require('./richTextResolver');

var memory = {};

var Storyblok =
/*#__PURE__*/
function () {
  function Storyblok(config, endpoint) {
    (0, _classCallCheck2.default)(this, Storyblok);

    if (!endpoint) {
      var _context;

      var region = config.region ? "-".concat(config.region) : '';
      var protocol = config.https === false ? 'http' : 'https';
      endpoint = (0, _concat.default)(_context = "".concat(protocol, "://api")).call(_context, region, ".storyblok.com/v1");
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

    this.richTextResolver = new RichTextResolver();

    if (typeof config.componentResolver === 'function') {
      this.setComponentResolver(config.componentResolver);
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
    key: "setComponentResolver",
    value: function setComponentResolver(resolver) {
      this.richTextResolver.addNode('blok', function (node) {
        var _context2;

        var html = '';
        (0, _forEach.default)(_context2 = node.attrs.body).call(_context2, function (blok) {
          html += resolver(blok.component, blok);
        });
        return {
          html: html
        };
      });
    }
  }, {
    key: "get",
    value: function get(slug, params) {
      var query = params || {};
      var url = "/".concat(slug);

      if ((0, _indexOf.default)(url).call(url, '/cdn/') > -1) {
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
          return _regenerator.default.wrap(function _callee$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  cacheKey = qs.stringify({
                    url: url,
                    params: params
                  }, {
                    arrayFormat: 'brackets'
                  });
                  provider = _this.cacheProvider();

                  if (!(_this.cache.clear === 'auto' && params.version === 'draft')) {
                    _context3.next = 5;
                    break;
                  }

                  _context3.next = 5;
                  return _this.flushCache();

                case 5:
                  if (!(params.version === 'published')) {
                    _context3.next = 11;
                    break;
                  }

                  _context3.next = 8;
                  return provider.get(cacheKey);

                case 8:
                  cache = _context3.sent;

                  if (!cache) {
                    _context3.next = 11;
                    break;
                  }

                  return _context3.abrupt("return", resolve(cache));

                case 11:
                  _context3.prev = 11;
                  _context3.next = 14;
                  return _this.throttle('get', url, {
                    params: params,
                    paramsSerializer: function paramsSerializer(params) {
                      return qs.stringify(params, {
                        arrayFormat: 'brackets'
                      });
                    }
                  });

                case 14:
                  res = _context3.sent;
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
                    _context3.next = 19;
                    break;
                  }

                  return _context3.abrupt("return", reject(res));

                case 19:
                  if (params.version === 'published') {
                    provider.set(cacheKey, response);
                  }

                  resolve(response);
                  _context3.next = 33;
                  break;

                case 23:
                  _context3.prev = 23;
                  _context3.t0 = _context3["catch"](11);

                  if (!(_context3.t0.response && _context3.t0.response.status === 429)) {
                    _context3.next = 32;
                    break;
                  }

                  retries = retries + 1;

                  if (!(retries < _this.maxRetries)) {
                    _context3.next = 32;
                    break;
                  }

                  console.log("Hit rate limit. Retrying in ".concat(retries, " seconds."));
                  _context3.next = 31;
                  return delay(1000 * retries);

                case 31:
                  return _context3.abrupt("return", _this.cacheResponse(url, params, retries).then(resolve).catch(reject));

                case 32:
                  reject(_context3.t0);

                case 33:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee, null, [[11, 23]]);
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
    value: function () {
      var _flushCache = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee2() {
        return _regenerator.default.wrap(function _callee2$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                this.cacheVersion = this.newVersion();
                _context4.next = 3;
                return this.cacheProvider().flush();

              case 3:
                return _context4.abrupt("return", this);

              case 4:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee2, this);
      }));

      function flushCache() {
        return _flushCache.apply(this, arguments);
      }

      return flushCache;
    }()
  }]);
  return Storyblok;
}();

module.exports = Storyblok;