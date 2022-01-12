'use strict'

import axios from  'axios'

import throttledQueue from './throttlePromise'
import RichTextResolver from './richTextResolver'

let memory = {}
let cacheVersions = {}

import { stringify, delay, getOptionsPage, isCDNUrl, asyncMap, range, flatMap } from './helpers'

class Storyblok {

  constructor(config, endpoint) {
    if (!endpoint) {
      let region = config.region ? `-${config.region}` : ''
      let protocol = config.https === false ? 'http' : 'https'
      if (typeof config.oauthToken === 'undefined') {
        endpoint = `${protocol}://api${region}.storyblok.com/v2`
      } else {
        endpoint = `${protocol}://api${region}.storyblok.com/v1`
      }
    }

    let headers = Object.assign({}, config.headers)
    let rateLimit = 5 // per second for cdn api 

    if (typeof config.oauthToken !== 'undefined') {
      headers['Authorization'] = config.oauthToken
      rateLimit = 3 // per second for management api
    }

    if (typeof config.rateLimit !== 'undefined') {
      rateLimit = config.rateLimit
    }

    this.richTextResolver = new RichTextResolver(config.richTextSchema)

    if (typeof config.componentResolver === 'function') {
      this.setComponentResolver(config.componentResolver)
    }

    this.maxRetries = config.maxRetries || 5
    this.throttle = throttledQueue(this.throttledRequest, rateLimit, 1000)
    this.accessToken = config.accessToken
    this.relations = {}
    this.links = {}
    this.cache = (config.cache || { clear: 'manual' })
    this.client = axios.create({
      baseURL: endpoint,
      timeout: (config.timeout || 0),
      headers: headers,
      proxy: (config.proxy || false)
    })
    if (config.responseInterceptor) {
      this.client.interceptors.response.use((res) => {
        return config.responseInterceptor(res)
      })
    }
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

    if (!params.token) {
      params.token = this.getToken()
    }

    if (!params.cv) {
      params.cv = cacheVersions[params.token]
    }

    if (Array.isArray(params.resolve_relations)) {
      params.resolve_relations = params.resolve_relations.join(',')
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
    const url = `/${slug}`
    const urlParts = url.split('/')
    entity = entity || urlParts[urlParts.length - 1]

    const firstPage = 1
    const firstRes = await this.makeRequest(url, params, perPage, firstPage)
    const lastPage = Math.ceil(firstRes.total / perPage)

    const restRes = await asyncMap(range(firstPage, lastPage), async (i) => {
      return this.makeRequest(url, params, perPage, i + 1)
    })

    return flatMap([firstRes, ...restRes], (res) => Object.values(res.data[entity]))
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

  _cleanCopy(value) {
    return JSON.parse(JSON.stringify(value))
  }

  _insertLinks(jtree, treeItem) {
    const node = jtree[treeItem]

    if (node && node.fieldtype == 'multilink' &&
        node.linktype == 'story' &&
        typeof node.id === 'string' &&
        this.links[node.id]) {
      node.story = this._cleanCopy(this.links[node.id])
    } else if(node && node.linktype === 'story' &&
      typeof node.uuid === 'string' && this.links[node.uuid]) {
      node.story = this._cleanCopy(this.links[node.uuid])
    }
  }

  _insertRelations(jtree, treeItem, fields) {
    if (fields.indexOf(jtree.component + '.' + treeItem) > -1) {
      if (typeof jtree[treeItem] === 'string') {
        if (this.relations[jtree[treeItem]]) {
          jtree[treeItem] = this._cleanCopy(this.relations[jtree[treeItem]])
        }
      } else if (jtree[treeItem].constructor === Array) {
        let stories = []
        jtree[treeItem].forEach((uuid) => {
          if (this.relations[uuid]) {
            stories.push(this._cleanCopy(this.relations[uuid]))
          }
        })
        jtree[treeItem] = stories
      }
    }
  }

  iterateTree(story, fields) {
    let enrich = (jtree) => {
      if (jtree == null) {
        return
      }
      if (jtree.constructor === Array) {
        for (let item = 0; item < jtree.length; item++) {
          enrich(jtree[item])
        }
      } else if (jtree.constructor === Object) {
        if (jtree._stopResolving) {
          return
        }
        for (let treeItem in jtree) {
          if ((jtree.component && jtree._uid) || jtree.type === 'link') {
            this._insertRelations(jtree, treeItem, fields)
            this._insertLinks(jtree, treeItem)
          }
          enrich(jtree[treeItem])
        }
      }
    }

    enrich(story.content)
  }

  async resolveLinks(responseData, params) {
    let links = []

    if (responseData.link_uuids) {
      const relSize = responseData.link_uuids.length
      let chunks = []
      const chunkSize = 50

      for (let i = 0; i < relSize; i += chunkSize) {
        const end = Math.min(relSize, i + chunkSize)
        chunks.push(responseData.link_uuids.slice(i, end))
      }

      for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
        let linksRes = await this.getStories({per_page: chunkSize, language: params.language, version: params.version, by_uuids: chunks[chunkIndex].join(',')})

        linksRes.data.stories.forEach((rel) => {
          links.push(rel)
        })
      }
    } else {
      links = responseData.links
    }

    links.forEach((story) => {
      this.links[story.uuid] = {...story, ...{_stopResolving: true}}
    })
  }

  async resolveRelations(responseData, params) {
    let relations = []

    if (responseData.rel_uuids) {
      const relSize = responseData.rel_uuids.length
      let chunks = []
      const chunkSize = 50

      for (let i = 0; i < relSize; i += chunkSize) {
        const end = Math.min(relSize, i + chunkSize)
        chunks.push(responseData.rel_uuids.slice(i, end))
      }

      for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
        let relationsRes = await this.getStories({per_page: chunkSize, language: params.language, version: params.version, by_uuids: chunks[chunkIndex].join(',')})

        relationsRes.data.stories.forEach((rel) => {
          relations.push(rel)
        })
      }
    } else {
      relations = responseData.rels
    }

    relations.forEach((story) => {
      this.relations[story.uuid] = {...story, ...{_stopResolving: true}}
    })
  }

