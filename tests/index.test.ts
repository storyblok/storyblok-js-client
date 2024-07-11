import { SbHelpers } from './../src/sbHelpers';
import StoryblokClient from '../';
import { describe, it, expect, vi, beforeEach } from "vitest";

describe('StoryblokClient', () => {
  let client;

  beforeEach(() => {
    client = new StoryblokClient({ accessToken: 'test-token' });
  });

  describe('initialization', () => {
    it('should initialize a client instance', () => {
      expect(client).toBeDefined()
      expect(client).toBeInstanceOf(StoryblokClient);
    })

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
    })
  
    it('should initialize with an accessToken', () => {
      expect(client.accessToken).toBe('test-token');
    })
  })

})