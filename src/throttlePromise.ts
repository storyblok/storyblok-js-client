import { ThrottleFn } from './interfaces'

type Shifted = {
  args: any
  self: any
  resolve: (args: any) => any
}

type Queue = {
  resolve: (args: any) => any
  reject: (args: any) => any
  args: any[]
  self: any
}

interface ISbThrottle {
  abort: () => any
  (...args: any): Promise<Queue>
  name: string
  AbortError?: () => void
}

function isFinite(value: number) {
  if (value !== value || value === Infinity || value === -Infinity) {
    return false
  }

  return true
}

function throttledQueue(fn: ThrottleFn, limit: number, interval: number) {
  if (!isFinite(limit)) {
    throw new TypeError('Expected `limit` to be a finite number')
  }

  if (!isFinite(interval)) {
    throw new TypeError('Expected `interval` to be a finite number')
  }

  const queue: Queue[] = []
  let timeouts: ReturnType<typeof setTimeout>[] = []
  let activeCount = 0
  let isAborted = false

  const next = async function () {
    activeCount++

    const x = queue.shift() as unknown as Shifted
    x.resolve(await fn.apply(x.self, x.args))

    const id = setTimeout(function () {
      activeCount--

      if (queue.length > 0) {
        next()
      }

      timeouts = timeouts.filter((currentId) => currentId !== id)
    }, interval)

    if (!timeouts.includes(id)) {
      timeouts.push(id)
    }
  }

  const throttled: ISbThrottle = function (
    this: ISbThrottle,
    ...args: []
  ): Promise<Queue> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this
    if (isAborted) {
      return Promise.reject(
        new Error(
          'Throttled function is aborted and not accepting new promises'
        )
      )
    }

    return new Promise((resolve, reject) => {
      queue.push({
        resolve: resolve,
        reject: reject,
        args: args,
        self,
      })

      if (activeCount < limit) {
        next()
      }
    })
  }

  throttled.abort = function () {
    isAborted = true
    timeouts.forEach(clearTimeout)
    timeouts = []

    queue.forEach(function (x) {
      x.reject(function (this: ISbThrottle) {
        Error.call(this, 'Throttled function aborted')
        this.name = 'AbortError'
      })
    })
    queue.length = 0
  }

  return throttled
}

export default throttledQueue
