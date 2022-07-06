import { ISbStoriesParams, ISbConfig, ISbResult, ISbContentMangmntAPI } from './interfaces';
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
    getAll(slug: string, params: ISbStoriesParams, entity?: string): Promise<any>;
    post(slug: string, params: ISbStoriesParams | ISbContentMangmntAPI): any;
    put(slug: string, params: ISbStoriesParams | ISbContentMangmntAPI): any;
    delete(slug: string, params: ISbStoriesParams | ISbContentMangmntAPI): any;
    getStories(params: ISbStoriesParams): Promise<ISbResult>;
    getStory(slug: string, params: ISbStoriesParams): Promise<ISbResult>;
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
    flushCache(): this;
}
export default Storyblok;
