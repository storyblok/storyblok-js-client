'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var API_ENDPOINT_DEFAULT = 'https://api.storyblok.com/v1';
var hash = require('object-hash');
var qs = require('qs');
var axios = require('axios');
var throttledQueue = require('throttled-queue');
var memory = {};

var Storyblok = function () {
  function Storyblok(config, endpoint) {
    _classCallCheck(this, Storyblok);

    if (!endpoint) {
      endpoint = API_ENDPOINT_DEFAULT;
    }

    var headers = _extends({}, config.headers);

    this.throttle = throttledQueue(5, 1000);
    this.cacheVersion = this.cacheVersion || this.newVersion();
    this.accessToken = config.accessToken;
    this.cache = config.cache || { clear: 'manual' };
    this.client = axios.create({
      baseURL: endpoint,
      timeout: config.timeout || 5000,
      headers: headers
    });
  }

  _createClass(Storyblok, [{
    key: 'get',
    value: function get(slug, params) {
      var query = params || {};
      var url = '/' + slug;

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
    key: 'setToken',
    value: function setToken(token) {
      this.accessToken = token;
    }
  }, {
    key: 'getToken',
    value: function getToken() {
      return this.accessToken;
    }
  }, {
    key: 'cacheResponse',
    value: function cacheResponse(url, params) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        var cacheKey = qs.stringify({ url: url, params: params }, { arrayFormat: 'brackets' });
        var provider = _this.cacheProvider();
        var cache = provider.get(cacheKey);

        if (_this.cache.clear === 'auto' && params.version === 'draft') {
          _this.flushCache();
        }

        if (params.version === 'published' && cache) {
          resolve(cache);
        } else {
          _this.throttle(function () {
            _this.client.get(url, {
              params: params,
              paramsSerializer: function paramsSerializer(params) {
                return qs.stringify(params, { arrayFormat: 'brackets' });
              }
            }).then(function (res) {
              var response = { data: res.data, headers: res.headers };

              if (res.headers['per-page']) {
                response = _extends({}, response, {
                  perPage: parseInt(res.headers['per-page']),
                  total: parseInt(res.headers['total'])
                });
              }

              if (res.status != 200) {
                return reject(res);
              }

              if (params.version === 'published') {
                provider.set(cacheKey, response);
              }
              resolve(response);
            }).catch(function (response) {
              reject(response);
            });
          });
        }
      });
    }
  }, {
    key: 'newVersion',
    value: function newVersion() {
      return new Date().getTime();
    }
  }, {
    key: 'cacheProvider',
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
    key: 'flushCache',
    value: function flushCache() {
      this.cacheVersion = this.newVersion();
      this.cacheProvider().flush();
      return this;
    }
  }]);

  return Storyblok;
}();

module.exports = Storyblok;