import { IStoriesParams, IStoryblokResult, AsyncFn } from './interfaces';
interface IParams extends IStoriesParams {
    [key: string]: any;
}
declare type ArrayFn = (...args: any) => void;
declare type FlatMapFn = (...args: any) => [] | any;
declare type RangeFn = (...args: any) => [];
export declare class SbHelpers {
    isCDNUrl: (url?: string) => boolean;
    getOptionsPage: (options?: IStoriesParams, perPage?: number, page?: number) => {
        per_page: number;
        page: number;
        token?: string | undefined;
        with_tag?: string | undefined;
        is_startpage?: 0 | 1 | undefined;
        starts_with?: string | undefined;
        by_uuids?: string | undefined;
        by_uuids_ordered?: string | undefined;
        excluding_ids?: string | undefined;
        excluding_fields?: string | undefined;
        version?: "draft" | "published" | undefined;
        resolve_links?: "url" | "story" | "0" | "1" | undefined;
        resolve_relations?: string | undefined;
        resolve_assets?: number | undefined;
        cv?: number | undefined;
        sort_by?: string | undefined;
        search_term?: string | undefined;
        filter_query?: any;
        from_release?: string | undefined;
        language?: string | undefined;
        fallback_lang?: string | undefined;
        first_published_at_gt?: string | undefined;
        first_published_at_lt?: string | undefined;
        level?: number | undefined;
        published_at_gt?: string | undefined;
        published_at_lt?: string | undefined;
        by_slugs?: string | undefined;
        excluding_slugs?: string | undefined;
        _stopResolving?: boolean | undefined;
        component?: string | undefined;
    };
    delay: (ms: number) => Promise<unknown>;
    arrayFrom: (length: number | undefined, func: ArrayFn) => void[];
    range: (start?: number, end?: number) => Array<any>;
    asyncMap: (arr: RangeFn[], func: AsyncFn) => Promise<(IStoryblokResult | [])[]>;
    flatMap: (arr: IStoryblokResult[] | undefined, func: FlatMapFn) => any;
    /**
        * @method stringify
        * @param  {Object} params
        * @param  {String} prefix
        * @param  {Boolean} isArray
        * @return {String} Stringified object
        */
    stringify(params: IParams, prefix?: string, isArray?: boolean): string;
}
export {};
