import throttledQueue from './throttlePromise'
import RichTextResolver from './richTextResolver'
import { SbHelpers } from './sbHelpers'
import SbFetch from './sbFetch'
import { STORYBLOK_AGENT, STORYBLOK_JS_CLIENT_AGENT } from './constants'

import Method from './constants'
import {
  ISbStoriesParams,
  ISbCache,
  ISbConfig,
  ISbLinkURLObject,
  ISbResult,
  ISbStories,
  ISbStory,
  ISbStoryData,
  ISbStoryParams,
  ISbContentMangmntAPI,
  ISbNode,
  ThrottleFn,
  IMemoryType,
  ICacheProvider,
  ISbCustomFetch,
} from './interfaces'

let memory: Partial<IMemoryType> = {}

const cacheVersions = {} as CachedVersions

type ComponentResolverFn = {
  (...args: any): any
}

type CachedVersions = {
  [key: string]: number
}

type LinksType = {
  [key: string]: any
}

type RelationsType = {
  [key: string]: any
}

interface ISbFlatMapped {
  data: any
}

export interface ISbResponseData {
  link_uuids: string[]
  links: string[]
  rel_uuids: string[]
  rels: any
  story: ISbStoryData
  stories: Array<ISbStoryData>
}

const VERSION = {
  V1: 'v1',
  V2: 'v2',
} as const

type ObjectValues<T> = T[keyof T]
type Version = ObjectValues<typeof VERSION>

class Storyblok {
  private client: SbFetch
  private maxRetries: number
  private retriesDelay: number
  private throttle: ThrottleFn
  private accessToken: string
  private cache: ISbCache
  private helpers: SbHelpers
  private resolveCounter: number
  public relations: RelationsType
  public links: LinksType
  // TODO: Remove on v7.x.x
  public richTextResolver: RichTextResolver
  public resolveNestedRelations: boolean
  private stringifiedStoriesCache: Record<string, string>

  /**
   *
   * @param config ISbConfig interface
   * @param endpoint string, optional
   */
  public constructor(config: ISbConfig, pEndpoint?: string) {
    let endpoint = config.endpoint || pEndpoint

    if (!endpoint) {
      const getRegion = new SbHelpers().getRegionURL
      const protocol = config.https === false ? 'http' : 'https'

      if (!config.oauthToken) {
        endpoint = `${protocol}://${getRegion(config.region)}/${'v2' as Version}`
      } else {
        endpoint = `${protocol}://${getRegion(config.region)}/${'v1' as Version}`
      }
    }

    const headers: Headers = new Headers()

    headers.set('Content-Type', 'application/json')
    headers.set('Accept', 'application/json')

    if (config.headers) {
      const entries = (config.headers.constructor.name === 'Headers') ? config.headers.entries().toArray() : Object.entries(config.headers)

      entries.forEach(([key, value]: [string, string]) => {
        headers.set(key, value)
      })
    }

    if (!headers.has(STORYBLOK_AGENT)) {
      headers.set(STORYBLOK_AGENT, STORYBLOK_JS_CLIENT_AGENT.defaultAgentName)
      headers.set(
        STORYBLOK_JS_CLIENT_AGENT.defaultAgentVersion,
        STORYBLOK_JS_CLIENT_AGENT.packageVersion
      )
    }

    let rateLimit = 5 // per second for cdn api

    if (config.oauthToken) {
      headers.set('Authorization', config.oauthToken)
      rateLimit = 3 // per second for management api
    }

    if (config.rateLimit) {
      rateLimit = config.rateLimit
    }

    if (config.richTextSchema) {
      this.richTextResolver = new RichTextResolver(config.richTextSchema)
    } else {
      this.richTextResolver = new RichTextResolver()
    }

    if (config.componentResolver) {
      this.setComponentResolver(config.componentResolver)
    }

    this.maxRetries = config.maxRetries || 10
    this.retriesDelay = 300
    this.throttle = throttledQueue(this.throttledRequest, rateLimit, 1000)
    this.accessToken = config.accessToken || ''
    this.relations = {} as RelationsType
    this.links = {} as LinksType
    this.cache = config.cache || { clear: 'manual' }
    this.helpers = new SbHelpers()
    this.resolveCounter = 0
    this.resolveNestedRelations = config.resolveNestedRelations || true
    this.stringifiedStoriesCache = {} as Record<string, string>

    this.client = new SbFetch({
      baseURL: endpoint,
      timeout: config.timeout || 0,
      headers: headers,
      responseInterceptor: config.responseInterceptor,
      fetch: config.fetch,
    })
  }

