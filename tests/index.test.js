/* eslint-disable no-undef */
import { expect, test, describe } from 'vitest'
import StoryblokClient, { RichtextResolver } from '../'

let Storyblok = new StoryblokClient({
  accessToken: 'w0yFvs04aKF2rpz6F8OfIQtt',
  cache: { type: 'memory', clear: 'auto' },
})

describe('getAll function', () => {
  test("getAll('cdn/stories') should return all stories", async () => {
    const result = await Storyblok.getAll('cdn/stories')
    expect(result.length).toBeGreaterThan(0)
  })

  test("getAll('cdn/stories') should return all stories with filtered results", async () => {
    const result = await Storyblok.getAll('cdn/stories', {
      starts_with: 'testcontent-0',
    })
    expect(result.length).toBeGreaterThan(0)
  })

  test("getAll('cdn/stories', filter_query: { __or: [{ category: { any_in_array: 'Category 1' } }, { category: { any_in_array: 'Category 2' } }]}) should return all stories with the specific filter applied", async () => {
    const result = await Storyblok.getAll('cdn/stories', {
      filter_query: {
        __or: [
          { category: { any_in_array: 'Category 1' } },
          { category: { any_in_array: 'Category 2' } },
        ],
      },
    })
    expect(result.length).toBeGreaterThan(0)
  })

  test("getAll('cdn/stories', {by_slugs: 'folder/*'}) should return all stories with the specific filter applied", async () => {
    const result = await Storyblok.getAll('cdn/stories', {
      by_slugs: 'folder/*',
    })
    expect(result.length).toBeGreaterThan(0)
  })

  test("getAll('cdn/links') should return all links", async () => {
    const result = await Storyblok.getAll('cdn/links')
    expect(result.length).toBeGreaterThan(0)
  })

  if (process.env.VITE_OAUTH_TOKEN) {
    const spaceId = process.env.VITE_SPACE_ID
    test('should return all spaces', async () => {
      let StoryblokManagement = new StoryblokClient({
        oauthToken: process.env.VITE_OAUTH_TOKEN,
      })
      const result = await StoryblokManagement.getAll(
        `spaces/${spaceId}/stories`
      )
      expect(result.length).toBeGreaterThan(0)
    })
  }
})

describe('test uncached requests', () => {
  test("get('cdn/spaces/me') should not be cached", async () => {
    let provider = Storyblok.cacheProvider()
    await provider.flush()
    await Storyblok.get('cdn/spaces/me')
    expect(Object.values(provider.getAll()).length).toBe(0)
  })
})

describe('test cached requests', () => {
  test("get('cdn/stories') should be cached when is a published version", async () => {
    const cacheVersion = Storyblok.cacheVersion()

    await Storyblok.get('cdn/stories')

    expect(cacheVersion).not.toBe(undefined)

    const newCacheVersion = Storyblok.cacheVersion()

    await Storyblok.get('cdn/stories')

    expect(newCacheVersion).toBe(Storyblok.cacheVersion())

    await Storyblok.get('cdn/stories')

    expect(newCacheVersion).toBe(Storyblok.cacheVersion())
  })
})

describe('test constructor', () => {
  test('should have a richtextResolver field that is an instance of RichTextResolver', () => {
    expect(Storyblok.richTextResolver).toBeInstanceOf(RichtextResolver)
  })
})

describe('Test for cdn/links with simultaneous requests', () => {
  test('should not abort any of the requests', async () => {
    for (let index = 0; index < 20; index++) {
      await Storyblok.get('cdn/links')
        .then((res) => {
          expect(res.data.links).toBeTruthy()
        })
        .catch()
    }
  })
})
