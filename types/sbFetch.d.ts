import { IResponse, IStoriesParams } from './interfaces';
declare type ResponseFn = {
    (arg?: IResponse | any): any;
};
interface ISbFetch {
    baseURL: string;
    timeout?: number;
    headers: Headers;
    responseInterceptor?: ResponseFn;
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
    /**
     *
     * @param url string
     * @param params IStoriesParams
     * @returns Promise<IResponse | Error>
     */
    get(url: string, params: IStoriesParams): Promise<IResponse | Error>;
    post(url: string, params: IStoriesParams): Promise<IResponse | Error>;
    put(url: string, params: IStoriesParams): Promise<IResponse | Error>;
    delete(url: string, params: IStoriesParams): Promise<IResponse | Error>;
    private _responseHandler;
    private _methodHandler;
    eject(): void;
    private _statusHandler;
}
export default SbFetch;
