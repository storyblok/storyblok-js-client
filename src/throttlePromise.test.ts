import { describe, it, expect, vi } from 'vitest'
import throttledFn from './throttlePromise'

// Helper function for simulating async tasks with optional failure
function mockAsyncTask(id: number, delay: number = 0) {
  return new Promise<number>((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.1) {
        // Make 10% of them fail
        reject(`Error in task ${id}`)
      } else {
        resolve(id)
      }
    }, delay)
  })
}

describe('throttledFn', () => {
  it('should resolve or reject all promises after the queue finishes, even when aborting', async () => {
    const fn = (id: number) => mockAsyncTask(id)
    const throttled = throttledFn(fn, 3, 10) // Throttle with 3 concurrent tasks
    const promises: Promise<any>[] = []

    // Generate 10 tasks and push them to the promises array
    for (let i = 0; i < 10; i++) {
      promises.push(throttled(i))
      if (i === 5) {
        throttled.abort() // but abort from #6
      }
    }

    const results = await Promise.allSettled(promises)
    results.forEach((result) => {
      expect(['fulfilled', 'rejected']).toContain(result.status)
    })
  })
})