  async resolveStories(responseData, params) {
    let relationParams = []

    if (typeof params.resolve_relations !== 'undefined' && params.resolve_relations.length > 0) {
      relationParams = params.resolve_relations.split(',')
      await this.resolveRelations(responseData, params)
    }

    if (['1', 'story', 'url'].indexOf(params.resolve_links) > -1) {
      await this.resolveLinks(responseData, params)
    }

    for (const relUuid in this.relations) {
      this.iterateTree(this.relations[relUuid], relationParams)
    }

    if (responseData.story) {
      this.iterateTree(responseData.story, relationParams)
    } else {
      responseData.stories.forEach((story) => {
        this.iterateTree(story, relationParams)
      })
    }
  }

  cacheResponse(url, params, retries) {
    if (typeof retries === 'undefined') {
      retries = 0
    }

    return new Promise(async (resolve, reject) => {
      let cacheKey = stringify({ url: url, params: params })
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
          paramsSerializer: (params) => stringify(params)
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

        if (response.data.story || response.data.stories) {
          await this.resolveStories(response.data, params)
        }

        if (params.version === 'published' && url != '/cdn/spaces/me') {
          provider.set(cacheKey, response)
        }

        if (response.data.cv) {
          if (params.version == 'draft' && cacheVersions[params.token] != response.data.cv) {
            this.flushCache()
          }

          cacheVersions[params.token] = response.data.cv
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

  cacheVersions() {
    return cacheVersions
  }

  cacheVersion() {
    return cacheVersions[this.accessToken]
  }

  setCacheVersion(cv) {
    if (this.accessToken) {
      cacheVersions[this.accessToken] = cv
    }
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
        return {
          get() {},
          getAll() {},
          set() {},
          flush() {}
        }
    }
  }

  async flushCache() {
    await this.cacheProvider().flush()
    return this
  }
}

export default Storyblok
