import type { ResponseFn } from './sbFetch';

export interface ISbStoriesParams
  extends Partial<ISbStoryData>,
  ISbMultipleStoriesData,
  ISbAssetsParams {
  resolve_level?: number;
  _stopResolving?: boolean;
  by_slugs?: string;
  by_uuids?: string;
  by_uuids_ordered?: string;
  component?: string;
  content_type?: string;
  cv?: number;
  datasource?: string;
  dimension?: string;
  excluding_fields?: string;
  excluding_ids?: string;
  excluding_slugs?: string;
  fallback_lang?: string;
  filename?: string;
  filter_query?: any;
  first_published_at_gt?: string;
  first_published_at_lt?: string;
  from_release?: string;
  is_startpage?: boolean;
  language?: string;
  level?: number;
  page?: number;
  per_page?: number;
  published_at_gt?: string;
  published_at_lt?: string;
  resolve_assets?: number;
  resolve_links?: 'link' | 'url' | 'story' | '0' | '1' | 'link';
  resolve_links_level?: 1 | 2;
  resolve_relations?: string | string[];
  search_term?: string;
  size?: string;
  sort_by?: string;
  starts_with?: string;
  token?: string;
  version?: 'draft' | 'published';
  with_tag?: string;
}

export interface ISbStoryParams {
  resolve_level?: number;
  token?: string;
  find_by?: 'uuid';
  version?: 'draft' | 'published';
  resolve_links?: 'link' | 'url' | 'story' | '0' | '1';
  resolve_links_level?: 1 | 2;
  resolve_relations?: string | string[];
  cv?: number;
  from_release?: string;
  language?: string;
  fallback_lang?: string;
}

interface Dimension {
  id: number;
  name: string;
  entry_value: string;
  datasource_id: number;
  created_at: string;
  updated_at: string;
}

/**
 * @interface ISbDimensions
 * @description Storyblok Dimensions Interface auxiliary interface
 * @description One use it to handle the API response
 */
export interface ISbDimensions {
  dimensions: Dimension[];
}

export interface ISbComponentType<T extends string> {
  _uid?: string;
  component?: T;
  _editable?: string;
}

export interface ISbStoryData<
  Content = ISbComponentType<string> & { [index: string]: any },
> extends ISbMultipleStoriesData {
  alternates: ISbAlternateObject[];
  breadcrumbs?: ISbLinkURLObject[];
  content: Content;
  created_at: string;
  default_full_slug?: string;
  default_root?: string;
  disble_fe_editor?: boolean;
  first_published_at?: string;
  full_slug: string;
  group_id: string;
  id: number;
  imported_at?: string;
  is_folder?: boolean;
  is_startpage?: boolean;
  lang: string;
  last_author?: {
    id: number;
    userid: string;
  };
  meta_data: any;
  name: string;
  parent?: ISbStoryData;
  parent_id: number;
  path?: string;
  pinned?: '1' | boolean;
  position: number;
  published?: boolean;
  published_at: string | null;
  release_id?: number;
  slug: string;
  sort_by_date: string | null;
  tag_list: string[];
  translated_slugs?: {
    path: string;
    name: string | null;
    lang: ISbStoryData['lang'];
  }[];
  unpublished_changes?: boolean;
  updated_at?: string;
  uuid: string;
}

export interface ISbMultipleStoriesData {
  by_ids?: string;
  by_uuids?: string;
  contain_component?: string;
  excluding_ids?: string;
  filter_query?: any;
  folder_only?: boolean;
  full_slug?: string;
  in_release?: string;
  in_trash?: boolean;
  is_published?: boolean;
  in_workflow_stages?: string;
  page?: number;
  pinned?: '1' | boolean;
  search?: string;
  sort_by?: string;
  starts_with?: string;
  story_only?: boolean;
  text_search?: string;
  with_parent?: number;
  with_slug?: string;
  with_tag?: string;
}

export interface ISbAlternateObject {
  id: number;
  name: string;
  slug: string;
  published: boolean;
  full_slug: string;
  is_folder: boolean;
  parent_id: number;
}

export interface ISbLinkURLObject {
  id: number;
  name: string;
  slug: string;
  full_slug: string;
  url: string;
  uuid: string;
}

