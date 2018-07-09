'use strict'

const API_ENDPOINT_DEFAULT = 'https://api.storyblok.com/v1'
const qs = require('qs')
const axios = require('axios')
const throttledQueue = require('throttled-queue')
let memory = {}

class Storyblok {

  constructor(config, endpoint) {
    if (!endpoint) {
      endpoint = API_ENDPOINT_DEFAULT
    }

    let headers = Object.assign({}, config.headers)

    this.throttle = throttledQueue(5, 1000)
    this.cacheVersion = (this.cacheVersion || this.newVersion())
    this.accessToken = config.accessToken
    this.cache = config.cache || {clear: 'manual'}
    this.client = axios.create({
      baseURL: endpoint,
      timeout: (config.timeout || 5000),
      headers: headers
    })
  }

  get(slug, params) {
    let query = params || {}
    let url = `/${slug}`

    if (url.indexOf('/cdn/') > -1) {
      if (!query.version) {
        query.version = 'published'
      }

      if (!query.cv) {
        query.cv = this.cacheVersion
      }

      if (!query.token) {
        query.token = this.getToken()
      }
    }

    return this.cacheResponse(url, query)
  }

  getStories(params) {
    return this.get('cdn/stories', params)
  }

  getStory(slug, params) {
    return this.get(`cdn/stories/${slug}`, params)
  }

  setToken(token) {
    this.accessToken = token
  }

  getToken() {
    return this.accessToken
  }

  cacheResponse(url, params) {
    return new Promise((resolve, reject) => {
      let cacheKey = qs.stringify({url: url, params: params}, {arrayFormat: 'brackets'})
      let provider = this.cacheProvider()
      let cache = provider.get(cacheKey)

      if (this.cache.clear === 'auto' && params.version === 'draft') {
        this.flushCache()
      }

      if (params.version === 'published' && cache) {
        resolve(cache)
      } else {
        this.throttle(() => {
          this.client.get(url, {
              params: params,
              paramsSerializer: params => qs.stringify(params, {arrayFormat: 'brackets'})
            })
            .then((res) => {
              let response = {data: res.data,  headers: res.headers}

              if (res.headers['per-page']) {
                response = Object.assign({}, response, {
                  perPage: parseInt(res.headers['per-page']),
                  total: parseInt(res.headers['total'])
                })
              }

              if (res.status != 200) {
                return reject(res)
              }

              if (params.version === 'published') {
                provider.set(cacheKey, response)
              }
              resolve(response)
            })
            .catch((response) => {
              reject(response)
            })
        })
      }
    })
  }

  newVersion() {
    return new Date().getTime()
  }

  cacheProvider() {
    let cacheConfig = this.cache

    switch(this.cache.type) {
      case 'memory':
        return {
          get(key) {
            return memory[key]
          },
          set(key, content) {
            memory[key] = content
          },
          flush() {
            memory = {}
          }
        }
        break

      default:
        this.cacheVersion = this.newVersion()

        return {
          get() { },
          set() { },
          flush() { }
        }
    }
  }

  flushCache() {
    this.cacheVersion = this.newVersion()
    this.cacheProvider().flush()
    return this
  }
}

module.exports = Storyblok
