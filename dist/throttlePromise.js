"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));

function isFinite(value) {
  if (typeof value !== 'number') {
    return false;
  }

  if (value !== value || value === Infinity || value === -Infinity) {
    return false;
  }

  return true;
}

function throttle(fn, limit, interval) {
  if (!isFinite(limit)) {
    throw new TypeError('Expected `limit` to be a finite number');
  }

  if (!isFinite(interval)) {
    throw new TypeError('Expected `interval` to be a finite number');
  }

  var queue = [];
  var timeouts = [];
  var activeCount = 0;

  var next = function next() {
    activeCount++;
    var id = (0, _setTimeout2.default)(function () {
      activeCount--;

      if (queue.length > 0) {
        next();
      }

      timeouts = (0, _filter.default)(timeouts).call(timeouts, function (currentId) {
        return currentId !== id;
      });
    }, interval);

    if ((0, _indexOf.default)(timeouts).call(timeouts, id) < 0) {
      timeouts.push(id);
    }

    var x = queue.shift();
    x.resolve(fn.apply(x.self, x.args));
  };

  var throttled = function throttled() {
    var args = arguments;
    var that = this;
    return new _promise.default(function (resolve, reject) {
      queue.push({
        resolve: resolve,
        reject: reject,
        args: args,
        self: that
      });

      if (activeCount < limit) {
        next();
      }
    });
  };

  throttled.abort = function () {
    (0, _forEach.default)(timeouts).call(timeouts, clearTimeout);
    timeouts = [];
    (0, _forEach.default)(queue).call(queue, function (x) {
      x.reject(new throttle.AbortError());
    });
    queue.length = 0;
  };

  return throttled;
}

function AbortError() {
  Error.call(this, 'Throttled function aborted');
  this.name = 'AbortError';
}

throttle.AbortError = AbortError;
module.exports = throttle;