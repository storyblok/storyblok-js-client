export interface IStoriesParams {
  token?: string
  with_tag?: string
  is_startpage?: 0 | 1
  starts_with?: string
  by_uuids?: string
  by_uuids_ordered?: string
  excluding_ids?: string
  excluding_fields?: string
  version?: 'draft' | 'published'
  resolve_links?: 'url' | 'story' | '0' | '1'
  resolve_relations?: string
  resolve_assets?: number,
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
}

export interface IStoryblokComponent<T extends string> {
  _uid?: string
  component?: T
  _editable?: string
}

export interface IStoryData<Content = IStoryblokComponent<string> & { [index: string]: any }> {
  alternates: IAlternateObject[]
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
  translated_slugs?: {path: string, name: string|null, lang: IStoryData['lang']}[]
  sort_by_date: string | null
  tag_list: string[]
  uuid: string
}

export interface IAlternateObject {
  id: number;
  name: string;
  slug: string;
  published: boolean;
  full_slug: string;
  is_folder: boolean;
  parent_id: number;
}

export interface IStoryblokCache {
  type?: 'none' | 'memory'
  clear?: 'auto' | 'manual'
}

export interface IStoryblokConfig {
  accessToken?: string
  oauthToken?: string
  cache?: IStoryblokCache
  responseInterceptor?: (response: any) => any
  timeout?: number
  headers?: any
  region?: string
  maxRetries?: number
  https?: boolean
  rateLimit?: number
  componentResolver?: (component: string, data: any) => void
  richTextSchema?: ISchema
}

export interface IStoryblokResult {
  data: any
  perPage: number
  total: number
  headers: Headers
}

export interface IResponse {
  status: number,
  statusText: string,
}

export interface IError {
  message: Error,
  response: IResponse,
}

export interface INode extends Element {
	attrs: {
		anchor?: string,
    body: Array<IStoryblokComponent<any>>,
		href?: string,
		level?: number,
		linktype?: string,
	},
}

export type NodeSchema = {
	(node: INode): object
}

export type MarkSchema = {
	(node: INode): object
}

type FirstPublished = `${number}-${number}-${number} ${number}:${number}`
export interface IContentMangmntAPI<Content = IStoryblokComponent<string> & { [index: string]: any }> {
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
    first_published_at?: FirstPublished
    translated_slugs_attributes?: {path: string, name: string|null, lang: IContentMangmntAPI['lang']}[]
  }
  force_update?: '1' | unknown
  release_id?: number
  publish?: '1' | unknown
  lang?: string
}

export interface ISchema {
	nodes: any,
	marks: any,
	(arg: IRichtext): any
}

export interface IRichtext {
  content: []
  marks: []
  text: string
  type: string
}

export type ThrottleFn = {
  (...args: any): any
}

export type AsyncFn = (...args: any) => [] | Promise<IStoryblokResult>

export type ArrayFn = (...args: any) => void