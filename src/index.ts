import throttledQueue from './throttlePromise'
import RichTextResolver from './richTextResolver'
import { SbHelpers } from './sbHelpers'
import SbFetch from './sbFetch'

import { Method } from './enum'
import {
	ISbStoriesParams,
	ISbCache,
	ISbConfig,
	ISbResult,
	ISbStoryData,
	ISbContentMangmntAPI,
	ISbNode,
	ThrottleFn,
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

interface IMemoryType extends ISbResult {
	[key: string]: any
}

interface ISbFlatMapped {
	data: any
}

interface ICacheProvider {
	get: (key: string) => IMemoryType | void
	set: (key: string, content: ISbResult) => void
	getAll: () => IMemoryType | void
	flush: () => void
}

interface ISbResponseData {
	link_uuids: string[]
	links: string[]
	rel_uuids: string[]
	rels: any
	story: ISbStoryData
	stories: Array<ISbStoryData>
}

enum Version {
	V1 = 'v1',
	V2 = 'v2',
}

class Storyblok {
	private client: SbFetch
	private maxRetries?: number | 5
	private throttle: ThrottleFn
	private accessToken: string
	private cache: ISbCache
	private helpers: SbHelpers

	public relations: RelationsType
	public links: LinksType
	public richTextResolver: any
	public resolveNestedRelations: boolean

	/**
	 *
	 * @param config ISbConfig interface
	 * @param endpoint string, optional
	 */
	public constructor(config: ISbConfig, endpoint?: string) {
		if (!endpoint) {
			const region = config.region ? `-${config.region}` : ''
			const protocol = !config.https ? 'http' : 'https'

			if (!config.oauthToken) {
				endpoint = `${protocol}://api${region}.storyblok.com/${Version.V2}`
			} else {
				endpoint = `${protocol}://api${region}.storyblok.com/${Version.V1}`
			}
		}

		const headers = Object.assign({}, config.headers)
		let rateLimit = 5 // per second for cdn api

		if (config.oauthToken) {
			headers['Authorization'] = config.oauthToken
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

		this.maxRetries = config.maxRetries
		this.throttle = throttledQueue(this.throttledRequest, rateLimit, 1000)
		this.accessToken = config.accessToken || ''
		this.relations = {} as RelationsType
		this.links = {} as LinksType
		this.cache = config.cache || { clear: 'manual' }
		this.helpers = new SbHelpers()
		this.resolveNestedRelations = false

		this.client = new SbFetch({
			baseURL: endpoint,
			timeout: config.timeout || 0,
			headers: headers,
			responseInterceptor: config.responseInterceptor,
		})
	}

	public setComponentResolver(resolver: ComponentResolverFn): void {
		this.richTextResolver.addNode('blok', (node: ISbNode) => {
			let html = ''

			node.attrs.body.forEach((blok) => {
				html += resolver(blok.component, blok)
			})

			return {
				html: html,
			}
		})
	}

	private parseParams(params: ISbStoriesParams): ISbStoriesParams {
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
		page: number
	): Promise<ISbResult> {
		const options = this.factoryParamOptions(
			url,
			this.helpers.getOptionsPage(params, per_page, page)
		)

		return this.cacheResponse(url, options)
	}

	public get(slug: string, params?: ISbStoriesParams): Promise<ISbResult> {
		if (!params) params = {} as ISbStoriesParams
		const url = `/${slug}`
		const query = this.factoryParamOptions(url, params)

		return this.cacheResponse(url, query)
	}

	public async getAll(
		slug: string,
		params: ISbStoriesParams,
		entity?: string
	): Promise<ISbResult> {
		const perPage = params?.per_page || 25
		const url = `/${slug}`
		const urlParts = url.split('/')
		const e = entity || urlParts[urlParts.length - 1]

		const firstPage = 1
		const firstRes = await this.makeRequest(url, params, perPage, firstPage)
		const lastPage = Math.ceil(firstRes.total / perPage)

		const restRes: any = await this.helpers.asyncMap(
			this.helpers.range(firstPage, lastPage),
			(i: number) => {
				return this.makeRequest(url, params, perPage, i + 1)
			}
		)

		return this.helpers.flatMap([firstRes, ...restRes], (res: ISbFlatMapped) =>
			Object.values(res.data[e])
		)
	}

	public post(
		slug: string,
		params: ISbStoriesParams | ISbContentMangmntAPI
	): Promise<ISbResponseData> {
		const url = `/${slug}`
		return Promise.resolve(this.throttle('post', url, params))
	}

	public put(
		slug: string,
		params: ISbStoriesParams | ISbContentMangmntAPI
	): Promise<ISbResponseData> {
		const url = `/${slug}`
		return Promise.resolve(this.throttle('put', url, params))
	}

	public delete(
		slug: string,
		params: ISbStoriesParams | ISbContentMangmntAPI
	): Promise<ISbResponseData> {
		const url = `/${slug}`
		return Promise.resolve(this.throttle('delete', url, params))
	}

	public getStories(params: ISbStoriesParams): Promise<ISbResult> {
		return this.get('cdn/stories', params)
	}

	public getStory(slug: string, params: ISbStoriesParams): Promise<ISbResult> {
		return this.get(`cdn/stories/${slug}`, params)
	}

	private getToken(): string {
		return this.accessToken
	}

	public ejectInterceptor(): void {
		this.client.eject()
	}

	private _cleanCopy(value: LinksType): JSON {
		return JSON.parse(JSON.stringify(value))
	}

	private _insertLinks(
		jtree: ISbStoriesParams,
		treeItem: keyof ISbStoriesParams
	): void {
		const node = jtree[treeItem]

		if (
			node &&
			node.fieldtype == 'multilink' &&
			node.linktype == 'story' &&
			typeof node.id === 'string' &&
			this.links[node.id]
		) {
			node.story = this._cleanCopy(this.links[node.id])
		} else if (
			node &&
			node.linktype === 'story' &&
			typeof node.uuid === 'string' &&
			this.links[node.uuid]
		) {
			node.story = this._cleanCopy(this.links[node.uuid])
		}
	}

	private _insertRelations(
		jtree: ISbStoriesParams,
		treeItem: keyof ISbStoriesParams,
		fields: string | Array<string>
	): void {
		if (fields.indexOf(`${jtree.component}.${treeItem}`) > -1) {
			if (typeof jtree[treeItem] === 'string') {
				if (this.relations[jtree[treeItem]]) {
					jtree[treeItem] = this._cleanCopy(this.relations[jtree[treeItem]])
				}
			} else if (jtree[treeItem].constructor === Array) {
				const stories: JSON[] = []
				jtree[treeItem].forEach((uuid: string) => {
					if (this.relations[uuid]) {
						stories.push(this._cleanCopy(this.relations[uuid]))
					}
				})
				jtree[treeItem] = stories
			}
		}
	}

	private iterateTree(
		story: ISbStoryData,
		fields: string | Array<string>
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
							fields
						)
						this._insertLinks(jtree, treeItem as keyof ISbStoriesParams)
					}
					enrich(jtree[treeItem])
				}
			}
		}

		enrich(story.content)
	}

	private async resolveLinks(
		responseData: ISbResponseData,
		params: ISbStoriesParams
	): Promise<void> {
		let links: string[] = []

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

				linksRes.data.stories.forEach((rel: string) => {
					links.push(rel)
				})
			}
		} else {
			links = responseData.links
		}

		links.forEach((story: ISbStoryData | any) => {
			this.links[story.uuid] = { ...story, ...{ _stopResolving: true } }
		})
	}

	private async resolveRelations(
		responseData: ISbResponseData,
		params: ISbStoriesParams
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
				})

				relationsRes.data.stories.forEach((rel: string) => {
					relations.push(rel)
				})
			}
		} else {
			relations = responseData.rels
		}

		relations.forEach((story: ISbStoryData) => {
			this.relations[story.uuid] = { ...story, ...{ _stopResolving: true } }
		})
	}

	private async resolveStories(
		responseData: ISbResponseData,
		params: ISbStoriesParams
	): Promise<void> {
		let relationParams: string[] = []

		if (
			typeof params.resolve_relations !== 'undefined' &&
			params.resolve_relations.length > 0
		) {
			relationParams = params.resolve_relations.split(',')
			await this.resolveRelations(responseData, params)
		}

		if (
			params.resolve_links &&
			['1', 'story', 'url'].indexOf(params.resolve_links) > -1 &&
			(responseData.links?.length || responseData.link_uuids?.length)
		) {
			await this.resolveLinks(responseData, params)
		}

		if (this.resolveNestedRelations) {
			for (const relUuid in this.relations) {
				this.iterateTree(this.relations[relUuid], relationParams)
			}
		}

		if (responseData.story) {
			this.iterateTree(responseData.story, relationParams)
		} else {
			responseData.stories.forEach((story: ISbStoryData) => {
				this.iterateTree(story, relationParams)
			})
		}
	}

	private cacheResponse(
		url: string,
		params: ISbStoriesParams,
		retries?: number
	): Promise<ISbResult> {
		if (typeof retries === 'undefined' || !retries) {
			retries = 0
		}

		return new Promise((resolve, reject) => {
			const cacheKey = this.helpers.stringify({ url: url, params: params })
			const provider = this.cacheProvider()

			if (this.cache.clear === 'auto' && params.version === 'draft') {
				this.flushCache()
			}

			if (params.version === 'published' && url != '/cdn/spaces/me') {
				const cache = provider.get(cacheKey)
				if (cache) {
					return resolve(cache)
				}
			}

			try {
				;(async () => {
					const res = await this.throttle('get', url, params)

					let response = { data: res.data, headers: res.headers } as ISbResult

					if (res.headers['per-page']) {
						response = Object.assign({}, response, {
							perPage: parseInt(res.headers['per-page']),
							total: parseInt(res.headers['total']),
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

					if (response.data.cv && params.token) {
						if (
							params.version == 'draft' &&
							cacheVersions[params.token] != response.data.cv
						) {
							this.flushCache()
						}

						cacheVersions[params.token] = response.data.cv
					}

					resolve(response)
				})()
			} catch (error: Error | any) {
				;async () => {
					if (error.response && error.response.status === 429) {
						retries = retries ? retries + 1 : 0

						if (this.maxRetries && retries < this.maxRetries) {
							await this.helpers.delay(1000 * retries)
							return this.cacheResponse(url, params, retries)
								.then(resolve)
								.catch(reject)
						}
					}
					reject(error.message)
				}
			}
		})
	}

	private throttledRequest(
		type: Method,
		url: string,
		params: ISbStoriesParams
	): Promise<unknown> {
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

	private cacheProvider(): ICacheProvider {
		switch (this.cache.type) {
			case 'memory':
				return {
					get(key: string) {
						return memory[key]
					},
					getAll() {
						return memory as IMemoryType
					},
					set(key: string, content: ISbResult) {
						memory[key] = content
					},
					flush() {
						memory = {}
					},
				}
			default:
				return {
					get() {
						return undefined
					},
					getAll() {
						return undefined
					},
					set() {
						return undefined
					},
					flush() {
						return undefined
					},
				}
		}
	}

	private flushCache(): this {
		this.cacheProvider().flush()
		return this
	}
}

export default Storyblok
