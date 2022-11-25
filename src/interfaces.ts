export interface ISbStoriesParams {
	token?: string
	with_tag?: string
	is_startpage?: 0 | 1
	starts_with?: string
	by_uuids?: string
	by_uuids_ordered?: string
	excluding_ids?: string
	excluding_fields?: string
	version?: 'draft' | 'published'
	resolve_links?: 'url' | 'story' | '0' | '1' | 'link'
	resolve_relations?: string
	resolve_assets?: number
	cv?: number
	sort_by?: string
	search_term?: string
	filter_query?: any
	per_page?: number
	page?: number
	from_release?: string
	language?: string
	fallback_lang?: string
	first_published_at_gt?: string
	first_published_at_lt?: string
	level?: number
	published_at_gt?: string
	published_at_lt?: string
	by_slugs?: string
	excluding_slugs?: string
	_stopResolving?: boolean
	component?: string
	filename?: string
	size?: string
	datasource?: string
	dimension?: string
}

export interface ISbStoryParams {
	token?: string
	find_by?: 'uuid'
	version?: 'draft' | 'published'
	resolve_links?: 'url' | 'story' | '0' | '1'
	resolve_relations?: string
	cv?: number
	from_release?: string
	language?: string
	fallback_lang?: string
}

type Dimension = {
	id: number
	name: string
	entry_value: string
	datasource_id: number
	created_at: string
	updated_at: string
}

/**
 * @interface ISbDimensions
 * @description Storyblok Dimensions Interface auxiliary interface
 * @description One use it to handle the API response
 */
export interface ISbDimensions {
	dimensions: Dimension[]
}

export interface ISbComponentType<T extends string> {
	_uid?: string
	component?: T
	_editable?: string
}

export interface ISbStoryData<
	Content = ISbComponentType<string> & { [index: string]: any }
> {
	alternates: ISbAlternateObject[]
	content: Content
	created_at: string
	full_slug: string
	group_id: string
	id: number
	is_startpage: boolean
	meta_data: any
	name: string
	parent_id: number
	position: number
	published_at: string | null
	first_published_at: string | null
	slug: string
	lang: string
	default_full_slug?: string
	translated_slugs?: {
		path: string
		name: string | null
		lang: ISbStoryData['lang']
	}[]
	sort_by_date: string | null
	tag_list: string[]
	uuid: string
}

export interface ISbAlternateObject {
	id: number
	name: string
	slug: string
	published: boolean
	full_slug: string
	is_folder: boolean
	parent_id: number
}

export interface ISbLinkURLObject {
	id: number
	name: string
	slug: string
	full_slug: string
	url: string
	uuid: string
}

export interface ISbStories {
	data: {
		cv: number
		links: (ISbStoryData | ISbLinkURLObject)[]
		rels: ISbStoryData[]
		stories: ISbStoryData[]
	}
	perPage: number
	total: number
	headers: any
}

export interface ISbStory {
	data: {
		cv: number
		links: (ISbStoryData | ISbLinkURLObject)[]
		rels: ISbStoryData[]
		story: ISbStoryData
	}
	headers: any
}

export interface ISbCache {
	type?: 'none' | 'memory'
	clear?: 'auto' | 'manual'
}

export interface ISbConfig {
	accessToken?: string
	oauthToken?: string
	resolveNestedRelations?: boolean
	cache?: ISbCache
	responseInterceptor?: (response: any) => any
	timeout?: number
	headers?: any
	region?: string
	maxRetries?: number
	https?: boolean
	rateLimit?: number
	componentResolver?: (component: string, data: any) => void
	richTextSchema?: ISbSchema
}

export interface ISbResult {
	data: any
	perPage: number
	total: number
	headers: Headers
}

export interface ISbResponse {
	status: number
	statusText: string
}

export interface ISbError {
	message: Error
	response: ISbResponse
}

export interface ISbNode extends Element {
	attrs: {
		anchor?: string
		body: Array<ISbComponentType<any>>
		href?: string
		level?: number
		linktype?: string
	}
}

export type NodeSchema = {
	(node: ISbNode): object
}

export type MarkSchema = {
	(node: ISbNode): object
}

export interface ISbContentMangmntAPI<
	Content = ISbComponentType<string> & { [index: string]: any }
> {
	story: {
		name: string
		slug: string
		content?: Content
		default_root?: boolean
		is_folder?: boolean
		parent_id?: string
		disble_fe_editor?: boolean
		path?: string
		is_startpage?: boolean
		position?: number
		first_published_at?: string
		translated_slugs_attributes?: {
			path: string
			name: string | null
			lang: ISbContentMangmntAPI['lang']
		}[]
	}
	force_update?: '1' | unknown
	release_id?: number
	publish?: '1' | unknown
	lang?: string
}

export interface ISbManagmentApiResult {
	data: any
	headers: any
}

export interface ISbSchema {
	nodes: any
	marks: any
	(arg: ISbRichtext): any
}

export interface ISbRichtext {
	content: []
	marks: []
	text: string
	type: string
}

export type ThrottleFn = {
	(...args: any): any
}

export type AsyncFn = (...args: any) => [] | Promise<ISbResult>

export type ArrayFn = (...args: any) => void
