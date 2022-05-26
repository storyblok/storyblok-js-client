interface IResponse {
    status: number;
    statusText: string;
}
interface IParams {
    version: string;
    filter_query?: object;
    resolve_assets?: number;
    resolve_links?: string;
    resolve_relations?: string;
    token: string;
    cv?: number;
    page?: number;
    per_page?: number;
    sort_by?: string;
}
declare class SbFetch {
    baseURL: string;
    timeout?: number;
    headers: HeadersInit;
    responseInterceptor?: Function;
    ejectInterceptor?: boolean;
    url: string;
    parameters: IParams;
    private constructor();
    get(url: string, params: IParams): Promise<Error | IResponse>;
    post(url: string, params: IParams): Promise<Error | IResponse>;
    put(url: string, params: IParams): Promise<Error | IResponse>;
    delete(url: string, params: IParams): Promise<Error | IResponse>;
    private _responseHandler;
    private _methodHandler;
    eject(): void;
    private _statusHandler;
}
export default SbFetch;
