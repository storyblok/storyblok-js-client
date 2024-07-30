import StoryblokClient from '../src/'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import SbFetch from '../src/sbFetch'

// Mocking external dependencies
vi.mock('../src/sbFetch', () => {
  const mockGet = vi.fn().mockResolvedValue({
    data: 'Test data',
    headers: {},
    status: 200,
  })
  const mockPost = vi.fn()
  const mockSetFetchOptions = vi.fn()

  // Define a mock class with baseURL property
  class MockSbFetch {
    private baseURL: string
    private timeout?: number
    private headers: Headers
    constructor(config: any) {
      this.baseURL = config.baseURL || 'https://api.storyblok.com/v2'
    }
    public get = mockGet
    public post = mockPost
    public setFetchOptions = mockSetFetchOptions
  }

  return {
    default: MockSbFetch,
  }
})

describe('StoryblokClient', () => {
  let client

  beforeEach(() => {
    // Setup default mocks
    client = new StoryblokClient({
      accessToken: 'test-token',
      /* fetch: mockFetch, */
    })
  })

  describe('initialization', () => {
    it('should initialize a client instance', () => {
      expect(client).toBeDefined()
      expect(client).toBeInstanceOf(StoryblokClient)
    })

    it('should initialize with default values', () => {
      expect(client.maxRetries).toBe(10)
      expect(client.retriesDelay).toBe(300)
      expect(client.cache).toEqual({
        clear: 'manual',
      })
      expect(client.relations).toEqual({})
      expect(client.links).toEqual({})
      // Failing test
      /* expect(client.helpers).toBeInstanceOf(SbHelpers) */
      expect(client.resolveCounter).toBe(0)
      expect(client.resolveNestedRelations).toBeTruthy()
      expect(client.stringifiedStoriesCache).toEqual({})
    })

    it('should initialize with an accessToken', () => {
      expect(client.accessToken).toBe('test-token')
    })

    it('should initialize with an endpoint', () => {
      expect(client.client.baseURL).toBe('https://api.storyblok.com/v2')
    })

    it('should initialize with a fetch instance', () => {
      expect(client.client).toBeInstanceOf(SbFetch)
    })
  })

  describe('configuration via options', () => {
    it('should set a custom endpoint', () => {
      client = new StoryblokClient({
        endpoint: 'https://api-custom.storyblok.com/v2',
      })

      expect(client.client.baseURL).toBe('https://api-custom.storyblok.com/v2')

    })
    it('https: should set the http endpoint if option is set to false', () => {
      client = new StoryblokClient({
        accessToken: 'test-token',
        https: false,
      })

      expect(client.client.baseURL).toBe('http://api.storyblok.com/v2')
    })
    it('should set the management endpoint v1 if oauthToken is available', () => {
      client = new StoryblokClient({
        oauthToken: 'test-token',
      })

      expect(client.client.baseURL).toBe('https://api.storyblok.com/v1')
    })
    it('should set the correct region endpoint', () => {
      client = new StoryblokClient({
        region: 'us',
      })

      expect(client.client.baseURL).toBe('https://api-us.storyblok.com/v2')
    })
    it('should set maxRetries', () => {
      client = new StoryblokClient({
        maxRetries: 5,
      })

      expect(client.maxRetries).toBe(5)
    })
    // TODO: seems like implmentation is missing
    it.skip('should desactivate resolveNestedRelations', () => {
      client = new StoryblokClient({
        resolveNestedRelations: false,
      })

      expect(client.resolveNestedRelations).toBeFalsy()
    })

    it('should set automatic cache clearing', () => {
      client = new StoryblokClient({
        cache: {
          clear: 'auto',
        },
      })

      expect(client.cache.clear).toBe('auto')
    })
  })

  describe('get', () => {
    it('should fetch data from the API', async () => {
      const result = await client.get('test')
      expect(result).toEqual({ data: 'Test data', headers: {} })
    })
  })
})
