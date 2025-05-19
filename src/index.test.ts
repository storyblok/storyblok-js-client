import StoryblokClient from '.';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ResponseFn } from './sbFetch';
import SbFetch from './sbFetch';
import type { ISbLink, ISbStoryData } from './interfaces';

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
    private responseInterceptor?: ResponseFn;
    constructor(config: any) {
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

      expect(client.resolveCounter).toBe(0);
      expect(client.resolveNestedRelations).toBeTruthy();
      expect(client.stringifiedStoriesCache).toEqual({});
      expect(client.version).toBe('draft');
    });

    it('should set an accessToken', () => {
      expect(client.accessToken).toBe('test-token');
    });

    it('should set a version', () => {
      expect(client.version).toBe('draft');
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

    it('should set a version', () => {
      client = new StoryblokClient({
        version: 'published',
      });

      expect(client.version).toBe('published');
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
  });

  describe('get', () => {
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

    describe('cdn/links endpoint', () => {
      it('should fetch links with dates when include_dates is set to 1', async () => {
        const mockLinksResponse = {
          data: {
            links: {
              'story-1': {
                id: 1,
                uuid: 'story-1-uuid',
                slug: 'story-1',
                name: 'Story 1',
                is_folder: false,
                parent_id: 0,
                published: true,
                position: 0,
                // Date fields included because of include_dates: 1
                created_at: '2024-01-01T10:00:00.000Z',
                published_at: '2024-01-01T11:00:00.000Z',
                updated_at: '2024-01-02T10:00:00.000Z',
              },
              'story-2': {
                id: 2,
                uuid: 'story-2-uuid',
                slug: 'story-2',
                name: 'Story 2',
                is_folder: false,
                parent_id: 0,
                published: true,
                position: 1,
                created_at: '2024-01-03T10:00:00.000Z',
                published_at: '2024-01-03T11:00:00.000Z',
                updated_at: '2024-01-04T10:00:00.000Z',
              },
            },
          },
          headers: {},
          status: 200,
        };

        const mockGet = vi.fn().mockResolvedValue(mockLinksResponse);

        client.client = {
          get: mockGet,
          post: vi.fn(),
          setFetchOptions: vi.fn(),
          baseURL: 'https://api.storyblok.com/v2',
        };

        const response = await client.get('cdn/links', {
          version: 'draft',
          include_dates: 1,
        });

        // Verify the structure of the response
        expect(response).toHaveProperty('data.links');

        // Check if links are present and have the correct structure
        expect(response.data.links['story-1']).toBeDefined();
        expect(response.data.links['story-2']).toBeDefined();

        // Verify date fields are present in the response
        const link: ISbLink = response.data.links['story-1'];
        expect(link).toHaveProperty('created_at');
        expect(link).toHaveProperty('published_at');
        expect(link).toHaveProperty('updated_at');

        // Verify the date formats
        const DATETIME_FORMAT = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
        expect(link.created_at).toMatch(DATETIME_FORMAT);
        expect(link.published_at).toMatch(DATETIME_FORMAT);
        expect(link.updated_at).toMatch(DATETIME_FORMAT);

        // Verify the API was called with correct parameters
        expect(mockGet).toHaveBeenCalledWith('/cdn/links', {
          cv: 0,
          token: 'test-token',
          version: 'draft',
          include_dates: 1,
        });
        expect(mockGet).toHaveBeenCalledTimes(1);
      });

      it('should handle links response without dates when include_dates is not set', async () => {
        const mockResponse = {
          data: {
            links: {
              'story-1': {
                id: 1,
                uuid: 'story-1-uuid',
                slug: 'story-1',
                name: 'Story 1',
                is_folder: false,
                parent_id: 0,
                published: true,
                position: 0,
                // No date fields
              },
            },
          },
          headers: {},
          status: 200,
        };

        const mockGet = vi.fn().mockResolvedValue(mockResponse);
        client.client.get = mockGet;

        const response = await client.get('cdn/links', { version: 'draft' });

        expect(response.data.links['story-1']).not.toHaveProperty('created_at');
        expect(response.data.links['story-1']).not.toHaveProperty('published_at');
        expect(response.data.links['story-1']).not.toHaveProperty('updated_at');
      });

      it('should handle errors gracefully', async () => {
        const mockGet = vi.fn().mockRejectedValue({
          status: 404,
        });
        client.client.get = mockGet;

        await expect(client.get('cdn/links', {
          version: 'draft',
        })).rejects.toMatchObject({
          status: 404,
        });
      });
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
    it('should resolve more than 50 relations correctly', async () => {
      // Create 60 UUIDs to exceed the 50 relation limit
      const TEST_UUIDS = Array.from({ length: 60 }, (_, i) => `test-uuid-${i}`);

      // Mock story with multiple relation fields
      const mockResponse = {
        data: {
          story: {
            content: {
              _uid: 'root-uid',
              component: 'page',
              items: TEST_UUIDS.slice(0, 30), // First 30 UUIDs
              otherItems: TEST_UUIDS.slice(30), // Next 30 UUIDs
            },
          },
          // Include rel_uuids but not rels to simulate API behavior
          rel_uuids: TEST_UUIDS,
        },
        headers: {},
        status: 200,
        statusText: 'OK',
      };

      // Create first chunk response (first 50 relations)
      const mockFirstChunkResponse = {
        data: {
          stories: TEST_UUIDS.slice(0, 50).map(uuid => ({
            uuid,
            name: `Story ${uuid}`,
            content: { component: 'test-component', _uid: uuid },
            full_slug: `stories/${uuid}`,
          })),
        },
        headers: {},
        status: 200,
        statusText: 'OK',
      };

      // Create second chunk response (remaining relations)
      const mockSecondChunkResponse = {
        data: {
          stories: TEST_UUIDS.slice(50).map(uuid => ({
            uuid,
            name: `Story ${uuid}`,
            content: { component: 'test-component', _uid: uuid },
            full_slug: `stories/${uuid}`,
          })),
        },
        headers: {},
        status: 200,
        statusText: 'OK',
      };

      // Setup the mock client's get method
      const mockGet = vi.fn()
        .mockImplementationOnce(() => Promise.resolve(mockResponse))
        .mockImplementationOnce(() => Promise.resolve(mockFirstChunkResponse))
        .mockImplementationOnce(() => Promise.resolve(mockSecondChunkResponse));

      // Replace the client's fetch instance
      client.client = {
        get: mockGet,
        post: vi.fn(),
        setFetchOptions: vi.fn(),
      };

      const result = await client.get('cdn/stories/test', {
        resolve_relations: ['page.items', 'page.otherItems'],
      });

      // Ensure all relations were resolved
      const story = result.data.story;
      expect(story.content.items).toBeInstanceOf(Array);
      expect(story.content.items.length).toBe(30);
      expect(story.content.otherItems).toBeInstanceOf(Array);
      expect(story.content.otherItems.length).toBe(30);

      // Check that first and last items from each array were properly resolved
      // First array items should be objects, not UUIDs
      expect(typeof story.content.items[0]).toBe('object');
      expect(story.content.items[0].uuid).toBe('test-uuid-0');
      expect(story.content.items[0].name).toBe('Story test-uuid-0');
      expect(story.content.items[0].content.component).toBe('test-component');

      // Last item in first array
      expect(typeof story.content.items[29]).toBe('object');
      expect(story.content.items[29].uuid).toBe('test-uuid-29');

      // First item in second array
      expect(typeof story.content.otherItems[0]).toBe('object');
      expect(story.content.otherItems[0].uuid).toBe('test-uuid-30');

      // Last item in second array
      expect(typeof story.content.otherItems[29]).toBe('object');
      expect(story.content.otherItems[29].uuid).toBe('test-uuid-59');

      // Ensure rel_uuids was removed after resolution
      expect(result.data.rel_uuids).toBeUndefined();

      // Verify the API was called correctly for chunking
      expect(mockGet).toHaveBeenCalledTimes(3);

      // Check the parameters in second call (first chunk)
      const firstChunkParams = mockGet.mock.calls[1][1];
      expect(firstChunkParams).toHaveProperty('by_uuids');
      expect(firstChunkParams.by_uuids).toContain('test-uuid-0');

      // Check the parameters in third call (second chunk)
      const secondChunkParams = mockGet.mock.calls[2][1];
      expect(secondChunkParams).toHaveProperty('by_uuids');
      expect(secondChunkParams.by_uuids).toContain('test-uuid-50');
    });

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

    it('should pass starts_with parameter when resolving relations and links', async () => {
      // Setup mocks
      const TEST_UUID = 'test-uuid';
      const STARTS_WITH = 'folder/';

      // Mock the throttle function that handles API calls
      const mockThrottle = vi.fn().mockResolvedValue({
        data: {
          story: { content: {} },
          rel_uuids: [TEST_UUID],
          link_uuids: [TEST_UUID],
        },
        status: 200,
      });

      client.throttle = mockThrottle;

      // Mock the resolveRelations and resolveLinks methods
      client.resolveRelations = vi.fn();
      client.resolveLinks = vi.fn();

      // Make the request with starts_with parameter
      await client.get('cdn/stories/test', {
        resolve_relations: 'component.field',
        resolve_links: '1',
        starts_with: STARTS_WITH,
      });

      // Verify params were passed correctly to relation and link resolution
      expect(client.resolveRelations).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ starts_with: STARTS_WITH }),
        expect.anything(),
      );

      expect(client.resolveLinks).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ starts_with: STARTS_WITH }),
        expect.anything(),
      );
    });
  });

  // eslint-disable-next-line test/prefer-lowercase-title
  describe('ISbStoryData interface implementation', () => {
    it('should validate a complete story object structure', () => {
      const storyData: ISbStoryData = {
        alternates: [],
        content: {
          _uid: 'test-uid',
          component: 'test',
        },
        created_at: '2024-01-01T00:00:00.000Z',
        deleted_at: undefined,
        full_slug: 'test/story',
        group_id: 'test-group',
        id: 1,
        is_startpage: false,
        lang: 'default',
        meta_data: {},
        name: 'Test Story',
        parent_id: null,
        position: 0,
        published_at: null,
        slug: 'test-story',
        sort_by_date: null,
        tag_list: [],
        uuid: 'test-uuid',
      };

      expect(storyData).toBeDefined();
      expect(storyData).toMatchObject({
        alternates: expect.any(Array),
        content: expect.objectContaining({
          _uid: expect.any(String),
          component: expect.any(String),
        }),
        created_at: expect.any(String),
        full_slug: expect.any(String),
        group_id: expect.any(String),
        id: expect.any(Number),
        lang: expect.any(String),
        name: expect.any(String),
        position: expect.any(Number),
        slug: expect.any(String),
        uuid: expect.any(String),
      });
    });

    it('should handle optional properties correctly', () => {
      const storyData: ISbStoryData = {
        alternates: [],
        content: {
          _uid: 'test-uid',
          component: 'test',
        },
        created_at: '2024-01-01T00:00:00.000Z',
        full_slug: 'test/story',
        group_id: 'test-group',
        id: 1,
        lang: 'default',
        meta_data: {},
        name: 'Test Story',
        position: 0,
        published_at: null,
        slug: 'test-story',
        sort_by_date: null,
        tag_list: [],
        uuid: 'test-uuid',
        parent_id: null,
        // Optional properties
        preview_token: {
          token: 'test-token',
          timestamp: '2024-01-01T00:00:00.000Z',
        },
        localized_paths: [
          {
            path: '/en/test',
            name: 'Test EN',
            lang: 'en',
            published: true,
          },
        ],
      };

      expect(storyData.preview_token).toBeDefined();
      expect(storyData.localized_paths).toBeDefined();
    });
  });

  describe('getStory', () => {
    it('should handle undefined resolve_relations parameter gracefully', async () => {
      const storySlug = 'test-story';
      const mockStoryResponse = {
        data: {
          story: {
            id: 123,
            uuid: 'test-uuid',
            name: 'Test Story',
            content: {
              _uid: 'test-uid',
              component: 'test',
              title: 'Test Title',
            },
          },
        },
        headers: {},
        status: 200,
      };

      // Mock the get method which getStory calls internally
      client.get = vi.fn().mockResolvedValue(mockStoryResponse);

      // Call getStory without resolve_relations
      const result = await client.getStory(storySlug, {
        version: 'published',
        // No resolve_relations parameter
      });

      // Verify the function executed without errors
      expect(result).toEqual(mockStoryResponse);

      // Verify that get was called with the right parameters
      expect(client.get).toHaveBeenCalledWith(
        `cdn/stories/${storySlug}`,
        {
          version: 'published',
          // resolve_level should not be added since resolve_relations was undefined
        },
        undefined,
      );
    });

    it('should add resolve_level when resolve_relations is provided', async () => {
      const storySlug = 'test-story';
      const mockStoryResponse = {
        data: {
          story: {
            id: 123,
            uuid: 'test-uuid',
            name: 'Test Story',
            content: {
              _uid: 'test-uid',
              component: 'test',
              title: 'Test Title',
            },
          },
        },
        headers: {},
        status: 200,
      };

      // Mock the get method
      client.get = vi.fn().mockResolvedValue(mockStoryResponse);

      // Call getStory with resolve_relations
      await client.getStory(storySlug, {
        version: 'published',
        resolve_relations: 'test.relation',
      });

      // Verify that get was called with resolve_level added
      expect(client.get).toHaveBeenCalledWith(
        `cdn/stories/${storySlug}`,
        {
          version: 'published',
          resolve_relations: 'test.relation',
          resolve_level: 2,
        },
        undefined,
      );
    });
  });
});