  public setComponentResolver(resolver: ComponentResolverFn): void {
    this.richTextResolver.addNode('blok', (node: ISbNode) => {
      let html = ''

      if (node.attrs.body) {
        node.attrs.body.forEach((blok) => {
          html += resolver(blok.component, blok)
        })
      }

      return {
        html: html,
      }
    })
  }

  private parseParams(params: ISbStoriesParams): ISbStoriesParams {
    if (!params.token) {
      params.token = this.getToken()
    }

    if (!params.cv) {
      params.cv = cacheVersions[params.token]
    }

    if (Array.isArray(params.resolve_relations)) {
      params.resolve_relations = params.resolve_relations.join(',')
    }

    if (typeof params.resolve_relations !== 'undefined') {
      params.resolve_level = 2
    }

    return params
  }

  private factoryParamOptions(
    url: string,
    params: ISbStoriesParams
  ): ISbStoriesParams {
    if (this.helpers.isCDNUrl(url)) {
      return this.parseParams(params)
    }

    return params
  }

  private makeRequest(
    url: string,
    params: ISbStoriesParams,
    per_page: number,
    page: number,
    fetchOptions?: ISbCustomFetch
  ): Promise<ISbResult> {
    const query = this.factoryParamOptions(
      url,
      this.helpers.getOptionsPage(params, per_page, page)
    )

    return this.cacheResponse(url, query, undefined, fetchOptions)
  }

  public get(
    slug: string,
    params?: ISbStoriesParams,
    fetchOptions?: ISbCustomFetch
  ): Promise<ISbResult> {
    if (!params) params = {} as ISbStoriesParams
    const url = `/${slug}`
    const query = this.factoryParamOptions(url, params)

    return this.cacheResponse(url, query, undefined, fetchOptions)
  }

  public async getAll(
    slug: string,
    params: ISbStoriesParams,
    entity?: string,
    fetchOptions?: ISbCustomFetch
  ): Promise<any[]> {
    const perPage = params?.per_page || 25
    const url = `/${slug}`.replace(/\/$/, '')
    const e = entity ?? url.substring(url.lastIndexOf('/') + 1)

    const firstPage = 1
    const firstRes = await this.makeRequest(
      url,
      params,
      perPage,
      firstPage,
      fetchOptions
    )
    const lastPage = firstRes.total ? Math.ceil(firstRes.total / perPage) : 1

    const restRes: any = await this.helpers.asyncMap(
      this.helpers.range(firstPage, lastPage),
      (i: number) => {
        return this.makeRequest(url, params, perPage, i + 1, fetchOptions)
      }
    )

    return this.helpers.flatMap([firstRes, ...restRes], (res: ISbFlatMapped) =>
      Object.values(res.data[e])
    )
  }

  public post(
    slug: string,
    params: ISbStoriesParams | ISbContentMangmntAPI,
    fetchOptions?: ISbCustomFetch
  ): Promise<ISbResponseData> {
    const url = `/${slug}`

    return Promise.resolve(this.throttle('post', url, params, fetchOptions))
  }

