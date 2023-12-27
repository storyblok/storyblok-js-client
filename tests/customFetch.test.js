import { expect, test, describe, beforeEach } from 'vitest'
import StoryblokClient from '../'

const generateJibberishWord = (length) => {
	const characters = 'abcdefghijklmnopqrstuvwxyz'
	let jibberishWord = ''

	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length)
		jibberishWord += characters.charAt(randomIndex)
	}

	return jibberishWord
}

const accessToken = process.env.VITE_ACCESS_TOKEN;
const oauthToken = process.env.VITE_OAUTH_TOKEN;
const spaceId = process.env.VITE_SPACE_ID;

describe('define environment variables', () => {
  test('Accessing Environment Variables', () => {
    expect(accessToken).toBeDefined();
    expect(oauthToken).toBeDefined();
    expect(spaceId).toBeDefined();
  });

  test('Accessing Environment Variables', () => {
    expect(accessToken).not.toEqual('');
    expect(oauthToken).not.toEqual('');
    expect(spaceId).not.toEqual('');
  });
})

describe('customFetch', () => {
	let client
  const url = `spaces/${process.env.VITE_SPACE_ID}/stories`

	beforeEach(() => {
		client = new StoryblokClient({
			oauthToken: process.env.VITE_OAUTH_TOKEN,
		})
	})

	test('should call GET method', async () => {
		const response = await client.customFetch(
			url,
			{
				method: 'GET',
				body: {},
			}
		)
		expect(response).toHaveProperty('data')
	})

	test('should call POST method', async () => {
		const jibberish = generateJibberishWord(8)
		const postObject = {
			story: {
				name: 'Test',
				slug: jibberish,
				content: {
					component: 'page',
					text: 'test',
				},
			},
		}
		const response = await client.customFetch(
			url,
			{
				method: 'POST',
				body: JSON.stringify(postObject),
			}
		)
		expect(response.data.story.id).toBeTruthy()
	})

	test('should return an error for invalid method', async () => {
		try {
			await client.customFetch(url, {
				method: 'INVALID',
			})
		} catch (error) {
			expect(error).toHaveProperty('message')
		}
	})

  test('should call GET method with config', async () => {
    const config = {
      timeout: 5000,
    };
  
    const response = await client.customFetch(
      url,
      {
        method: 'GET',
        body: {},
      },
      config
    );

    expect(response).toHaveProperty('data');
    expect(response.data.stories.length).toBeGreaterThan(0);
  });
})
