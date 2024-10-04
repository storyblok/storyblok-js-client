import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ISbFetch } from './sbFetch';
import SbFetch from './sbFetch';
import { headersToObject } from '../tests/utils';

describe('sbFetch', () => {
  let sbFetch: SbFetch;
  const mockFetch = vi.fn();

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize', () => {
    sbFetch = new SbFetch({} as ISbFetch);
    expect(sbFetch).toBeInstanceOf(SbFetch);
  });

  describe('get', () => {
    it('should correctly construct URLs for GET requests', async () => {
      sbFetch = new SbFetch({
        baseURL: 'https://api.storyblok.com/v2/',
        fetch: mockFetch,
      } as ISbFetch);
      const response = new Response(JSON.stringify({ data: 'test' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
      mockFetch.mockResolvedValue(response);
      await sbFetch.get('test', {
        is_startpage: false,
        search_term: 'test',
      });
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.storyblok.com/v2/test?is_startpage=false&search_term=test',
        expect.anything(),
      );
    });
  });

  describe('post', () => {
    it('should handle POST requests correctly', async () => {
      const testPayload = { title: 'New Story' };
      const response = new Response(JSON.stringify({ data: 'test' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
      mockFetch.mockResolvedValue(response);
      await sbFetch.post('stories', testPayload);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.storyblok.com/v2/stories',
        {
          method: 'post',
          body: JSON.stringify(testPayload),
          headers: expect.any(Headers),
          signal: expect.any(AbortSignal),
        },
      );
    });

    it('should set specific headers for POST requests', async () => {
      sbFetch = new SbFetch({
        baseURL: 'https://api.storyblok.com/v2/',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        fetch: mockFetch,
      } as ISbFetch);
      const testPayload = { title: 'New Story' };
      const response = new Response(JSON.stringify({ data: 'test' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
      mockFetch.mockResolvedValue(response);

      await sbFetch.post('stories', testPayload);

      // Get the last call to fetch and extract the headers
      const lastCall = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
      const actualHeaders = headersToObject(lastCall[1].headers);
      expect(actualHeaders['content-type']).toBe('application/json');
    });
  });

  describe('put', () => {
    it('should handle PUT requests correctly', async () => {
      const testPayload = { title: 'Updated Story' };
      const response = new Response(JSON.stringify({ data: 'test' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
      mockFetch.mockResolvedValue(response);
      await sbFetch.put('stories/1', testPayload);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.storyblok.com/v2/stories/1',
        {
          method: 'put',
          body: JSON.stringify(testPayload),
          headers: expect.any(Headers),
          signal: expect.any(AbortSignal),
        },
      );
    });
  });

  describe('delete', () => {
    it('should handle DELETE requests correctly', async () => {
      const response = new Response(null, {
        status: 204, // Typically, DELETE operations might not return content
      });
      mockFetch.mockResolvedValue(response);
      await sbFetch.delete('stories/1', {});
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.storyblok.com/v2/stories/1',
        {
          method: 'delete',
          body: '{}', // Ensuring no body is sent
          headers: expect.any(Headers),
          signal: expect.any(AbortSignal),
        },
      );
    });
  });

  it('should handle network errors gracefully', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('Network Failure'));
    const sbFetch = new SbFetch({
      baseURL: 'https://api.example.com',
      headers: new Headers(),
      fetch: mockFetch,
    });

    // Assuming your implementation wraps the error message inside an object under `message`.
    const result = await sbFetch.get('/test', {});

    // Check if the error object format matches your implementation.
    expect(result).toEqual({
      message: expect.any(Error), // Checks if `message` is an instance of Error
    });

    // If you want to be more specific and check the message of the error:
    expect(result.message.message).toEqual('Network Failure'); // This path needs to match the structure you actually use.
  });
});
