import { stringify } from './utils';

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
      urlString = `${this.baseURL}${this.url}?${stringify(this.parameters)}`;
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

  /**
   * Normalizes error messages from different response structures
   * @param data The response data that might contain error information
   * @returns A normalized error message string
   */
  private _normalizeErrorMessage(data: any): string {
    // Handle array of error messages
    if (Array.isArray(data)) {
      return data[0] || 'Unknown error';
    }

    // Handle object with error property
    if (data && typeof data === 'object') {
      // Check for common error message patterns
      if (data.error) {
        return data.error;
      }

      // Handle nested error objects (like { name: ['has already been taken'] })
      for (const key in data) {
        if (Array.isArray(data[key])) {
          return `${key}: ${data[key][0]}`;
        }
        if (typeof data[key] === 'string') {
          return `${key}: ${data[key]}`;
        }
      }

      // If we have a slug, it might be an error message
      if (data.slug) {
        return data.slug;
      }
    }

    // Fallback for unknown error structures
    return 'Unknown error';
  }

  private _statusHandler(res: ISbResponse): Promise<ISbResponse | ISbError> {
    const statusOk = /20[0-6]/g;

    return new Promise((resolve, reject) => {
      if (statusOk.test(`${res.status}`)) {
        return resolve(res);
      }

      const error: ISbError = {
        message: this._normalizeErrorMessage(res.data),
        status: res.status,
        response: res,
      };

      reject(error);
    });
  }
}

export default SbFetch;