  public put(
    slug: string,
    params: ISbStoriesParams | ISbContentMangmntAPI,
    fetchOptions?: ISbCustomFetch
  ): Promise<ISbResponseData> {
    const url = `/${slug}`

    return Promise.resolve(this.throttle('put', url, params, fetchOptions))
  }

  public delete(
    slug: string,
    params: ISbStoriesParams | ISbContentMangmntAPI,
    fetchOptions?: ISbCustomFetch
  ): Promise<ISbResponseData> {
    const url = `/${slug}`

    return Promise.resolve(this.throttle('delete', url, params, fetchOptions))
  }

  public getStories(
    params: ISbStoriesParams,
    fetchOptions?: ISbCustomFetch
  ): Promise<ISbStories> {
    this._addResolveLevel(params)

    return this.get('cdn/stories', params, fetchOptions)
  }

  public getStory(
    slug: string,
    params: ISbStoryParams,
    fetchOptions?: ISbCustomFetch
  ): Promise<ISbStory> {
    this._addResolveLevel(params)

    return this.get(`cdn/stories/${slug}`, params, fetchOptions)
  }

  private getToken(): string {
    return this.accessToken
  }

  public ejectInterceptor(): void {
    this.client.eject()
  }

  private _addResolveLevel(params: ISbStoriesParams | ISbStoryParams): void {
    if (typeof params.resolve_relations !== 'undefined') {
      params.resolve_level = 2
    }
  }

  private _cleanCopy(value: LinksType): JSON {
    return JSON.parse(JSON.stringify(value))
  }

  private _insertLinks(
    jtree: ISbStoriesParams,
    treeItem: keyof ISbStoriesParams,
    resolveId: string
  ): void {
    const node = jtree[treeItem]

    if (
      node &&
      node.fieldtype == 'multilink' &&
      node.linktype == 'story' &&
      typeof node.id === 'string' &&
      this.links[resolveId][node.id]
    ) {
      node.story = this._cleanCopy(this.links[resolveId][node.id])
    } else if (
      node &&
      node.linktype === 'story' &&
      typeof node.uuid === 'string' &&
      this.links[resolveId][node.uuid]
    ) {
      node.story = this._cleanCopy(this.links[resolveId][node.uuid])
    }
  }

  /**
   *
   * @param resolveId A counter number as a string
   * @param uuid The uuid of the story
   * @returns string | object
   */
  private getStoryReference(resolveId: string, uuid: string): string | JSON {
    if (!this.relations[resolveId][uuid]) return uuid
    if (!this.stringifiedStoriesCache[uuid])
      this.stringifiedStoriesCache[uuid] = JSON.stringify(
        this.relations[resolveId][uuid]
      )
    return JSON.parse(this.stringifiedStoriesCache[uuid])
  }

  private _insertRelations(
    jtree: ISbStoriesParams,
    treeItem: keyof ISbStoriesParams,
    fields: string | Array<string>,
    resolveId: string
  ): void {
    if (fields.indexOf(`${jtree.component}.${treeItem}`) > -1) {
      if (typeof jtree[treeItem] === 'string') {
        jtree[treeItem] = this.getStoryReference(resolveId, jtree[treeItem])
      } else if (Array.isArray(jtree[treeItem])) {
        jtree[treeItem] = jtree[treeItem as keyof ISbStoriesParams]
          .map((uuid: string) => this.getStoryReference(resolveId, uuid))
          .filter(Boolean)
      }
    }
  }

  private iterateTree(
    story: ISbStoryData,
    fields: string | Array<string>,
    resolveId: string
  ): void {
    const enrich = (jtree: ISbStoriesParams | any) => {
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
        for (const treeItem in jtree) {
          if ((jtree.component && jtree._uid) || jtree.type === 'link') {
            this._insertRelations(
              jtree,
              treeItem as keyof ISbStoriesParams,
              fields,
              resolveId
            )
            this._insertLinks(
              jtree,
              treeItem as keyof ISbStoriesParams,
              resolveId
            )
          }
          enrich(jtree[treeItem])
        }
      }
    }

