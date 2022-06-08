import { IStoriesParams, IStoryblokConfig, IStoryblokResult, IContentMangmntAPI } from './interfaces';
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
     * @param config IStoryblok interface
     * @param endpoint string, optional
     */
    constructor(config: IStoryblokConfig, endpoint?: string);
    setComponentResolver(resolver: ComponentResolverFn): void;
    private parseParams;
    private factoryParamOptions;
    private makeRequest;
    get(slug: string, params?: IStoriesParams): Promise<IStoryblokResult>;
    getAll(slug: string, params: IStoriesParams, entity?: string): Promise<any>;
    post(slug: string, params: IStoriesParams | IContentMangmntAPI): any;
    put(slug: string, params: IStoriesParams | IContentMangmntAPI): any;
    delete(slug: string, params: IStoriesParams | IContentMangmntAPI): any;
    getStories(params: IStoriesParams): Promise<IStoryblokResult>;
    getStory(slug: string, params: IStoriesParams): Promise<IStoryblokResult>;
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
