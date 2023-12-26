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

console.log('test env =>', process.env)

describe.skip('define environment variables', () => {
  test('Accessing Environment Variables', () => {
    const accessToken = process.env.VITE_ACCESS_TOKEN;
    const oauthToken = process.env.VITE_OAUTH_TOKEN;
    const spaceId = process.env.VITE_SPACE_ID;

    expect(accessToken).not.toEqual('');
    expect(oauthToken).not.toEqual('');
    expect(spaceId).not.toEqual('');
  });
})

describe.skip('customFetch', () => {
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
})