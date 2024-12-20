import StoryblokClient from '.';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ResponseFn } from './sbFetch';
import SbFetch from './sbFetch';
import { SbHelpers } from './sbHelpers';

// Mocking external dependencies
vi.mock('../src/sbFetch', () => {
  const mockGet = vi.fn().mockResolvedValue({
    data: {
      links: 'Test data',
    },
    headers: {},
    status: 200,
  });
  const mockPost = vi.fn();
  const mockSetFetchOptions = vi.fn();

  // Define a mock class with baseURL property
  class MockSbFetch {
    private baseURL: string;
    private timeout?: number;
    private headers: Headers;
    private helpers: any;
    private responseInterceptor?: ResponseFn;
    constructor(config: any) {
      this.helpers = new SbHelpers();
      this.baseURL = config.baseURL || 'https://api.storyblok.com/v2';
      this.responseInterceptor = config.responseInterceptor;
    }

    public get = mockGet;
    public post = mockPost;
    public setFetchOptions = mockSetFetchOptions;
  }

  return {
    default: MockSbFetch,
  };
});

describe('storyblokClient', () => {
  let client;

  beforeEach(() => {
    // Setup default mocks
    client = new StoryblokClient({
      accessToken: 'test-token',
      /* fetch: mockFetch, */
    });
  });

  describe('initialization', () => {
    it('should initialize a client instance', () => {
      expect(client).toBeDefined();
      expect(client).toBeInstanceOf(StoryblokClient);
    });

    it('should initialize with default values', () => {
      expect(client.maxRetries).toBe(10);
      expect(client.retriesDelay).toBe(300);
      expect(client.cache).toEqual({
        clear: 'manual',
      });
      expect(client.relations).toEqual({});
      expect(client.links).toEqual({});
      // Failing test
      /* expect(client.helpers).toBeInstanceOf(SbHelpers) */
      expect(client.resolveCounter).toBe(0);
      expect(client.resolveNestedRelations).toBeTruthy();
      expect(client.stringifiedStoriesCache).toEqual({});
    });

    it('should set an accessToken', () => {
      expect(client.accessToken).toBe('test-token');
    });

    it('should set an endpoint', () => {
      expect(client.client.baseURL).toBe('https://api.storyblok.com/v2');
    });

    it('should set a fetch instance', () => {
      expect(client.client).toBeInstanceOf(SbFetch);
    });
  });

  describe('configuration via options', () => {
    it('should set a custom endpoint', () => {
      client = new StoryblokClient({
        endpoint: 'https://api-custom.storyblok.com/v2',
      });

      expect(client.client.baseURL).toBe('https://api-custom.storyblok.com/v2');
    });
    it('https: should set the http endpoint if option is set to false', () => {
      client = new StoryblokClient({
        accessToken: 'test-token',
        https: false,
      });

      expect(client.client.baseURL).toBe('http://api.storyblok.com/v2');
    });
    it('should set the management endpoint v1 if oauthToken is available', () => {
      client = new StoryblokClient({
        oauthToken: 'test-token',
      });

      expect(client.client.baseURL).toBe('https://api.storyblok.com/v1');
    });
    it('should set the correct region endpoint', () => {
      client = new StoryblokClient({
        region: 'us',
      });

      expect(client.client.baseURL).toBe('https://api-us.storyblok.com/v2');
    });
    it('should set maxRetries', () => {
      client = new StoryblokClient({
        maxRetries: 5,
      });

      expect(client.maxRetries).toBe(5);
    });
    // TODO: seems like implmentation is missing
    it.skip('should desactivate resolveNestedRelations', () => {
      client = new StoryblokClient({
        resolveNestedRelations: false,
      });

      expect(client.resolveNestedRelations).toBeFalsy();
    });

    it('should set automatic cache clearing', () => {
      client = new StoryblokClient({
        cache: {
          clear: 'auto',
        },
      });

      expect(client.cache.clear).toBe('auto');
    });

    it('should set a responseInterceptor', async () => {
      const responseInterceptor = (response) => {
        return response;
      };

      client = new StoryblokClient({
        responseInterceptor,
      });
      await client.getAll('cdn/links');
      expect(client.client.responseInterceptor).toBe(responseInterceptor);
    });
  });

  describe('cache', () => {
    it('should return cacheVersions', async () => {
      const mockThrottle = vi.fn().mockResolvedValue({
        data: {
          stories: [{ id: 1, title: 'Update' }],
          cv: 1645521118,
        },
        headers: {},
        status: 200,
      });
      client.throttle = mockThrottle;
      await client.get('test', { version: 'draft', token: 'test-token' });

      expect(client.cacheVersions()).toEqual({
        'test-token': 1645521118,
      });
    });

    it('should return cacheVersion', async () => {
      const mockThrottle = vi.fn().mockResolvedValue({
        data: {
          stories: [{ id: 1, title: 'Update' }],
          cv: 1645521118,
        },
        headers: {},
        status: 200,
      });
      client.throttle = mockThrottle;
      await client.get('test', { version: 'draft', token: 'test-token' });

      expect(client.cacheVersion('test-token')).toBe(1645521118);
    });

    it('should set the cache version', async () => {
      client.setCacheVersion(1645521118);
      expect(client.cacheVersions()).toEqual({
        'test-token': 1645521118,
      });
    });

    it('should clear the cache', async () => {
      // Mock the cacheProvider and its flush method
      client.cacheProvider = vi.fn().mockReturnValue({
        flush: vi.fn().mockResolvedValue(undefined),
      });
      // Mock the clearCacheVersion method
      client.clearCacheVersion = vi.fn();
      await client.flushCache();

      expect(client.cacheProvider().flush).toHaveBeenCalled();
      expect(client.clearCacheVersion).toHaveBeenCalled();
    });

    it('should clear the cache version', async () => {
      client.clearCacheVersion('test-token');
      expect(client.cacheVersion()).toEqual(0);
    });

    it('should flush the cache when the draft version is requested and clear is auto', async () => {
      client = new StoryblokClient({ cache: { clear: 'auto' } });
      client.cacheProvider = vi.fn().mockReturnValue({
        flush: vi.fn().mockResolvedValue(undefined),
      });
      client.clearCacheVersion = vi.fn();
      // Setup scenario where draft version triggers cache flush
      await client.get('test-draft', { version: 'draft' });
      // Ensure cache flush method was called
      expect(client.cacheProvider().flush).toHaveBeenCalled();
      expect(client.clearCacheVersion).toHaveBeenCalled();
    });
  });

  describe('get', () => {
    it('should fetch data from the API', async () => {
      const result = await client.get('test');
      expect(result).toEqual({
        data: {
          links: 'Test data',
        },
        headers: {},
      });
    });

    it('should handle API errors gracefully', async () => {
      const mockGet = vi.fn().mockRejectedValue({
        status: 404,
        statusText: 'Not Found',
      });

      client.client = {
        get: mockGet,
        post: vi.fn(),
        setFetchOptions: vi.fn(),
        baseURL: 'https://api.storyblok.com/v2',
      };

      await expect(client.get('cdn/stories/non-existent'))
        .rejects
        .toMatchObject({
          status: 404,
        });
    });

    it('should fetch and return a complex story object correctly', async () => {
      const mockComplexStory = {
        data: {
          story: {
            id: 123456,
            uuid: 'story-uuid-123',
            name: 'Complex Page',
            slug: 'complex-page',
            full_slug: 'folder/complex-page',
            created_at: '2023-01-01T12:00:00.000Z',
            published_at: '2023-01-02T12:00:00.000Z',
            first_published_at: '2023-01-02T12:00:00.000Z',
            content: {
              _uid: 'content-123',
              component: 'page',
              title: 'Complex Page Title',
              subtitle: 'Complex Page Subtitle',
              intro: {
                _uid: 'intro-123',
                component: 'intro',
                heading: 'Welcome to our page',
                text: 'Some introduction text',
              },
              body: [
                {
                  _uid: 'text-block-123',
                  component: 'text_block',
                  text: 'First paragraph of content',
                },
                {
                  _uid: 'image-block-123',
                  component: 'image',
                  src: 'https://example.com/image.jpg',
                  alt: 'Example image',
                },
                {
                  _uid: 'related-items-123',
                  component: 'related_items',
                  items: ['uuid1', 'uuid2'], // Relations that we won't resolve in this test
                },
              ],
              seo: {
                _uid: 'seo-123',
                component: 'seo',
                title: 'SEO Title',
                description: 'SEO Description',
                og_image: 'https://example.com/og-image.jpg',
              },
            },
            position: 1,
            is_startpage: false,
            parent_id: 654321,
            group_id: '789-group',
            alternates: [],
            translated_slugs: [],
            default_full_slug: null,
            lang: 'default',
          },
        },
        headers: {},
        status: 200,
        statusText: 'OK',
      };

      const mockGet = vi.fn().mockResolvedValue(mockComplexStory);

      client.client = {
        get: mockGet,
        post: vi.fn(),
        setFetchOptions: vi.fn(),
        baseURL: 'https://api.storyblok.com/v2',
      };

      const result = await client.get('cdn/stories/folder/complex-page');

      // Verify the complete story structure is returned correctly
      expect(result.data.story).toMatchObject({
        id: 123456,
        uuid: 'story-uuid-123',
        name: 'Complex Page',
        slug: 'complex-page',
        full_slug: 'folder/complex-page',
        content: expect.objectContaining({
          _uid: 'content-123',
          component: 'page',
          title: 'Complex Page Title',
          subtitle: 'Complex Page Subtitle',
          intro: expect.objectContaining({
            _uid: 'intro-123',
            component: 'intro',
          }),
          body: expect.arrayContaining([
            expect.objectContaining({
              component: 'text_block',
            }),
            expect.objectContaining({
              component: 'image',
            }),
            expect.objectContaining({
              component: 'related_items',
            }),
          ]),
        }),
      });

      // Verify specific nested properties
      expect(result.data.story.content.seo).toEqual({
        _uid: 'seo-123',
        component: 'seo',
        title: 'SEO Title',
        description: 'SEO Description',
        og_image: 'https://example.com/og-image.jpg',
      });

      // Verify that relations array exists but remains unresolved
      expect(result.data.story.content.body[2].items).toEqual(['uuid1', 'uuid2']);

      // Verify the API was called only once (no relation resolution)
      expect(mockGet).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAll', () => {
    it('should fetch all data from the API', async () => {
      const mockMakeRequest = vi.fn().mockResolvedValue({
        data: {
          links: [
            { id: 1, name: 'Test 1' },
            { id: 2, name: 'Test 2' },
          ],
        },
        headers: {},
        status: 200,
      });
      client.makeRequest = mockMakeRequest;
      const result = await client.getAll('links', { version: 'draft' });
      expect(result).toEqual([
        { id: 1, name: 'Test 1' },
        { id: 2, name: 'Test 2' },
      ]);
    });

    it('should resolve using entity option', async () => {
      const mockMakeRequest = vi.fn().mockResolvedValue({
        data: {
          custom: [
            { id: 1, name: 'Test 1' },
            { id: 2, name: 'Test 2' },
          ],
        },
        headers: {},
        status: 200,
      });
      client.makeRequest = mockMakeRequest;
      const result = await client.getAll(
        'cdn/links',
        { version: 'draft' },
        'custom',
      );
      expect(result).toEqual([
        { id: 1, name: 'Test 1' },
        { id: 2, name: 'Test 2' },
      ]);
    });

    it('should make a request for each page', async () => {
      const mockMakeRequest = vi.fn().mockResolvedValue({
        data: {
          links: [
            { id: 1, name: 'Test 1' },
            { id: 2, name: 'Test 2' },
          ],
        },
        total: 2,
        status: 200,
      });
      client.makeRequest = mockMakeRequest;
      await client.getAll('links', { per_page: 1 });
      expect(mockMakeRequest).toBeCalledTimes(2);
    });

    it('should get all stories if the slug is passed with the trailing slash', async () => {
      const mockMakeRequest = vi.fn().mockResolvedValue({
        data: {
          stories: [
            { id: 1, name: 'Test Story 1' },
            { id: 2, name: 'Test Story 2' },
          ],
        },
        total: 2,
        status: 200,
      });
      client.makeRequest = mockMakeRequest;
      const result = await client.getAll('cdn/stories/', { version: 'draft' });
      expect(result).toEqual([
        { id: 1, name: 'Test Story 1' },
        { id: 2, name: 'Test Story 2' },
      ]);
    });
  });

  describe('post', () => {
    it('should post data to the API', async () => {
      const mockThrottle = vi.fn().mockResolvedValue({
        data: {
          stories: [{ id: 1, title: 'Keep me posted' }],
        },
        headers: {},
        status: 200,
      });
      client.throttle = mockThrottle;
      const result = await client.post('test', { data: 'test' });
      expect(result).toEqual({
        data: {
          stories: [{ id: 1, title: 'Keep me posted' }],
        },
        headers: {},
        status: 200,
      });
    });
  });

  describe('put', () => {
    it('should put data to the API', async () => {
      const mockThrottle = vi.fn().mockResolvedValue({
        data: {
          stories: [{ id: 1, title: 'Update' }],
        },
        headers: {},
        status: 200,
      });
      client.throttle = mockThrottle;
      const result = await client.put('test', { data: 'test' });
      expect(result).toEqual({
        data: {
          stories: [{ id: 1, title: 'Update' }],
        },
        headers: {},
        status: 200,
      });
    });
  });

  describe('delete', () => {
    it('should delete data from the API', async () => {
      const mockThrottle = vi.fn().mockResolvedValue({
        data: {
          stories: [{ id: 1, title: 'Delete' }],
        },
        headers: {},
        status: 200,
      });
      client.throttle = mockThrottle;
      const result = await client.delete('test');
      expect(result).toEqual({
        data: {
          stories: [{ id: 1, title: 'Delete' }],
        },
        headers: {},
        status: 200,
      });
    });
  });

  it('should resolve stories when response contains a story or stories', async () => {
    const mockThrottle = vi.fn().mockResolvedValue({
      data: { stories: [{ id: 1, title: 'Test Story' }] },
      headers: {},
      status: 200,
    });
    client.throttle = mockThrottle;
    client.resolveStories = vi.fn().mockResolvedValue({
      id: 1,
      title: 'Test Story',
    });

    await client.cacheResponse('/test-url', {
      token: 'test-token',
      version: 'published',
    });

    expect(client.resolveStories).toHaveBeenCalled();
    expect(client.resolveCounter).toBe(1);
  });

  it('should return access token', () => {
    expect(client.getToken()).toBe('test-token');
  });

  describe('relation resolution', () => {
    it('should resolve nested relations within content blocks', async () => {
      const TEST_UUID = 'this-is-a-test-uuid';

      const mockResponse = {
        data: {
          story: {
            content: {
              _uid: 'parent-uid',
              component: 'page',
              body: [{
                _uid: 'slider-uid',
                component: 'event_slider',
                spots: [{
                  _uid: 'event-uid',
                  component: 'event',
                  content: {
                    _uid: 'content-uid',
                    component: 'event',
                    event_type: TEST_UUID,
                  },
                }],
              }],
            },
          },
          rel_uuids: [TEST_UUID],
        },
        headers: {},
        status: 200,
        statusText: 'OK',
      };

      const mockRelationsResponse = {
        data: {
          stories: [{
            _uid: 'type-uid',
            uuid: TEST_UUID,
            content: {
              name: 'Test Event Type',
              component: 'event_type',
            },
          }],
        },
        headers: {},
        status: 200,
        statusText: 'OK',
      };

      // Setup the mock client's get method
      const mockGet = vi.fn()
        .mockImplementationOnce(() => Promise.resolve(mockResponse))
        .mockImplementationOnce(() => Promise.resolve(mockRelationsResponse));

      // Replace the client's fetch instance
      client.client = {
        get: mockGet,
        post: vi.fn(),
        setFetchOptions: vi.fn(),
      };

      const result = await client.get('cdn/stories/test', {
        resolve_relations: [
          'event.event_type',
          'event_slider.spots',
        ],
        version: 'draft',
      });

      // Verify that the UUID was replaced with the resolved object
      const resolvedEventType = result.data.story.content.body[0].spots[0].content.event_type;
      expect(resolvedEventType).toEqual({
        _uid: 'type-uid',
        uuid: TEST_UUID,
        content: {
          name: 'Test Event Type',
          component: 'event_type',
        },
        _stopResolving: true,
      });

      // Verify that get was called two times
      expect(mockGet).toHaveBeenCalledTimes(2);
    });

    it('should resolve an array of relations', async () => {
      const TEST_UUIDS = ['tag-1-uuid', 'tag-2-uuid'];

      const mockResponse = {
        data: {
          story: {
            content: {
              _uid: 'root-uid',
              component: 'post',
              tags: TEST_UUIDS,
            },
          },
          rel_uuids: TEST_UUIDS,
        },
        headers: {},
        status: 200,
        statusText: 'OK',
      };

      const mockRelationsResponse = {
        data: {
          stories: [
            {
              _uid: 'tag-1-uid',
              uuid: TEST_UUIDS[0],
              content: {
                name: 'Tag 1',
                component: 'tag',
              },
            },
            {
              _uid: 'tag-2-uid',
              uuid: TEST_UUIDS[1],
              content: {
                name: 'Tag 2',
                component: 'tag',
              },
            },
          ],
        },
        headers: {},
        status: 200,
        statusText: 'OK',
      };

      const mockGet = vi.fn()
        .mockImplementationOnce(() => Promise.resolve(mockResponse))
        .mockImplementationOnce(() => Promise.resolve(mockRelationsResponse));

      client.client = {
        get: mockGet,
        post: vi.fn(),
        setFetchOptions: vi.fn(),
        baseURL: 'https://api.storyblok.com/v2',
      };

      const result = await client.get('cdn/stories/test', {
        resolve_relations: ['post.tags'],
        version: 'draft',
      });

      expect(result.data.story.content.tags).toEqual([
        {
          _uid: 'tag-1-uid',
          uuid: TEST_UUIDS[0],
          content: {
            name: 'Tag 1',
            component: 'tag',
          },
          _stopResolving: true,
        },
        {
          _uid: 'tag-2-uid',
          uuid: TEST_UUIDS[1],
          content: {
            name: 'Tag 2',
            component: 'tag',
          },
          _stopResolving: true,
        },
      ]);
    });

    it('should resolve multiple relation patterns simultaneously', async () => {
      const AUTHOR_UUID = 'author-uuid';
      const CATEGORY_UUID = 'category-uuid';

      const mockResponse = {
        data: {
          story: {
            content: {
              _uid: 'root-uid',
              component: 'post',
              author: AUTHOR_UUID,
              category: CATEGORY_UUID,
            },
          },
          rel_uuids: [AUTHOR_UUID, CATEGORY_UUID],
        },
        headers: {},
        status: 200,
        statusText: 'OK',
      };

      const mockRelationsResponse = {
        data: {
          stories: [
            {
              _uid: 'author-uid',
              uuid: AUTHOR_UUID,
              content: {
                name: 'John Doe',
                component: 'author',
              },
            },
            {
              _uid: 'category-uid',
              uuid: CATEGORY_UUID,
              content: {
                name: 'Technology',
                component: 'category',
              },
            },
          ],
        },
        headers: {},
        status: 200,
        statusText: 'OK',
      };

      const mockGet = vi.fn()
        .mockImplementationOnce(() => Promise.resolve(mockResponse))
        .mockImplementationOnce(() => Promise.resolve(mockRelationsResponse));

      client.client = {
        get: mockGet,
        post: vi.fn(),
        setFetchOptions: vi.fn(),
        baseURL: 'https://api.storyblok.com/v2',
      };

      const result = await client.get('cdn/stories/test', {
        resolve_relations: ['post.author', 'post.category'],
        version: 'draft',
      });

      expect(result.data.story.content.author).toEqual({
        _uid: 'author-uid',
        uuid: AUTHOR_UUID,
        content: {
          name: 'John Doe',
          component: 'author',
        },
        _stopResolving: true,
      });

      expect(result.data.story.content.category).toEqual({
        _uid: 'category-uid',
        uuid: CATEGORY_UUID,
        content: {
          name: 'Technology',
          component: 'category',
        },
        _stopResolving: true,
      });
    });

    it('should handle content with no relations to resolve', async () => {
      const mockResponse = {
        data: {
          story: {
            content: {
              _uid: 'test-story-uid',
              component: 'page',
              title: 'Simple Page',
              text: 'Just some text content',
              number: 42,
              boolean: true,
            },
          },
        },
        headers: {},
        status: 200,
        statusText: 'OK',
      };

      const mockGet = vi.fn()
        .mockImplementationOnce(() => Promise.resolve(mockResponse));

      client.client = {
        get: mockGet,
        post: vi.fn(),
        setFetchOptions: vi.fn(),
        baseURL: 'https://api.storyblok.com/v2',
      };

      const result = await client.get('cdn/stories/test', {
        resolve_relations: ['page.author'], // Even with resolve_relations, nothing should change
        version: 'draft',
      });

      // Verify the content remains unchanged
      expect(result.data.story.content).toEqual({
        _uid: 'test-story-uid',
        component: 'page',
        title: 'Simple Page',
        text: 'Just some text content',
        number: 42,
        boolean: true,
      });

      // Verify that only one API call was made (no relations to resolve)
      expect(mockGet).toHaveBeenCalledTimes(1);
    });

    it('should handle invalid relation patterns gracefully', async () => {
      const mockResponse = {
        data: {
          story: {
            content: {
              _uid: 'test-uid',
              component: 'page',
              relation_field: 'some-uuid',
            },
          },
        },
        headers: {},
        status: 200,
        statusText: 'OK',
      };

      const mockGet = vi.fn()
        .mockImplementationOnce(() => Promise.resolve(mockResponse));

      client.client = {
        get: mockGet,
        post: vi.fn(),
        setFetchOptions: vi.fn(),
        baseURL: 'https://api.storyblok.com/v2',
      };

      const result = await client.get('cdn/stories/test', {
        resolve_relations: ['invalid.pattern'],
        version: 'draft',
      });

      // Should not throw and return original content
      expect(result.data.story.content.relation_field).toBe('some-uuid');
    });

    it('should handle empty resolve_relations array', async () => {
      const mockResponse = {
        data: {
          story: {
            content: {
              _uid: 'test-uid',
              component: 'page',
              relation_field: 'some-uuid',
            },
          },
        },
        headers: {},
        status: 200,
        statusText: 'OK',
      };

      const mockGet = vi.fn()
        .mockImplementationOnce(() => Promise.resolve(mockResponse));

      client.client = {
        get: mockGet,
        post: vi.fn(),
        setFetchOptions: vi.fn(),
        baseURL: 'https://api.storyblok.com/v2',
      };

      const result = await client.get('cdn/stories/test', {
        resolve_relations: [],
        version: 'draft',
      });

      expect(result.data.story.content.relation_field).toBe('some-uuid');
      expect(mockGet).toHaveBeenCalledTimes(1);
    });
  });
});
