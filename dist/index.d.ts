declare global {
  interface StoryblokBridgeConfig {
    initOnlyOnce?: boolean
    accessToken?: string
  }
  interface StoryblokEventPayload {
    action: 'customEvent' | 'published' | 'input' | 'change' | 'unpublished' | 'enterEditmode'
    event?: string
    story?: any
    storyId?: string
    reload?: boolean
  }
  interface StoryblokBridge {
    init: (config?: StoryblokBridgeConfig) => void
    pingEditor: () => void
    isInEditor: () => void
    enterEditmode: () => void
    on: (
      event: 'customEvent' | 'published' | 'input' | 'change' | 'unpublished' | 'enterEditmode' | string[],
      callback: (payload?: StoryblokEventPayload) => void,
    ) => void
  }
  interface Window {
    storyblok: StoryblokBridge
    StoryblokCacheVersion: number
  }
}

import { AxiosInstance } from 'axios'

interface StoryblokConfig {
  accessToken?: string
  oauthToken?: string
  cache?: StoryblokCache
  timeout?: number
  headers?: any
  region?: string
}

interface StoryblokCache {
  type?: 'memory'
  clear?: 'auto' | 'manual'
}

export interface StoryblokResult {
  data: any
  perPage: number
  total: number
  headers: any
}

export interface StoryblokManagmentApiResult {
  data: any
  headers: any
}

export interface StoryData {
  alternates: string[]
  content: {
    component: string
    _uid: string
    [index: string]: any
  }
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
  slug: string
  sort_by_date: string | null
  tag_list: string[]
  uuid: string
}

export interface Stories {
  data: {
    stories: StoryData[]
  }
  perPage: number
  total: number
  headers: any
}

export interface Story {
  data: {
    story: StoryData
  }
  headers: any
}

interface StoriesParams {
  token?: string
  with_tag?: string
  is_startpage?: 0 | 1
  starts_with?: string
  by_uuids?: string
  excluding_ids?: string
  excluding_fields?: string
  resolve_links?: 0 | 1
  version?: 'draft' | 'published'
  resolve_relations?: string
  cv?: number
  sort_by?: string
  search_term?: string
  filter_query?: any
  per_page?: number
  page?: string
}

interface StoryParams {
  token?: string
  find_by?: 'uuid'
  version?: 'draft' | 'published'
  resolve_links?: 0 | 1
  resolve_relations?: string
  cv?: number
}

declare class Storyblok {
  throttle: any
  cacheVersion: number
  accessToken: string
  cache: StoryblokCache
  client: AxiosInstance
  constructor(config: StoryblokConfig, endpoint?: string)
  get(slug: string, params?: any): Promise<StoryblokResult>
  post(slug: string, params?: any): Promise<StoryblokManagmentApiResult>
  put(slug: string, params?: any): Promise<StoryblokManagmentApiResult>
  delete(slug: string, params?: any): Promise<StoryblokManagmentApiResult>
  getStories(params?: StoriesParams): Promise<Stories>
  getStory(slug: string, params?: StoryParams): Promise<Story>
  setToken(token: string): void
  getToken(): string
  cacheResponse(url: string, params: any): Promise<StoryblokResult>
  newVersion(): number
  cacheProvider(): {
    get(key: string): any
    set(key: string, content: string): void
    flush(): void
  }
  flushCache(): this
}

export default Storyblok
