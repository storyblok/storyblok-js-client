'use strict';

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _parseInt2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/parse-int"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));

var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));

var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/values"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _assign = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/assign"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var qs = require('qs');

var axios = require('axios');

var throttledQueue = require('./throttlePromise');

var RichTextResolver = require('./richTextResolver');

var memory = {};
var _cacheVersions = {};

var _require = require('./helpers'),
    delay = _require.delay,
    getOptionsPage = _require.getOptionsPage,
    isCDNUrl = _require.isCDNUrl;

var Storyblok =
/*#__PURE__*/
function () {
  function Storyblok(config, endpoint) {
    (0, _classCallCheck2.default)(this, Storyblok);

    if (!endpoint) {
      var _context;

      var region = config.region ? "-".concat(config.region) : '';
      var protocol = config.https === false ? 'http' : 'https';
      endpoint = (0, _concat.default)(_context = "".concat(protocol, "://api")).call(_context, region, ".storyblok.com/v2");
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
    this.accessToken = config.accessToken;
    this.relations = {};
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
    key: "parseParams",
    value: function parseParams() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (!params.version) {
        params.version = 'published';
      }

      if (!params.token) {
        params.token = this.getToken();
      }

      if (!params.cv) {
        params.cv = _cacheVersions[params.token];
      }

      return params;
    }
  }, {
    key: "factoryParamOptions",
    value: function factoryParamOptions(url) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (isCDNUrl(url)) {
        return this.parseParams(params);
      }

      return params;
    }
  }, {
    key: "makeRequest",
    value: function makeRequest(url, params, per_page, page) {
      var options = this.factoryParamOptions(url, getOptionsPage(params, per_page, page));
      return this.cacheResponse(url, options);
    }
  }, {
    key: "get",
    value: function get(slug, params) {
      var url = "/".concat(slug);
      var query = this.factoryParamOptions(url, params);
      return this.cacheResponse(url, query);
    }
  }, {
    key: "getAll",
    value: function () {
      var _getAll = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee(slug) {
        var params,
            entity,
            perPage,
            page,
            url,
            urlParts,
            res,
            all,
            total,
            lastPage,
            _context3,
            _args = arguments;

        return _regenerator.default.wrap(function _callee$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                params = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
                entity = _args.length > 2 ? _args[2] : undefined;
                perPage = params.per_page || 25;
                page = 1;
                url = "/".concat(slug);
                urlParts = url.split('/');
                entity = entity || urlParts[urlParts.length - 1];
                _context4.next = 9;
                return this.makeRequest(url, params, perPage, page);

              case 9:
                res = _context4.sent;
                all = (0, _values.default)(res.data[entity]);
                total = res.total;
                lastPage = Math.ceil(total / perPage);

              case 13:
                if (!(page < lastPage)) {
                  _context4.next = 21;
                  break;
                }

                page++;
                _context4.next = 17;
                return this.makeRequest(url, params, perPage, page);

              case 17:
                res = _context4.sent;
                all = (0, _concat.default)(_context3 = []).call(_context3, (0, _toConsumableArray2.default)(all), (0, _toConsumableArray2.default)((0, _values.default)(res.data[entity])));
                _context4.next = 13;
                break;

              case 21:
                return _context4.abrupt("return", all);

              case 22:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee, this);
      }));

      function getAll(_x) {
        return _getAll.apply(this, arguments);
      }

      return getAll;
    }()
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
    key: "insertRelations",
    value: function insertRelations(story, fields) {
      var _this = this;

      var enrich = function enrich(jtree) {
        if (jtree == null) {
          return;
        }

        if (jtree.constructor === Array) {
          for (var item = 0; item < jtree.length; item++) {
            enrich(jtree[item]);
          }
        } else if (jtree.constructor === Object && jtree.component && jtree._uid) {
          for (var treeItem in jtree) {
            if ((0, _indexOf.default)(fields).call(fields, jtree.component + '.' + treeItem) > -1) {
              if (typeof jtree[treeItem] === 'string') {
                if (_this.relations[jtree[treeItem]]) {
                  jtree[treeItem] = _this.relations[jtree[treeItem]];
                }
              } else if (jtree[treeItem].constructor === Array) {
                var _context5;

                var stories = [];
                (0, _forEach.default)(_context5 = jtree[treeItem]).call(_context5, function (uuid) {
                  if (this.relations[uuid]) {
                    stories.push(this.relations[uuid]);
                  }
                });
                jtree[treeItem] = stories;
              }
            }

            enrich(jtree[treeItem]);
          }
        }
      };

      enrich(story.content);
    }
  }, {
    key: "resolveRelations",
    value: function () {
      var _resolveRelations = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee2(responseData, params) {
        var _this2 = this;

        var relations, relSize, chunks, chunkSize, i, _context6, end, chunkIndex, _context7, relationsRes, _context8;

        return _regenerator.default.wrap(function _callee2$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                relations = [];

                if (!responseData.rel_uuids) {
                  _context9.next = 17;
                  break;
                }

                relSize = responseData.rel_uuids.length;
                chunks = [];
                chunkSize = 50;

                for (i = 0; i < relSize; i += chunkSize) {
                  end = Math.min(relSize, i + chunkSize);
                  chunks.push((0, _slice.default)(_context6 = responseData.rel_uuids).call(_context6, i, end));
                }

                chunkIndex = 0;

              case 7:
                if (!(chunkIndex < chunks.length)) {
                  _context9.next = 15;
                  break;
                }

                _context9.next = 10;
                return this.getStories({
                  per_page: chunkSize,
                  version: params.version,
                  by_uuids: chunks[chunkIndex]
                });

              case 10:
                relationsRes = _context9.sent;
                (0, _forEach.default)(_context7 = relationsRes.data.stories).call(_context7, function (rel) {
                  relations.push(rel);
                });

              case 12:
                chunkIndex++;
                _context9.next = 7;
                break;

              case 15:
                _context9.next = 18;
                break;

              case 17:
                relations = responseData.rels;

              case 18:
                (0, _forEach.default)(relations).call(relations, function (story) {
                  _this2.relations[story.uuid] = story;
                });

                if (responseData.story) {
                  this.insertRelations(responseData.story, params.resolve_relations.split(','));
                } else {
                  (0, _forEach.default)(_context8 = responseData.stories).call(_context8, function (story) {
                    _this2.insertRelations(story, params.resolve_relations.split(','));
                  });
                }

              case 20:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee2, this);
      }));

      function resolveRelations(_x2, _x3) {
        return _resolveRelations.apply(this, arguments);
      }

      return resolveRelations;
    }()
  }, {
    key: "cacheResponse",
    value: function cacheResponse(url, params, retries) {
      var _this3 = this;

      if (typeof retries === 'undefined') {
        retries = 0;
      }

      return new _promise.default(
      /*#__PURE__*/
      function () {
        var _ref = (0, _asyncToGenerator2.default)(
        /*#__PURE__*/
        _regenerator.default.mark(function _callee3(resolve, reject) {
          var cacheKey, provider, cache, res, response;
          return _regenerator.default.wrap(function _callee3$(_context10) {
            while (1) {
              switch (_context10.prev = _context10.next) {
                case 0:
                  cacheKey = qs.stringify({
                    url: url,
                    params: params
                  }, {
                    arrayFormat: 'brackets'
                  });
                  provider = _this3.cacheProvider();

                  if (!(_this3.cache.clear === 'auto' && params.version === 'draft')) {
                    _context10.next = 5;
                    break;
                  }

                  _context10.next = 5;
                  return _this3.flushCache();

                case 5:
                  if (!(params.version === 'published' && url != '/cdn/spaces/me')) {
                    _context10.next = 11;
                    break;
                  }

                  _context10.next = 8;
                  return provider.get(cacheKey);

                case 8:
                  cache = _context10.sent;

                  if (!cache) {
                    _context10.next = 11;
                    break;
                  }

                  return _context10.abrupt("return", resolve(cache));

                case 11:
                  _context10.prev = 11;
                  _context10.next = 14;
                  return _this3.throttle('get', url, {
                    params: params,
                    paramsSerializer: function paramsSerializer(params) {
                      return qs.stringify(params, {
                        arrayFormat: 'brackets'
                      });
                    }
                  });

                case 14:
                  res = _context10.sent;
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
                    _context10.next = 19;
                    break;
                  }

                  return _context10.abrupt("return", reject(res));

                case 19:
                  if (!(typeof params.resolve_relations !== 'undefined' && params.resolve_relations.length > 0)) {
                    _context10.next = 22;
                    break;
                  }

                  _context10.next = 22;
                  return _this3.resolveRelations(response.data, params);

                case 22:
                  if (params.version === 'published' && url != '/cdn/spaces/me') {
                    provider.set(cacheKey, response);
                  }

                  if (response.data.cv && (params.version == 'draft' || res.request._redirectable && res.request._redirectable._redirectCount === 1)) {
                    _cacheVersions[params.token] = response.data.cv;

                    if (params.version == 'draft' && _cacheVersions[params.token] != response.data.cv) {
                      _this3.flushCache();
                    }
                  }

                  resolve(response);
                  _context10.next = 37;
                  break;

                case 27:
                  _context10.prev = 27;
                  _context10.t0 = _context10["catch"](11);

                  if (!(_context10.t0.response && _context10.t0.response.status === 429)) {
                    _context10.next = 36;
                    break;
                  }

                  retries = retries + 1;

                  if (!(retries < _this3.maxRetries)) {
                    _context10.next = 36;
                    break;
                  }

                  console.log("Hit rate limit. Retrying in ".concat(retries, " seconds."));
                  _context10.next = 35;
                  return delay(1000 * retries);

                case 35:
                  return _context10.abrupt("return", _this3.cacheResponse(url, params, retries).then(resolve).catch(reject));

                case 36:
                  reject(_context10.t0);

                case 37:
                case "end":
                  return _context10.stop();
              }
            }
          }, _callee3, null, [[11, 27]]);
        }));

        return function (_x4, _x5) {
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
    key: "cacheVersions",
    value: function cacheVersions() {
      return _cacheVersions;
    }
  }, {
    key: "cacheVersion",
    value: function cacheVersion() {
      return _cacheVersions[this.accessToken];
    }
  }, {
    key: "setCacheVersion",
    value: function setCacheVersion(cv) {
      if (this.accessToken) {
        _cacheVersions[this.accessToken] = cv;
      }
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
            getAll: function getAll() {
              return memory;
            },
            set: function set(key, content) {
              memory[key] = content;
            },
            flush: function flush() {
              memory = {};
            }
          };

        default:
          return {
            get: function get() {},
            getAll: function getAll() {},
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
      _regenerator.default.mark(function _callee4() {
        return _regenerator.default.wrap(function _callee4$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.next = 2;
                return this.cacheProvider().flush();

              case 2:
                return _context11.abrupt("return", this);

              case 3:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee4, this);
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