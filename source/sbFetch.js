"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const isomorphic_fetch_1 = __importDefault(require("isomorphic-fetch"));
const sbHelpers_1 = require("./sbHelpers");
const enum_1 = require("./enum");
class SbFetch {
    baseURL;
    timeout;
    headers;
    responseInterceptor;
    ejectInterceptor;
    url;
    parameters;
    constructor($c) {
        this.baseURL = $c.baseURL,
            this.timeout = $c.timeout ? $c.timeout * 1000 : 1000,
            this.headers = $c.headers || [],
            this.responseInterceptor = $c.responseInterceptor;
        this.ejectInterceptor = false;
        this.url = '';
        this.parameters = {};
    }
    /**
     *
     * @param url string
     * @param params ISbStoriesParams
     * @returns Promise<ISbResponse | Error>
     */
    get(url, params) {
        this.url = url;
        this.parameters = params;
        return this._methodHandler(enum_1.Method.GET);
    }
    post(url, params) {
        this.url = url;
        this.parameters = params;
        return this._methodHandler(enum_1.Method.POST);
    }
    put(url, params) {
        this.url = url;
        this.parameters = params;
        return this._methodHandler(enum_1.Method.PUT);
    }
    delete(url, params) {
        this.url = url;
        this.parameters = params;
        return this._methodHandler(enum_1.Method.DELETE);
    }
    async _responseHandler(res) {
        const headers = [];
        const response = {
            data: {},
            headers: {},
            status: 0,
            statusText: '',
        };
        await res.json().then(($r) => {
            response.data = $r;
        });
        for (const pair of res.headers.entries()) {
            headers[pair[0]] = pair[1];
        }
        response.headers = { ...headers };
        response.status = res.status;
        response.statusText = res.statusText;
        return response;
    }
    async _methodHandler(method) {
        const url = new URL(`${this.baseURL}${this.url}`);
        let body = null;
        if (method === 'get') {
            const helper = new sbHelpers_1.SbHelpers();
            url.search = helper.stringify(this.parameters);
        }
        else {
            body = JSON.stringify(this.parameters);
        }
        const controller = new AbortController();
        const { signal } = controller;
        const timeout = setTimeout(() => controller.abort(), this.timeout);
        try {
            const response = await (0, isomorphic_fetch_1.default)(`${url}`, {
                method,
                headers: this.headers,
                body,
                signal,
            });
            clearTimeout(timeout);
            const res = await this._responseHandler(response);
            if (this.responseInterceptor && !this.ejectInterceptor) {
                return this._statusHandler(this.responseInterceptor(res));
            }
            else {
                return this._statusHandler(res);
            }
        }
        catch ($e) {
            const error = $e;
            return error;
        }
    }
    eject() {
        this.ejectInterceptor = true;
    }
    _statusHandler(res) {
        const statusOk = /20[01]/g;
        if (statusOk.test(`${res.status}`)) {
            return res;
        }
        const error = {
            message: new Error(res.statusText || `status: ${res.status}`),
            response: res,
        };
        throw error;
    }
}
exports.default = SbFetch;
