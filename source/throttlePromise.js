function isFinite(value) {
  if (typeof value !== 'number') {
    return false;
  }

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

  var queue = [];
  var timeouts = [];
  var activeCount = 0;

  var next = function () {
    activeCount++;

    var id = setTimeout(function () {
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

    var x = queue.shift();
    x.resolve(fn.apply(x.self, x.args));
  };

  var throttled = function () {
    var args = arguments;
    var that = this;

    return new Promise(function (resolve, reject) {
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
    timeouts.forEach(clearTimeout);
    timeouts = [];

    queue.forEach(function (x) {
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

throttledQueue.AbortError = AbortError;

export default throttledQueue;
