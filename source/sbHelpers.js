"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SbHelpers = void 0;
class SbHelpers {
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
