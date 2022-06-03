import { Method } from './enum';
import { IStoriesParams, IStoryblokConfig, IStoryblokResult, IStoryData } from './interfaces';
declare type ComponentResolverFn = {
    (...args: any): any;
};
declare type CachedVersions = {
    [key: string]: number;
};
declare type LinksType = {
    [key: string]: any;
};
declare type MemoryType = {
    [key: string]: any;
};
interface ResponseData {
    link_uuids: string[];
    links: string[];
    rel_uuids: string[];
    rels: any;
    story: IStoryData;
    stories: Array<IStoryData>;
}
declare class Storyblok {
    private client;
    private maxRetries?;
    private throttle;
    richTextResolver: any;
    private accessToken;
    private relations;
    private links;
    private cache;
    private helpers;
    private resolveNestedRelations;
    /**
     *
     * @param config IStoryblok interface
     * @param endpoint string, optional
     */
    constructor(config: IStoryblokConfig, endpoint?: string);
    setComponentResolver(resolver: ComponentResolverFn): void;
    parseParams(params: IStoriesParams): IStoriesParams;
    factoryParamOptions(url: string, params: IStoriesParams): IStoriesParams;
    makeRequest(url: string, params: IStoriesParams, per_page: number, page: number): Promise<IStoryblokResult>;
    get(slug: string, params?: IStoriesParams): Promise<IStoryblokResult>;
    getAll(slug: string, params: IStoriesParams, entity?: string): Promise<any>;
    post(slug: string, params: IStoriesParams): any;
    put(slug: string, params: IStoriesParams): any;
    delete(slug: string, params: IStoriesParams): any;
    getStories(params: IStoriesParams): Promise<IStoryblokResult>;
    getStory(slug: string, params: IStoriesParams): Promise<IStoryblokResult>;
    setToken(token: string): void;
    getToken(): string;
    ejectInterceptor(): void;
    _cleanCopy(value: LinksType): JSON;
    _insertLinks(jtree: IStoriesParams, treeItem: keyof IStoriesParams): void;
    _insertRelations(jtree: IStoriesParams, treeItem: keyof IStoriesParams, fields: string | Array<string>): void;
    iterateTree(story: IStoryData, fields: string | Array<string>): void;
    resolveLinks(responseData: ResponseData, params: IStoriesParams): Promise<void>;
    resolveRelations(responseData: ResponseData, params: IStoriesParams): Promise<void>;
    resolveStories(responseData: ResponseData, params: IStoriesParams): Promise<void>;
    cacheResponse(url: string, params: IStoriesParams, retries?: number): Promise<IStoryblokResult>;
    throttledRequest(type: Method, url: string, params: IStoriesParams): Promise<import("./interfaces").IResponse | Error>;
    cacheVersions(): CachedVersions;
    cacheVersion(): number;
    setCacheVersion(cv: number): void;
    cacheProvider(): {
        get(key: string): any;
        getAll(): MemoryType;
        set(key: string, content: IStoryblokResult): void;
        flush(): void;
    };
    flushCache(): this;
}
export default Storyblok;
