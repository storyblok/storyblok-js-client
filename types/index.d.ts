import { ISbStoriesParams, ISbStoryParams, ISbConfig, ISbResult, ISbStoryData, ISbContentMangmntAPI } from './interfaces';
declare type ComponentResolverFn = {
    (...args: any): any;
};
declare type CachedVersions = {
    [key: string]: number;
};
declare type LinksType = {
    [key: string]: any;
};
declare type RelationsType = {
    [key: string]: any;
};
interface ISbResponseData {
    link_uuids: string[];
    links: string[];
    rel_uuids: string[];
    rels: any;
    story: ISbStoryData;
    stories: Array<ISbStoryData>;
}
declare class Storyblok {
    private client;
    private maxRetries?;
    private throttle;
    private accessToken;
    private cache;
    private helpers;
    relations: RelationsType;
    links: LinksType;
    richTextResolver: any;
    resolveNestedRelations: boolean;
    /**
     *
     * @param config ISbConfig interface
     * @param endpoint string, optional
     */
    constructor(config: ISbConfig, endpoint?: string);
    setComponentResolver(resolver: ComponentResolverFn): void;
    private parseParams;
    private factoryParamOptions;
    private makeRequest;
    get(slug: string, params?: ISbStoriesParams): Promise<ISbResult>;
    getAll(slug: string, params: ISbStoriesParams, entity?: string): Promise<ISbResult>;
    post(slug: string, params: ISbStoriesParams | ISbContentMangmntAPI): Promise<ISbResponseData>;
    put(slug: string, params: ISbStoriesParams | ISbContentMangmntAPI): Promise<ISbResponseData>;
    delete(slug: string, params: ISbStoriesParams | ISbContentMangmntAPI): Promise<ISbResponseData>;
	  getStories(params: ISbStoriesParams): Promise<ISbResult>
	  getStory(slug: string, params: ISbStoryParams): Promise<ISbResult>
    private getToken;
    ejectInterceptor(): void;
    private _cleanCopy;
    private _insertLinks;
    private _insertRelations;
    private iterateTree;
    private resolveLinks;
    private resolveRelations;
    private resolveStories;
    private cacheResponse;
    private throttledRequest;
    cacheVersions(): CachedVersions;
    cacheVersion(): number;
    setCacheVersion(cv: number): void;
    private cacheProvider;
    private flushCache;
}
export default Storyblok;
export * from './enum';
export * from './interfaces';
export { default as RichtextInstance } from './richTextResolver';
export { default as SbFetch } from './sbFetch';
export * from './sbHelpers';
export * from './schema';
export { default as throttledQueue } from './throttlePromise';
