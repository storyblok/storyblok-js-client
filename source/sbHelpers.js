"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SbHelpers = void 0;
class SbHelpers {
    isCDNUrl = (url = '') => url.indexOf('/cdn/') > -1;
    getOptionsPage = (options = {}, perPage = 25, page = 1) => {
        return {
            ...options,
            per_page: perPage,
            page,
        };
    };
    delay = (ms) => new Promise((res) => setTimeout(res, ms));
    arrayFrom = (length = 0, func) => [...Array(length)].map(func);
    range = (start = 0, end = start) => {
        const length = Math.abs(end - start) || 0;
        const step = start < end ? 1 : -1;
        return this.arrayFrom(length, (_, i) => i * step + start);
    };
    asyncMap = async (arr, func) => Promise.all(arr.map(func));
    flatMap = (arr = [], func) => arr.map(func).reduce((xs, ys) => [...xs, ...ys], []);
    /**
        * @method stringify
        * @param  {Object} params
        * @param  {String} prefix
        * @param  {Boolean} isArray
        * @return {String} Stringified object
        */
    stringify(params, prefix, isArray) {
        const pairs = [];
        for (const key in params) {
            if (!Object.prototype.hasOwnProperty.call(params, key)) {
                continue;
            }
            const value = params[key];
            const enkey = isArray ? '' : encodeURIComponent(key);
            let pair;
            if (typeof value === 'object') {
                pair = this.stringify(value, prefix ? prefix + encodeURIComponent('[' + enkey + ']') : enkey, Array.isArray(value));
            }
            else {
                pair =
                    (prefix ? prefix + encodeURIComponent('[' + enkey + ']') : enkey) +
                        '=' +
                        encodeURIComponent(value);
            }
            pairs.push(pair);
        }
        return pairs.join('&');
    }
}
exports.SbHelpers = SbHelpers;
