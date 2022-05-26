interface IResponse {
    status: number;
    statusText: string;
}
interface IParam {
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
    timeout: number;
    headers: HeadersInit;
    responseInterceptor?: Function;
    ejectInterceptor: boolean;
    url: string;
    parameters: IParam;
    private constructor();
    get(url: string, param: IParam): Promise<Error | IResponse>;
    post(url: string, param: IParam): Promise<Error | IResponse>;
    put(url: string, param: IParam): Promise<Error | IResponse>;
    delete(url: string, param: IParam): Promise<Error | IResponse>;
    private _responseHandler;
    private _methodHandler;
    eject(): void;
    private _statusHandler;
}
export default SbFetch;
