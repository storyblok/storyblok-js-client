import { ISbThrottle, Queue } from "./interfaces";

class AbortError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "AbortError";
  }
}

function isFinite(value: number) {
  if (value !== value || value === Infinity || value === -Infinity) {
    return false;
  }

  return true;
}

function throttledQueue<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  limit: number,
  interval: number
): ISbThrottle<T> {
  if (!isFinite(limit)) {
    throw new TypeError("Expected `limit` to be a finite number");
  }

  if (!isFinite(interval)) {
    throw new TypeError("Expected `interval` to be a finite number");
  }

  const queue: Queue<Parameters<T>>[] = [];
  let timeouts: ReturnType<typeof setTimeout>[] = [];
  let activeCount = 0;
  let isAborted = false;

  const next = async () => {
    activeCount++;

    const x = queue.shift();
    if (x) {
      const res = await fn(...x.args);
      x.resolve(res);
    }

    const id = setTimeout(() => {
      activeCount--;

      if (queue.length > 0) {
        next();
      }

      timeouts = timeouts.filter((currentId) => currentId !== id);
    }, interval);

    if (!timeouts.includes(id)) {
      timeouts.push(id);
    }
  };

  const throttled: ISbThrottle<T> = (...args) => {
    if (isAborted) {
      return Promise.reject(
        new Error(
          "Throttled function is already aborted and not accepting new promises"
        )
      );
    }

    return new Promise((resolve, reject) => {
      queue.push({
        resolve: resolve,
        reject: reject,
        args: args,
      });

      if (activeCount < limit) {
        next();
      }
    });
  };

  throttled.abort = () => {
    isAborted = true;
    timeouts.forEach(clearTimeout);
    timeouts = [];

    queue.forEach((x) =>
      x.reject(() => new AbortError("Throttle function aborted"))
    );
    queue.length = 0;
  };

  return throttled;
}

export default throttledQueue;
