import StoryblokClient from 'storyblok-js-client';
import { beforeEach, describe, expect, it, vi } from 'vitest';

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('StoryblokClient', () => {
  let client: StoryblokClient;

  beforeEach(() => {
    // Setup default mocks
    client = new StoryblokClient({
      accessToken: process.env.VITE_ACCESS_TOKEN,
      cache: { type: 'memory', clear: 'auto' },
    });
  });
  // TODO: Uncomment when we have a valid token
  /* if (process.env.VITE_OAUTH_TOKEN) {
      describe('management API', () => {
        const spaceId = process.env.VITE_SPACE_ID
        describe('should return all spaces', async () => {
          const StoryblokManagement = new StoryblokClient({
            oauthToken: process.env.VITE_OAUTH_TOKEN,
          })
          const result = await StoryblokManagement.getAll(
            `spaces/${spaceId}/stories`
          )
          expect(result.length).toBeGreaterThan(0)
        })
      })
  } */

  describe('get function', () => {
    it('get(\'cdn/spaces/me\') should return the space information', async () => {
      const { data } = await client.get('cdn/spaces/me');
      expect(data.space.id).toBe(Number(process.env.VITE_SPACE_ID));
    });

    it('get(\'cdn/stories\') should return all stories', async () => {
      const { data } = await client.get('cdn/stories');
      expect(data.stories.length).toBeGreaterThan(0);
    });

    it('get(\'cdn/stories/testcontent-0\' should return the specific story', async () => {
      const { data } = await client.get('cdn/stories/testcontent-0');
      expect(data.story.slug).toBe('testcontent-0');
    });

    it('get(\'cdn/stories\' { starts_with: testcontent-0 } should return the specific story', async () => {
      const { data } = await client.get('cdn/stories', {
        starts_with: 'testcontent-0',
      });
      expect(data.stories.length).toBe(1);
    });

    it('get(\'cdn/stories/testcontent-draft\', { version: \'draft\' }) should return the specific story draft', async () => {
      const { data } = await client.get('cdn/stories/testcontent-draft', {
        version: 'draft',
      });
      expect(data.story.slug).toBe('testcontent-draft');
    });

    it('get(\'cdn/stories/testcontent-0\', { version: \'published\' }) should return the specific story published', async () => {
      const { data } = await client.get('cdn/stories/testcontent-0', {
        version: 'published',
      });
      expect(data.story.slug).toBe('testcontent-0');
    });

    it('cdn/stories/testcontent-0 should resolve author relations', async () => {
      const { data } = await client.get('cdn/stories/testcontent-0', {
        resolve_relations: 'root.author',
      });

      expect(data.story.content.author[0].slug).toBe('edgar-allan-poe');
    });

    it('get(\'cdn/stories\', { by_slugs: \'folder/*\' }) should return the specific story', async () => {
      const { data } = await client.get('cdn/stories', {
        by_slugs: 'folder/*',
      });
      expect(data.stories.length).toBeGreaterThan(0);
    });
  });

  describe('getAll function', () => {
    it('getAll(\'cdn/stories\') should return all stories', async () => {
      const result = await client.getAll('cdn/stories', {});
      expect(result.length).toBeGreaterThan(0);
    });

    it('getAll(\'cdn/stories\') should return all stories with filtered results', async () => {
      const result = await client.getAll('cdn/stories', {
        starts_with: 'testcontent-0',
      });
      expect(result.length).toBe(1);
    });

    it('getAll(\'cdn/stories\', filter_query: { __or: [{ category: { any_in_array: \'Category 1\' } }, { category: { any_in_array: \'Category 2\' } }]}) should return all stories with the specific filter applied', async () => {
      const result = await client.getAll('cdn/stories', {
        filter_query: {
          __or: [
            { category: { any_in_array: 'Category 1' } },
            { category: { any_in_array: 'Category 2' } },
          ],
        },
      });
      expect(result.length).toBeGreaterThan(0);
    });

    it('getAll(\'cdn/stories\', {by_slugs: \'folder/*\'}) should return all stories with the specific filter applied', async () => {
      const result = await client.getAll('cdn/stories', {
        by_slugs: 'folder/*',
      });
      expect(result.length).toBeGreaterThan(0);
    });

    it('getAll(\'cdn/links\') should return all links', async () => {
      const result = await client.getAll('cdn/links', {});
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('caching', () => {
    it('get(\'cdn/spaces/me\') should not be cached', async () => {
      const provider = client.cacheProvider();
      await provider.flush();
      await client.get('cdn/spaces/me');
      expect(Object.values(provider.getAll()).length).toBe(0);
    });

    it('get(\'cdn/stories\') should be cached when is a published version', async () => {
      const cacheVersion = client.cacheVersion();

      await client.get('cdn/stories');

      expect(cacheVersion).not.toBe(undefined);

      const newCacheVersion = client.cacheVersion();

      await client.get('cdn/stories');

      expect(newCacheVersion).toBe(client.cacheVersion());

      await client.get('cdn/stories');

      expect(newCacheVersion).toBe(client.cacheVersion());
    });

    it('should flush the cache when version: draft + clear: onpreview', async () => {
      client = new StoryblokClient({
        accessToken: process.env.VITE_ACCESS_TOKEN,
        cache: { type: 'memory', clear: 'onpreview' },
      });
      const mapi = new StoryblokClient({ oauthToken: process.env.VITE_OAUTH_TOKEN });
      const spaceId = process.env.VITE_SPACE_ID;

      client.cacheProvider = vi.fn().mockReturnValue({
        flush: vi.fn().mockResolvedValue(undefined),
      });

      // Setup scenario where draft version triggers cache flush
      const { data } = await client.get('cdn/stories/testcontent-0', { version: 'draft' }); // no cache, so won't trigger flush
      await client.get('cdn/stories/testcontent-0', { version: 'draft' }); // cached, but cv didn't change, so won't trigger flush
      await sleep(1000); // for TTL
      await mapi.put(`spaces/${spaceId}/stories/${data.story.id}`, { story: { ...data.story } }); // force generating a new cv
      await client.get('cdn/stories/testcontent-1', { version: 'draft' }); // call a new page to force retrieval of the new cv

      expect(client.cacheProvider().flush).toHaveBeenCalled();
    });

    it('should not flush the cache when version: published + clear: onpreview', async () => {
      client = new StoryblokClient({
        accessToken: process.env.VITE_ACCESS_TOKEN,
        version: 'published',
        cache: { type: 'memory', clear: 'onpreview' },
      });
      const mapi = new StoryblokClient({ oauthToken: process.env.VITE_OAUTH_TOKEN });
      const spaceId = process.env.VITE_SPACE_ID;

      client.cacheProvider = vi.fn().mockReturnValue({
        flush: vi.fn().mockResolvedValue(undefined),
      });

      // Setup scenario where draft version triggers cache flush
      const { data } = await client.get('cdn/stories/testcontent-0'); // no cache, so won't trigger flush
      await client.get('cdn/stories/testcontent-0'); // cached, but cv didn't change, so won't trigger flush
      await sleep(1000); // for TTL
      await mapi.put(`spaces/${spaceId}/stories/${data.story.id}`, { story: { ...data.story }, publish: 1 }); // force generating a new cv
      await client.get('cdn/stories/testcontent-1'); // call a new page to force retrieval of the new cv

      expect(client.cacheProvider().flush).not.toHaveBeenCalled();
    });

    it('should flush the cache when clear: auto, even when published', async () => {
      client = new StoryblokClient({
        accessToken: process.env.VITE_ACCESS_TOKEN,
        cache: { type: 'memory', clear: 'auto' },
      });
      const mapi = new StoryblokClient({ oauthToken: process.env.VITE_OAUTH_TOKEN });
      const spaceId = process.env.VITE_SPACE_ID;

      client.cacheProvider = vi.fn().mockReturnValue({
        flush: vi.fn().mockResolvedValue(undefined),
      });

      // Setup scenario where draft version triggers cache flush
      const { data } = await client.get('cdn/stories/testcontent-0'); // no cache, so won't trigger flush
      await client.get('cdn/stories/testcontent-0'); // cached, but cv didn't change, so won't trigger flush
      await sleep(1000); // for TTL
      await mapi.put(`spaces/${spaceId}/stories/${data.story.id}`, { story: { ...data.story }, publish: 1 }); // force generating a new cv
      await client.get('cdn/stories/testcontent-1'); // call a new page to force retrieval of the new cv

      expect(client.cacheProvider().flush).toHaveBeenCalled();
    });
  });
});
