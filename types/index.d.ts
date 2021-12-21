declare global {
  interface StoryblokBridgeConfig {
    initOnlyOnce?: boolean
    accessToken?: string
  }
  interface StoryblokEventPayload<S extends StoryblokComponent<string> = any> {
    action: 'customEvent' | 'published' | 'input' | 'change' | 'unpublished' | 'enterEditmode'
    event?: string
    story?: S
    slug?: string
    slugChanged?: boolean
    storyId?: string
    reload?: boolean
  }
  interface StoryblokBridge {
    init: (config?: StoryblokBridgeConfig) => void
    pingEditor: (callback: (instance: StoryblokBridge) => void) => void
    isInEditor: () => boolean
    enterEditmode: () => void
    on: (
      event: 'customEvent' | 'published' | 'input' | 'change' | 'unpublished' | 'enterEditmode' | string[],
      callback: (payload?: StoryblokEventPayload) => void
    ) => void
    addComments: (tree: StoryblokComponent<string>, storyId: string) => StoryblokComponent<string>
    resolveRelations: (story: any, resolve: string[], callback: (storyContent: any) => void) => void
  }
  interface Window {
    storyblok: StoryblokBridge
    StoryblokCacheVersion: number
  }
}

import { AxiosInstance, AxiosProxyConfig } from 'axios'

interface RichTextSchema {
  nodes: {}
  marks: {}
}

export interface StoryblokConfig {
  accessToken?: string
  oauthToken?: string
  cache?: StoryblokCache
  responseInterceptor?: (response: any) => any
  timeout?: number
  headers?: any
  region?: string
  maxRetries?: number
  https?: boolean
  rateLimit?: number
  proxy?: AxiosProxyConfig
  componentResolver?: (component: string, data: any) => void
  richTextSchema?: RichTextSchema
}

export interface StoryblokCache {
  type?: 'memory'
  clear?: 'auto' | 'manual'
}

export interface StoryblokCacheProvider {
  get: (key: string) => Promise<StoryblokResult | null> | (StoryblokResult | null)
  set: (key: string, content: StoryblokResult) => Promise<void> | any
  flush: () => Promise<void> | void
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

export interface StoryblokComponent<TComp extends string> {
  _uid: string
  component: TComp
  _editable?: string
}

export interface StoryData<Content = StoryblokComponent<string> & { [index: string]: any }> {
  alternates: AlternateObject[]
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
  translated_slugs?: {path: string, name: string|null, lang: StoryData['lang']}[]
  sort_by_date: string | null
  tag_list: string[]
  uuid: string
}

export interface AlternateObject {
  id: number;
  name: string;
  slug: string;
  published: boolean;
  full_slug: string;
  is_folder: boolean;
  parent_id: number;
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

export interface StoriesParams {
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
  page?: string
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

export interface StoryParams {
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

export interface Richtext {
  content: Array<Object>
}

export interface RichtextInstance {
  render: (data: Richtext) => string
}

/**
 * @see https://www.storyblok.com/docs/api/content-delivery#core-resources/spaces/the-space-object
 */
 export interface Space {
  id: number;
  name: string;
  domain: string;
  version: number;
  language_codes: string[];
}

export interface Dimension {
  id: number;
  entry_value: string;
  name: string;
}

/**
 * @see https://www.storyblok.com/docs/api/content-delivery#core-resources/datasources/the-datasource-object
 * @see https://www.storyblok.com/docs/api/management#core-resources/datasources/the-datasource-object
 */
export interface Datasource {
  id: number;
  name: string;
  slug: string;
  dimensions: Dimension[];
}

/**
 * @see https://www.storyblok.com/docs/api/content-delivery#core-resources/datasource-entries/the-datasource-entry-object
 * @see https://www.storyblok.com/docs/api/management#core-resources/datasource-entries/the-datasource-entry-object
 */
export interface DatasourceEntry {
  id: number;
  name: string;
  value: string;
  dimension_value?: string | null;
  datasource_id?: number | null;
}

/**
 * @see https://www.storyblok.com/docs/api/content-delivery#core-resources/links/the-link-object
 */
export interface Link {
  id: number;
  slug: string;
  name: string;
  is_folder: boolean;
  parent_id: number;
  published: boolean;
  position: number;
  uuid: string;
  is_startpage: boolean;
}

/**
 * @see https://www.storyblok.com/docs/api/content-delivery#core-resources/tags/the-tag-object
 */
export interface Tag {
  name: string;
  taggings_count: number;
}

/**
 * @see https://www.storyblok.com/docs/api/management#core-resources/components/possible-field-types
 */
export enum ComponentFieldType {
  bloks = 'bloks',
  text = 'text',
  textarea = 'textarea',
  markdown = 'markdown',
  number = 'number',
  datetime = 'datetime',
  boolean = 'boolean',
  options = 'options',
  option = 'option',
  image = 'image',
  file = 'file',
  multiasset = 'multiasset',
  multilink = 'multilink',
  section = 'section',
  custom = 'custom',
}

/**
 * @see https://www.storyblok.com/docs/api/management#core-resources/components/the-component-field-object
 */
export interface ComponentField {
  id: number;
  type: ComponentFieldType;
  pos: number;
  translatable: boolean;
  required: boolean;
  regex: string;
  description: string;
  default_value: string;
  can_sync: boolean;
  rtl: boolean;
  no_translate: boolean;
}

/**
 * @see https://www.storyblok.com/docs/api/management#core-resources/components/the-component-object
 */
export interface Component {
  id: number;
  name: string;
  display_name: string;
  created_at: string;
  is_root: boolean;
  is_nestable: boolean;
  real_name: string;
  component_group_uuid: string;
  schema: Record<string, ComponentField>;
}

/**
 * @see https://www.storyblok.com/docs/api/management#core-resources/component-groups/the-component-group-object
 */
export interface ComponentGroup {
  id: number;
  name: string;
  uuid: string;
}

/**
 * @see https://www.storyblok.com/docs/api/management#core-resources/assets/the-asset-object
 */
export interface Asset {
  id: number;
  filename: string;
  space_id: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  file: {
    url?: string | null;
  };
  asset_folder_id?: string | null;
  short_filename: string;
  content_type: string;
  content_length: number;
}

/**
 * @see https://www.storyblok.com/docs/api/management#core-resources/asset-folders/the-asset-folder-object
 */
export interface AssetFolder {
  id: number;
  name: string;
  parent_id?: number | null;
}

declare class Storyblok {
  throttle: any
  accessToken: string
  cache: StoryblokCache
  client: AxiosInstance
  richTextResolver: RichtextInstance
  constructor(config: StoryblokConfig, endpoint?: string)
  get(slug: string, params?: any): Promise<StoryblokResult>
  getAll(slug: string, params?: any, entity?: string): Promise<any[]>
  post(slug: string, params?: any): Promise<StoryblokManagmentApiResult>
  put(slug: string, params?: any): Promise<StoryblokManagmentApiResult>
  delete(slug: string, params?: any): Promise<StoryblokManagmentApiResult>
  getStories(params?: StoriesParams): Promise<Stories>
  getStory(slug: string, params?: StoryParams): Promise<Story>
  setToken(token: string): void
  getToken(): string
  setCacheVersion(cv: string): void
  cacheResponse(url: string, params: any): Promise<StoryblokResult>
  cacheVersions(): {[key: string]: string}
  cacheVersion(): string
  cacheProvider(): StoryblokCacheProvider
  flushCache(): Promise<this>
  setComponentResolver(renderFunction: (component: string, data: any) => void): void
}

export default Storyblok