    enrich(story.content)
  }

  private async resolveLinks(
    responseData: ISbResponseData,
    params: ISbStoriesParams,
    resolveId: string
  ): Promise<void> {
    let links: (ISbStoryData | ISbLinkURLObject | string)[] = []

    if (responseData.link_uuids) {
      const relSize = responseData.link_uuids.length
      const chunks = []
      const chunkSize = 50

      for (let i = 0; i < relSize; i += chunkSize) {
        const end = Math.min(relSize, i + chunkSize)
        chunks.push(responseData.link_uuids.slice(i, end))
      }

      for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
        const linksRes = await this.getStories({
          per_page: chunkSize,
          language: params.language,
          version: params.version,
          by_uuids: chunks[chunkIndex].join(','),
        })

        linksRes.data.stories.forEach(
          (rel: ISbStoryData | ISbLinkURLObject | string) => {
            links.push(rel)
          }
        )
      }
    } else {
      links = responseData.links
    }

    links.forEach((story: ISbStoryData | any) => {
      this.links[resolveId][story.uuid] = {
        ...story,
        ...{ _stopResolving: true },
      }
    })
  }

  private async resolveRelations(
    responseData: ISbResponseData,
    params: ISbStoriesParams,
    resolveId: string
  ): Promise<void> {
    let relations = []

    if (responseData.rel_uuids) {
      const relSize = responseData.rel_uuids.length
      const chunks = []
      const chunkSize = 50

      for (let i = 0; i < relSize; i += chunkSize) {
        const end = Math.min(relSize, i + chunkSize)
        chunks.push(responseData.rel_uuids.slice(i, end))
      }

      for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
        const relationsRes = await this.getStories({
          per_page: chunkSize,
          language: params.language,
          version: params.version,
          by_uuids: chunks[chunkIndex].join(','),
          excluding_fields: params.excluding_fields,
        })

        relationsRes.data.stories.forEach((rel: ISbStoryData) => {
          relations.push(rel)
        })
      }
    } else {
      relations = responseData.rels
    }

    if (relations && relations.length > 0) {
      relations.forEach((story: ISbStoryData) => {
        this.relations[resolveId][story.uuid] = {
          ...story,
          ...{ _stopResolving: true },
        }
      })
    }
  }

  /**
   *
   * @param responseData
   * @param params
   * @param resolveId
   * @description Resolves the relations and links of the stories
   * @returns Promise<void>
   *
   */
  private async resolveStories(
    responseData: ISbResponseData,
    params: ISbStoriesParams,
    resolveId: string
  ): Promise<void> {
    let relationParams: string[] = []

    this.links[resolveId] = {}
    this.relations[resolveId] = {}

    if (
      typeof params.resolve_relations !== 'undefined' &&
      params.resolve_relations.length > 0
    ) {
      if (typeof params.resolve_relations === 'string') {
        relationParams = params.resolve_relations.split(',')
      }
      await this.resolveRelations(responseData, params, resolveId)
    }

    if (
      params.resolve_links &&
      ['1', 'story', 'url', 'link'].indexOf(params.resolve_links) > -1 &&
      (responseData.links?.length || responseData.link_uuids?.length)
    ) {
      await this.resolveLinks(responseData, params, resolveId)
    }

    if (this.resolveNestedRelations) {
      for (const relUuid in this.relations[resolveId]) {
        this.iterateTree(
          this.relations[resolveId][relUuid],
          relationParams,
          resolveId
        )
      }
    }

    if (responseData.story) {
      this.iterateTree(responseData.story, relationParams, resolveId)
    } else {
      responseData.stories.forEach((story: ISbStoryData) => {
        this.iterateTree(story, relationParams, resolveId)
      })
    }

    this.stringifiedStoriesCache = {}

    delete this.links[resolveId]
    delete this.relations[resolveId]
  }

  private async cacheResponse(
    url: string,
    params: ISbStoriesParams,
    retries?: number,
    fetchOptions?: ISbCustomFetch
  ): Promise<ISbResult> {
    const cacheKey = this.helpers.stringify({ url: url, params: params })
    const provider = this.cacheProvider()

    if (this.cache.clear === 'auto' && params.version === 'draft') {
      await this.flushCache()
    }

    if (params.version === 'published' && url != '/cdn/spaces/me') {
      const cache = await provider.get(cacheKey)
      if (cache) {
        return Promise.resolve(cache)
      }
    }

    return new Promise(async (resolve, reject) => {
      try {
        const res = await this.throttle('get', url, params, fetchOptions)
        if (res.status !== 200) {
          return reject(res)
        }

        let response = { data: res.data, headers: res.headers } as ISbResult

        if (res.headers?.['per-page']) {
          response = Object.assign({}, response, {
            perPage: res.headers['per-page']
              ? parseInt(res.headers['per-page'])
              : 0,
            total: res.headers['per-page'] ? parseInt(res.headers['total']) : 0,
          })
        }

        if (response.data.story || response.data.stories) {
          const resolveId = (this.resolveCounter = ++this.resolveCounter % 1000)
          await this.resolveStories(response.data, params, `${resolveId}`)
        }

        if (params.version === 'published' && url != '/cdn/spaces/me') {
          await provider.set(cacheKey, response)
        }

        if (
            response.data.cv
            && params.token
            && cacheVersions[params.token] != response.data.cv
        ) {
          await this.flushCache()
          cacheVersions[params.token] = response.data.cv
        }

        return resolve(response)
      } catch (error: Error | any) {
        if (error.response && error.status === 429) {
          retries = typeof retries === 'undefined' ? 0 : retries + 1

          if (retries < this.maxRetries) {
            console.log(
              `Hit rate limit. Retrying in ${this.retriesDelay / 1000} seconds.`
            )
            await this.helpers.delay(this.retriesDelay)
            return this.cacheResponse(url, params, retries)
              .then(resolve)
              .catch(reject)
          }
        }
        reject(error)
      }
    })
  }

  private throttledRequest(
    type: Method,
    url: string,
    params: ISbStoriesParams,
    fetchOptions?: ISbCustomFetch
  ): Promise<unknown> {
    this.client.setFetchOptions(fetchOptions)
    return this.client[type](url, params)
  }

  public cacheVersions(): CachedVersions {
    return cacheVersions
  }

  public cacheVersion(): number {
    return cacheVersions[this.accessToken]
  }

  public setCacheVersion(cv: number): void {
    if (this.accessToken) {
      cacheVersions[this.accessToken] = cv
    }
  }

  public clearCacheVersion(): void {
    if (this.accessToken) {
      cacheVersions[this.accessToken] = 0
    }
  }

  private cacheProvider(): ICacheProvider {
    switch (this.cache.type) {
      case 'memory':
        return {
          get(key: string) {
            return Promise.resolve(memory[key])
          },
          getAll() {
            return Promise.resolve(memory as IMemoryType)
          },
          set(key: string, content: ISbResult) {
            memory[key] = content
            return Promise.resolve(undefined)
          },
          flush() {
            memory = {}
            return Promise.resolve(undefined)
          },
        }
      case 'custom':
        if (this.cache.custom) return this.cache.custom
      // eslint-disable-next-line no-fallthrough
      default:
        return {
          get() {
            return Promise.resolve()
          },
          getAll() {
            return Promise.resolve(undefined)
          },
          set() {
            return Promise.resolve(undefined)
          },
          flush() {
            return Promise.resolve(undefined)
          },
        }
    }
  }

  public async flushCache(): Promise<this> {
    await this.cacheProvider().flush()
    this.clearCacheVersion()
    return this
  }
}

export default Storyblok