export interface ISbStories<
  Content = ISbComponentType<string> & { [index: string]: any },
> {
  data: {
    cv: number;
    links: (ISbStoryData | ISbLinkURLObject)[];
    rels: ISbStoryData[];
    stories: ISbStoryData<Content>[];
  };
  perPage: number;
  total: number;
  headers: any;
}

export interface ISbStory<
  Content = ISbComponentType<string> & { [index: string]: any },
> {
  data: {
    cv: number;
    links: (ISbStoryData | ISbLinkURLObject)[];
    rels: ISbStoryData[];
    story: ISbStoryData<Content>;
  };
  headers: any;
}

export interface IMemoryType extends ISbResult {
  [key: string]: any;
}

export interface ICacheProvider {
  get: (key: string) => Promise<IMemoryType | void>;
  set: (key: string, content: ISbResult) => Promise<void>;
  getAll: () => Promise<IMemoryType | void>;
  flush: () => Promise<void>;
}

export interface ISbCache {
  type?: 'none' | 'memory' | 'custom';
  clear?: 'auto' | 'manual';
  custom?: ICacheProvider;
}

export interface ISbConfig {
  accessToken?: string;
  oauthToken?: string;
  resolveNestedRelations?: boolean;
  cache?: ISbCache;
  responseInterceptor?: ResponseFn;
  fetch?: typeof fetch;
  timeout?: number;
  headers?: any;
  region?: string;
  maxRetries?: number;
  https?: boolean;
  rateLimit?: number;
  componentResolver?: (component: string, data: any) => void;
  richTextSchema?: ISbSchema;
  endpoint?: string;
}

export interface ISbResult {
  data: any;
  perPage: number;
  total: number;
  headers: Headers;
}

export interface ISbResponse {
  data: any;
  status: number;
  statusText: string;
}

export interface ISbError {
  message?: string;
  status?: number;
  response?: ISbResponse;
}

export interface ISbNode extends Element {
  content: object[];
  attrs: {
    anchor?: string;
    body?: Array<ISbComponentType<any>>;
    href?: string;
    level?: number;
    linktype?: string;
    custom?: LinkCustomAttributes;
    [key: string]: any | undefined;
  };
}

export interface NodeSchema {
  (node: ISbNode): object;
}

export interface MarkSchema {
  (node: ISbNode): object;
}

export interface ISbContentMangmntAPI<
  Content = ISbComponentType<string> & { [index: string]: any },
> {
  story: {
    name: string;
    slug: string;
    content?: Content;
    default_root?: boolean;
    is_folder?: boolean;
    parent_id?: string;
    disble_fe_editor?: boolean;
    path?: string;
    is_startpage?: boolean;
    position?: number;
    first_published_at?: string;
    translated_slugs_attributes?: {
      path: string;
      name: string | null;
      lang: ISbContentMangmntAPI['lang'];
    }[];
  };
  force_update?: '1' | unknown;
  release_id?: number;
  publish?: '1' | unknown;
  lang?: string;
}

export interface ISbManagmentApiResult {
  data: any;
  headers: any;
}

export interface ISbSchema {
  nodes: any;
  marks: any;
}

export interface ISbRichtext {
  content?: ISbRichtext[];
  marks?: ISbRichtext[];
  attrs?: any;
  text?: string;
  type: string;
}

export interface LinkCustomAttributes {
  rel?: string;
  title?: string;
  [key: string]: any;
}

export interface ISbLink {
  id?: number;
  slug?: string;
  name?: string;
  is_folder?: boolean;
  parent_id?: number;
  published?: boolean;
  position?: number;
  uuid?: string;
  is_startpage?: boolean;
}

export interface ISbLinks {
  links?: {
    [key: string]: ISbLink;
  };
}

export interface ThrottleFn {
  (...args: any): any;
}

export type AsyncFn = (...args: any) => [] | Promise<ISbResult>;

export type ArrayFn = (...args: any) => void;

export interface HtmlEscapes {
  [key: string]: string;
}

export interface ISbCustomFetch extends Omit<RequestInit, 'method'> {}

export interface ISbAssetsParams {
  in_folder?: string;
  is_private?: boolean;
  by_alt?: string;
  by_copyright?: string;
  by_title?: string;
}
