interface IResponse {
    status: number;
    statusText: string;
}
declare class SbFetch {
    baseURL: string;
    timeout: number;
    headers: HeadersInit;
    responseInterceptor?: Function;
    ejectInterceptor: boolean;
    url: string;
    parameters: object;
    private constructor();
    get(url: string, param: object): Promise<Error | IResponse>;
    post(url: string, param: object): Promise<Error | IResponse>;
    put(url: string, param: object): Promise<Error | IResponse>;
    delete(url: string, param: object): Promise<Error | IResponse>;
    private _responseHandler;
    private _methodHandler;
    eject(): void;
    private _statusHandler;
}
export default SbFetch;
