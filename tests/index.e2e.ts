import StoryblokClient from '../src/'
import { describe, it, expect, beforeEach } from 'vitest'

describe('StoryblokClient', () => {
  let client

  beforeEach(() => {
    // Setup default mocks
    client = new StoryblokClient({
      accessToken: 'w0yFvs04aKF2rpz6F8OfIQtt',
      cache: { type: 'memory', clear: 'auto' },
    })
  })

  describe('getAll function', () => {
    it("getAll('cdn/stories') should return all stories", async () => {
      const result = await client.getAll('cdn/stories')
      expect(result.length).toBeGreaterThan(0)
    })

    it("getAll('cdn/stories') should return all stories with filtered results", async () => {
      const result = await client.getAll('cdn/stories', {
        starts_with: 'testcontent-0',
      })
      console.log(result.length)
      expect(result.length).toBe(1)
    })

    it("getAll('cdn/stories', filter_query: { __or: [{ category: { any_in_array: 'Category 1' } }, { category: { any_in_array: 'Category 2' } }]}) should return all stories with the specific filter applied", async () => {
      const result = await client.getAll('cdn/stories', {
        filter_query: {
          __or: [
            { category: { any_in_array: 'Category 1' } },
            { category: { any_in_array: 'Category 2' } },
          ],
        },
      })
      expect(result.length).toBeGreaterThan(0)
    })

    it("getAll('cdn/stories', {by_slugs: 'folder/*'}) should return all stories with the specific filter applied", async () => {
      const result = await client.getAll('cdn/stories', {
        by_slugs: 'folder/*',
      })
      expect(result.length).toBeGreaterThan(0)
    })

    it("getAll('cdn/links') should return all links", async () => {
      const result = await client.getAll('cdn/links')
      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe('caching', () => {
    it("get('cdn/spaces/me') should not be cached", async () => {
      const provider = client.cacheProvider()
      await provider.flush()
      await client.get('cdn/spaces/me')
      expect(Object.values(provider.getAll()).length).toBe(0)
    })

    it("get('cdn/stories') should be cached when is a published version", async () => {
      const cacheVersion = client.cacheVersion()

      await client.get('cdn/stories')

      expect(cacheVersion).not.toBe(undefined)

      const newCacheVersion = client.cacheVersion()

      await client.get('cdn/stories')

      expect(newCacheVersion).toBe(client.cacheVersion())

      await client.get('cdn/stories')

      expect(newCacheVersion).toBe(client.cacheVersion())
    })
  })
})
