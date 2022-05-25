"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SbHelpers = void 0;
class SbHelpers {
    /**
        * @method stringify
        * @param  {Object} obj
        * @param  {String} prefix
        * @param  {Boolean} isArray
        * @return {String} Stringified object
        */
    stringify(obj, prefix, isArray) {
        const pairs = [];
        for (const key in obj) {
            if (!Object.prototype.hasOwnProperty.call(obj, key)) {
                continue;
            }
            const value = obj[key];
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
