"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("helpers");
const isomorphic_fetch_1 = __importDefault(require("isomorphic-fetch"));
var Method;
(function (Method) {
    Method["GET"] = "get";
    Method["DELETE"] = "delete";
    Method["POST"] = "post";
    Method["PUT"] = "put";
})(Method || (Method = {}));
class SbFetch {
    constructor($c) {
        this.baseURL = $c.baseURL,
            this.timeout = $c.timeout ? $c.timeout * 1000 : 1000,
            this.headers = $c.headers || [],
            this.responseInterceptor = $c.responseInterceptor;
        this.ejectInterceptor = false;
        this.url = '';
        this.parameters = {};
    }
    get(url, param) {
        this.url = url;
        this.parameters = param;
        return this._methodHandler(Method.GET);
    }
    post(url, param) {
        this.url = url;
        this.parameters = param;
        return this._methodHandler(Method.POST);
    }
    put(url, param) {
        this.url = url;
        this.parameters = param;
        return this._methodHandler(Method.PUT);
    }
    delete(url, param) {
        this.url = url;
        this.parameters = param;
        return this._methodHandler(Method.DELETE);
    }
    _responseHandler(res) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = [];
            const response = {
                data: {},
                headers: {},
                status: 0,
                statusText: '',
            };
            yield res.json().then(($r) => {
                response.data = $r;
            });
            for (let pair of res.headers.entries()) {
                headers[pair[0]] = pair[1];
            }
            response.headers = Object.assign({}, headers);
            response.status = res.status;
            response.statusText = res.statusText;
            return response;
        });
    }
    _methodHandler(method) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = new URL(`${this.baseURL}${this.url}`);
            let body = null;
            if (method === 'get') {
                url.search = (0, helpers_1.stringify)(this.parameters);
            }
            else {
                body = JSON.stringify(this.parameters);
            }
            const controller = new AbortController();
            const { signal } = controller;
            const timeout = setTimeout(() => controller.abort(), this.timeout);
            try {
                const response = yield (0, isomorphic_fetch_1.default)(`${url}`, {
                    method,
                    headers: this.headers,
                    body,
                    signal,
                });
                clearTimeout(timeout);
                const res = yield this._responseHandler(response);
                if (this.responseInterceptor && !this.ejectInterceptor) {
                    return this._statusHandler(this.responseInterceptor(res));
                }
                else {
                    return this._statusHandler(res);
                }
            }
            catch ($e) {
                return $e;
            }
        });
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
