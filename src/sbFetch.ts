import { SbHelpers } from './sbHelpers';

import type {
  ISbCustomFetch,
  ISbError,
  ISbResponse,
  ISbStoriesParams,
} from './interfaces';
import type Method from './constants';

export interface ResponseFn {
  (arg?: ISbResponse | any): any;
}

export interface ISbFetch {
  baseURL: string;
  timeout?: number;
  headers: Headers;
  responseInterceptor?: ResponseFn;
  fetch?: typeof fetch;
}

class SbFetch {
  private baseURL: string;
  private timeout?: number;
  private headers: Headers;
  private responseInterceptor?: ResponseFn;
  private fetch: typeof fetch;
  private ejectInterceptor?: boolean;
  private url: string;
  private parameters: ISbStoriesParams;
  private fetchOptions: ISbCustomFetch;

  public constructor($c: ISbFetch) {
    this.baseURL = $c.baseURL;
    this.headers = $c.headers || new Headers();
    this.timeout = $c?.timeout ? $c.timeout * 1000 : 0;
    this.responseInterceptor = $c.responseInterceptor;
    this.fetch = (...args: [any]) =>
      $c.fetch ? $c.fetch(...args) : fetch(...args);
    this.ejectInterceptor = false;
    this.url = '';
    this.parameters = {} as ISbStoriesParams;
    this.fetchOptions = {};
  }

  /**
   *
   * @param url string
   * @param params ISbStoriesParams
   * @returns Promise<ISbResponse | Error>
   */
  public get(url: string, params: ISbStoriesParams) {
    this.url = url;
    this.parameters = params;
    return this._methodHandler('get');
  }

  public post(url: string, params: ISbStoriesParams) {
    this.url = url;
    this.parameters = params;
    return this._methodHandler('post');
  }

  public put(url: string, params: ISbStoriesParams) {
    this.url = url;
    this.parameters = params;
    return this._methodHandler('put');
  }

  public delete(url: string, params?: ISbStoriesParams) {
    this.url = url;
    this.parameters = params ?? {} as ISbStoriesParams;
    return this._methodHandler('delete');
  }

  private async _responseHandler(res: Response) {
    const headers: string[] = [];
    const response = {
      data: {},
      headers: {},
      status: 0,
      statusText: '',
    };

    if (res.status !== 204) {
      await res.json().then(($r) => {
        response.data = $r;
      });
    }

    for (const pair of res.headers.entries()) {
      headers[pair[0] as any] = pair[1];
    }

    response.headers = { ...headers };
    response.status = res.status;
    response.statusText = res.statusText;

    return response;
  }

  private async _methodHandler(
    method: Method,
  ): Promise<ISbResponse | ISbError> {
    let urlString = `${this.baseURL}${this.url}`;

    let body = null;

    if (method === 'get') {
      const helper = new SbHelpers();
      urlString = `${this.baseURL}${this.url}?${helper.stringify(
        this.parameters,
      )}`;
    }
    else {
      body = JSON.stringify(this.parameters);
    }

    const url = new URL(urlString);

    const controller = new AbortController();
    const { signal } = controller;

    let timeout;

    if (this.timeout) {
      timeout = setTimeout(() => controller.abort(), this.timeout);
    }

    try {
      const fetchResponse = await this.fetch(`${url}`, {
        method,
        headers: this.headers,
        body,
        signal,
        ...this.fetchOptions,
      });

      if (this.timeout) {
        clearTimeout(timeout);
      }

      const response = (await this._responseHandler(
        fetchResponse,
      )) as ISbResponse;

      if (this.responseInterceptor && !this.ejectInterceptor) {
        return this._statusHandler(this.responseInterceptor(response));
      }
      else {
        return this._statusHandler(response);
      }
    }
    catch (err: any) {
      const error: ISbError = {
        message: err,
      };
      return error;
    }
  }

  public setFetchOptions(fetchOptions: ISbCustomFetch = {}) {
    if (Object.keys(fetchOptions).length > 0 && 'method' in fetchOptions) {
      delete fetchOptions.method;
    }
    this.fetchOptions = { ...fetchOptions };
  }

  public eject() {
    this.ejectInterceptor = true;
  }

  private _statusHandler(res: ISbResponse): Promise<ISbResponse | ISbError> {
    const statusOk = /20[0-6]/g;

    return new Promise((resolve, reject) => {
      if (statusOk.test(`${res.status}`)) {
        return resolve(res);
      }

      const error: ISbError = {
        message: res.statusText,
        status: res.status,
        response: Array.isArray(res.data)
          ? res.data[0]
          : res.data.error || res.data.slug,
      };

      reject(error);
    });
  }
}

export default SbFetch;
