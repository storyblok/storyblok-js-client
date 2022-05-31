import { ISchema } from '../types/commomInterfaces'

export interface IStoriesParams {
  token?: string
  with_tag?: string
  is_startpage?: 0 | 1
  starts_with?: string
  by_uuids?: string
  by_uuids_ordered?: string
  excluding_ids?: string
  excluding_fields?: string
  resolve_links?: 'url' | 'story' | '0' | '1'
  version?: 'draft' | 'published'
  resolve_relations?: string
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
}

export interface IStoryblokCache {
  type?: 'memory'
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