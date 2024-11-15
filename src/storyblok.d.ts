import type {
  CachedVersions,
  ComponentResolverFn,
  ISbContentMangmntAPI,
  ISbCustomFetch,
  ISbResponseData,
  ISbResult,
  ISbStories,
  ISbStoriesParams,
  ISbStory,
  ISbStoryParams,
  LinksType,
  RelationsType,
  RichTextResolver,
} from './interfaces';

export interface IStoryblok {
  relations: RelationsType;
  links: LinksType;
  richTextResolver: RichTextResolver;
  resolveNestedRelations: boolean;

  // Sets the component resolver for rich text
  setComponentResolver: (resolver: ComponentResolverFn) => void;

  // Fetches a single story by slug
  get: (slug: string, params?: ISbStoriesParams, fetchOptions?: ISbCustomFetch) => Promise<ISbResult>;

  // Fetches all stories matching the given parameters
  getAll: (slug: string, params: ISbStoriesParams, entity?: string, fetchOptions?: ISbCustomFetch) => Promise<any[]>;

  // Creates a new story
  post: (slug: string, params: ISbStoriesParams | ISbContentMangmntAPI, fetchOptions?: ISbCustomFetch) => Promise<ISbResponseData>;

  // Updates an existing story
  put: (slug: string, params: ISbStoriesParams | ISbContentMangmntAPI, fetchOptions?: ISbCustomFetch) => Promise<ISbResponseData>;

  // Deletes a story
  delete: (slug: string, params: ISbStoriesParams | ISbContentMangmntAPI, fetchOptions?: ISbCustomFetch) => Promise<ISbResponseData>;

  // Fetches multiple stories
  getStories: (params: ISbStoriesParams, fetchOptions?: ISbCustomFetch) => Promise<ISbStories>;

  // Fetches a single story by slug
  getStory: (slug: string, params: ISbStoryParams, fetchOptions?: ISbCustomFetch) => Promise<ISbStory>;

  // Wrapper for GraphQL queries
  graphql: (query: string, version: 'draft' | 'published', variables?: Record<string, unknown>) => Promise<{ data: object }>;

  // Ejects the interceptor from the fetch client
  ejectInterceptor: () => void;

  // Flushes all caches
  flushCache: () => Promise<this>;

  // Returns all cached versions (cv)
  cacheVersions: () => CachedVersions;

  // Returns the current cache version (cv)
  cacheVersion: () => number;

  // Sets the cache version (cv)
  setCacheVersion: (cv: number) => void;

  // Clears the cache version
  clearCacheVersion: () => void;
}
