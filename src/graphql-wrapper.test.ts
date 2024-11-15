import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import createFetchMock from 'vitest-fetch-mock';

describe('test graphql wrapper', () => {
  const query = `
    query {
      PageItem(id: "home") {
        name
        content {
          _uid
          component
        }
      }
    }
  `;

  const accessToken = 'test-access-token';
  const version = 'draft';
  const variables = { id: '123' };

  beforeAll(() => {
    const fetchMocker = createFetchMock(vi);
    // sets globalThis.fetch and globalThis.fetchMock to our mocked version
    fetchMocker.enableMocks();
  });

  beforeEach(() => {
    fetch.resetMocks();
  });

  it('should return data when the request is successful', async () => {
    fetch.mockResponseOnce(JSON.stringify({ data: { test: 'test' } }));

    const { graph } = await import('./graphql-wrapper');
    const response = await graph(query, accessToken, version, variables);

    expect(response).toEqual({ data: { test: 'test' } });
  });

  it('should throw an error when the request fails', async () => {
    fetch.mockRejectOnce(new Error('test error'));

    const { graph } = await import('./graphql-wrapper');

    try {
      await graph(query, accessToken, version, variables);
    }
    catch (error) {
      expect(error.message).toBe('GraphQL request failed: test error');
    }
  });

  it('should throw an error when the response status is not ok', async () => {
    fetch.mockResponseOnce(JSON.stringify({ data: { test: 'test' } }), { status: 401 });

    const { graph } = await import('./graphql-wrapper');

    try {
      await graph(query, accessToken, version, variables);
    }
    catch (error) {
      expect(error.message).toBe('GraphQL request failed with status 401');
    }
  });

  it('should throw an error when the response is not JSON', async () => {
    fetch.mockResponseOnce('not json', { status: 200 });

    const { graph } = await import('./graphql-wrapper');

    try {
      await graph(query, accessToken, version, variables);
    }
    catch (error) {
      expect(error.message).toContain('Unexpected token');
    }
  });
});
