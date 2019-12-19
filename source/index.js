'use strict'

const qs = require('qs')
const axios = require('axios')
const throttledQueue = require('./throttlePromise')
const RichTextResolver = require('./richTextResolver')
let memory = {}

const { delay, getOptionsPage, isCDNUrl } = require('./helpers')


class Storyblok {

  constructor(config, endpoint) {
    if (!endpoint) {
      let region = config.region ? `-${config.region}` : ''
      let protocol = config.https === false ? 'http' : 'https'
      endpoint = `${protocol}://api${region}.storyblok.com/v1`
    }

    let headers = Object.assign({}, config.headers)
    let rateLimit = 5 // per second for cdn api

    if (typeof config.oauthToken != 'undefined') {
      headers['Authorization'] = config.oauthToken
      rateLimit = 3 // per second for management api
    }

    if (typeof config.rateLimit != 'undefined') {
      rateLimit = config.rateLimit
    }

    this.richTextResolver = new RichTextResolver()

    if (typeof config.componentResolver === 'function') {
      this.setComponentResolver(config.componentResolver)
    }

    this.maxRetries = config.maxRetries || 5
    this.throttle = throttledQueue(this.throttledRequest, rateLimit, 1000)
    this.cacheVersion = (this.cacheVersion || this.newVersion())
    this.accessToken = config.accessToken
    this.cache = (config.cache || { clear: 'manual' })
    this.client = axios.create({
      baseURL: endpoint,
      timeout: (config.timeout || 0),
      headers: headers,
      proxy: (config.proxy || false)
    })
  }

  setComponentResolver(resolver) {
    this.richTextResolver.addNode('blok', (node) => {
      let html = ''

      node.attrs.body.forEach((blok) => {
        html += resolver(blok.component, blok)
      })

      return {
        html: html
      }
    })
  }

  parseParams(params = {}) {
    if (!params.version) {
      params.version = 'published'
    }

    if (!params.cv) {
      params.cv = this.cacheVersion
    }

    if (!params.token) {
      params.token = this.getToken()
    }

    return params
  }

  factoryParamOptions(url, params = {}) {
    if (isCDNUrl(url)) {
      return this.parseParams(params)
    }

    return params
  }

  makeRequest(url, params, per_page, page) {
    const options = this.factoryParamOptions(
      url,
      getOptionsPage(params, per_page, page)
    )

    return this.cacheResponse(url, options)
  }

  get(slug, params) {
    let url = `/${slug}`
    const query = this.factoryParamOptions(url, params)

    return this.cacheResponse(url, query)
  }

  async getAll(slug, params = {}, entity) {
    const perPage = params.per_page || 25
    let page = 1
    let url = `/${slug}`
    const urlParts = url.split('/')
    entity = entity || urlParts[urlParts.length - 1]

    let res = await this.makeRequest(url, params, perPage, page)
    let all = Object.values(res.data[entity])
    let total = res.total
    let lastPage = Math.ceil((total / perPage))

    while (page < lastPage) {
      page++
      res = await this.makeRequest(url, params, perPage, page)
      all = [
        ...all,
        ...Object.values(res.data[entity])
      ]
    }

    return all
  }

  post(slug, params) {
    let url = `/${slug}`
    return this.throttle('post', url, params)
  }

  put(slug, params) {
    let url = `/${slug}`
    return this.throttle('put', url, params)
  }

  delete(slug, params) {
    let url = `/${slug}`
    return this.throttle('delete', url, params)
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

  cacheResponse(url, params, retries) {
    if (typeof retries === 'undefined') {
      retries = 0
    }

    return new Promise(async (resolve, reject) => {
      let cacheKey = qs.stringify({ url: url, params: params }, { arrayFormat: 'brackets' })
      let provider = this.cacheProvider()

      if (this.cache.clear === 'auto' && params.version === 'draft') {
        await this.flushCache()
      }

      if (params.version === 'published' && url != '/cdn/spaces/me') {
        const cache = await provider.get(cacheKey)
        if (cache) {
          return resolve(cache)
        }
      }

      try {
        let res = await this.throttle('get', url, {
          params: params,
          paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'brackets' })
        })
        let response = { data: res.data, headers: res.headers }

        if (res.headers['per-page']) {
          response = Object.assign({}, response, {
            perPage: parseInt(res.headers['per-page']),
            total: parseInt(res.headers['total'])
          })
        }

        if (res.status != 200) {
          return reject(res)
        }

        if (params.version === 'published' && url != '/cdn/spaces/me') {
          provider.set(cacheKey, response)
        }
        resolve(response)
      } catch (error) {
        if (error.response && error.response.status === 429) {
          retries = retries + 1

          if (retries < this.maxRetries) {
            console.log(`Hit rate limit. Retrying in ${retries} seconds.`)
            await delay(1000 * retries)
            return this.cacheResponse(url, params, retries).then(resolve).catch(reject)
          }
        }
        reject(error)
      }
    })
  }

  throttledRequest(type, url, params) {
    return this.client[type](url, params)
  }

  newVersion() {
    return new Date().getTime()
  }

  cacheProvider() {
    switch (this.cache.type) {
      case 'memory':
        return {
          get(key) {
            return memory[key]
          },
          getAll() {
            return memory
          },
          set(key, content) {
            memory[key] = content
          },
          flush() {
            memory = {}
          }
        }
      default:
        this.cacheVersion = this.newVersion()

        return {
          get() {},
          getAll() {},
          set() {},
          flush() {}
        }
    }
  }

  async flushCache() {
    this.cacheVersion = this.newVersion()
    await this.cacheProvider().flush()
    return this
  }
}

module.exports = Storyblok
