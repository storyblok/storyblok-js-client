import { describe, it, expect, vi } from 'vitest'
import throttledQueue from './throttlePromise'

// Mock function to simulate async work with a delay
const mockFn = vi.fn(async (input) => {
  await new Promise((resolve) => setTimeout(resolve, 200)) // Simulate async delay
  return input
})

describe('throttledQueue', () => {
  it('should resolve or reject all promises after the queue finishes, even when aborting', async () => {
    const throttled = throttledQueue(mockFn, 3, 10) // Throttle with 3 concurrent tasks
    const promises: Promise<any>[] = []

    // Generate 10 tasks and push them to the promises array
    for (let i = 0; i < 10; i++) {
      promises.push(throttled(i))
      if (i === 5) {
        throttled.abort() // but abort at call #6
      }
    }

    const results = await Promise.allSettled(promises)
    results.forEach((result) => {
      expect(['fulfilled', 'rejected']).toContain(result.status)
    })
  })
  it('should enforce sequential resolution when throttle limit is exceeded', async () => {
    const throttled = throttledQueue(mockFn, 1, 100) // Limit of 1, 100ms interval

    const start = Date.now()
    const promises = [
      throttled('test1'),
      throttled('test2'),
      throttled('test3'),
    ]

    const results = await Promise.all(promises)
    const duration = Date.now() - start

    // Expected behavior:
    // Since each call has a 200ms delay, and there's a 100ms throttle interval and limit is 1,
    // and each successive call should only start after the previous one completes,
    // then the total duration should be around 800ms (200*3 + 100*2).
    expect(results).toEqual(['test1', 'test2', 'test3'])
    expect(duration).toBeGreaterThanOrEqual(800)
  })
})
