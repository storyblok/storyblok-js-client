declare global {
  interface StoryblokBridgeConfig {
    initOnlyOnce?: boolean,
    accessToken: string
  }
  interface StoryblokBridge {
    init: (config: StoryblokBridgeConfig) => void
    on: (event: any, callback: () => void) => void
  }
  interface Window {
    storyblok: StoryblokBridge
  }
}

import { AxiosInstance } from 'axios'

interface StoryblokConfig {
  accessToken: string
  cache?: StoryblokCache
  timeout?: number
  headers?: any
}

interface StoryblokCache {
  type?: 'memory'
  clear?: 'auto' | 'manual'
}

export interface StoryblokResult {
  data: any
  perPage: number
  total: number
}

export interface Stories {
  data: {
    stories: {
      alternates: string[]
      content: {
        [index: string]: string
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
  }
  perPage: number
  total: number
}

export interface Story {
  data: {
    story: {
      alternates: string[]
      content: {
        [index: string]: string
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
  }
}

interface Params {
  token?: string
  with_tag?: string
  is_startpage?: 0 | 1
  starts_with?: string
  by_uuids?: string
  excluding_ids?: string
  excluding_fields?: string
  version?: 'draft' | 'published'
  cv?: number
  sort_by?: string
  search_term?: string
  filter_query?: any
  per_page?: number
  page?: string
}

declare class Storyblok {
  throttle: any
  cacheVersion: number
  accessToken: string
  cache: StoryblokCache
  client: AxiosInstance
  constructor(config: StoryblokConfig, endpoint?: string)
  get(slug: string, params?: Params): Promise<StoryblokResult>
  getStories(slug: string, params?: Params): Promise<Stories>
  getStory(slug: string, params?: Params): Promise<Story>
  setToken(token: string): void
  getToken(): string
  cacheResponse(url: string, params: Params): Promise<StoryblokResult>
  newVersion(): number
  cacheProvider(): {
    get(key: string): any
    set(key: string, content: string): void
    flush(): void
  }
  flushCache(): this
}

export default Storyblok
