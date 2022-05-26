interface ResponseFn extends IResponse {
    (arg?: any): any;
}
interface ISbFetch {
    baseURL: string;
    timeout?: number;
    headers: HeadersInit;
    responseInterceptor?: ResponseFn;
}
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
    private baseURL;
    private timeout?;
    private headers;
    private responseInterceptor?;
    private ejectInterceptor?;
    private url;
    private parameters;
    constructor($c: ISbFetch);
    get(url: string, params: IParams): Promise<IResponse | Error>;
    post(url: string, params: IParams): Promise<IResponse | Error>;
    put(url: string, params: IParams): Promise<IResponse | Error>;
    delete(url: string, params: IParams): Promise<IResponse | Error>;
    private _responseHandler;
    private _methodHandler;
    eject(): void;
    private _statusHandler;
}
export default SbFetch;
