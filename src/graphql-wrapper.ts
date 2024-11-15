import { STORYBLOK_GRAPQL_API } from './constants';

/**
 * Wrapper for Storyblok GraphQL API
 *
 * @param query string
 * @param accessToken string
 * @param version 'draft' | 'published'
 * @param variables Record<string, unknown>
 * @returns Promise<{ data: object }>
 *
 * @throws Error
 */
export async function graph(
  query: string,
  accessToken: string,
  version: 'draft' | 'published' = 'draft',
  variables?: Record<string, unknown>,
): Promise<{ data: object }> {
  let response;
  try {
    response = await fetch(STORYBLOK_GRAPQL_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': accessToken,
        'version': version,
      },
      body: JSON.stringify({ query, variables }),
    });
  }
  catch (error) {
    throw new Error(`GraphQL request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  if (!response.ok) {
    throw new Error(`GraphQL request failed with status ${response.status}`);
  }

  return response.json();
}
