'use strict';

const API_ENDPOINT_DEFAULT = 'https://api.storyblok.com/v1';
const hash = require('object-hash');
const axios = require('axios');
let memory = {};

class Storyblok {

  constructor(config, endpoint) {
    if (!endpoint) {
      endpoint = API_ENDPOINT_DEFAULT;
    }

    let headers = Object.assign({'X-Storyblok-Client': 'JS/1.0.0'}, config.headers);

    this.cacheVersion = (this.cacheVersion || this.newVersion());
    this.accessToken = config.accessToken;
    this.cache = config.cache || {};
    this.client = axios.create({
      baseURL: endpoint,
      timeout: (config.timeout || 3000),
      headers: headers
    })
  }

  get(slug, params) {
    let query = params || {}
    let url = `/${slug}`;

    if (url.indexOf('/cdn/') > -1) {
      if (!query.version) {
        query.version = 'published';
      }

      query.token = this.getToken();
      query.cv = this.cacheVersion;
    }

    return this.cacheResponse(url, query);
  }

  getToken() {
    return this.accessToken;
  }

  cacheResponse(url, params) {
    return new Promise((resolve, reject) => {
      let cacheKey = hash({url: url, params: params});
      let provider = this.cacheProvider();
      let cache = provider.get(cacheKey);

      if (params.version === 'published' && cache) {
        resolve(cache);
      } else {
        this.client.get(url, {params: params})
          .then((res) => {
            let response = {data: res.data,  headers: res.headers}

            if (res.headers['per-page']) {
              response = Object.assign({}, response, {
                perPage: parseInt(res.headers['per-page']),
                total: parseInt(res.headers['total'])
              })
            }

            if (res.status != 200) {
              return reject(res);
            }

            if (params.version === 'published') {
              provider.set(cacheKey, response);
            }
            resolve(response);
          })
          .catch((response) => {
            reject(response);
          });
      }
    })
  }

  newVersion() {
    return new Date().getTime();
  }

  cacheProvider() {
    let cacheConfig = this.cache

    switch(this.cache.type) {
      case 'memory':
        return {
          get(key) {
            return memory[key];
          },
          set(key, content) {
            memory[key] = content;
          },
          flush() {
            memory = {};
          }
        }
        break;

      default:
        this.cacheVersion = this.newVersion();

        return {
          get() { },
          set() { },
          flush() { }
        }
    }
  }

  flushCache() {
    this.cacheVersion = this.newVersion();
    this.cacheProvider().flush();
    return this;
  }
}

export default Storyblok;
