"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isFinite(value) {
    if (value !== value || value === Infinity || value === -Infinity) {
        return false;
    }
    return true;
}
function throttledQueue(fn, limit, interval) {
    if (!isFinite(limit)) {
        throw new TypeError('Expected `limit` to be a finite number');
    }
    if (!isFinite(interval)) {
        throw new TypeError('Expected `interval` to be a finite number');
    }
    const queue = [];
    let timeouts = [];
    let activeCount = 0;
    const next = function () {
        activeCount++;
        const id = setTimeout(function () {
            activeCount--;
            if (queue.length > 0) {
                next();
            }
            timeouts = timeouts.filter(function (currentId) {
                return currentId !== id;
            });
        }, interval);
        if (timeouts.indexOf(id) < 0) {
            timeouts.push(id);
        }
        const x = queue.shift();
        x.resolve(fn.apply(x.self, x.args));
    };
    const throttled = function (...args) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        return new Promise(function (resolve, reject) {
            queue.push({
                resolve: resolve,
                reject: reject,
                args: args,
                self,
            });
            if (activeCount < limit) {
                next();
            }
        });
    };
    throttled.abort = function () {
        timeouts.forEach(clearTimeout);
        timeouts = [];
        queue.forEach(function (x) {
            x.reject(function () {
                Error.call(this, 'Throttled function aborted');
                this.name = 'AbortError';
            });
        });
        queue.length = 0;
    };
    return throttled;
}
exports.default = throttledQueue;
