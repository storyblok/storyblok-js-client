import { expect, test, describe, beforeEach } from 'vitest'
import StoryblokClient from 'src/index.ts'

describe('customFetch', () => {
	let client

	beforeEach(() => {
		client = new StoryblokClient({
			accessToken: process.env.VITE_ACCESS_TOKEN,
			oauthToken: process.env.VITE_OAUTH_TOKEN,
		})
	})

	test('should call GET method', async () => {
		const response = await client.customFetch(
			`spaces/${process.env.VITE_SPACE_ID}/stories`,
			{
				method: 'GET',
				body: {},
			}
		)
		expect(response).toHaveProperty('data')
	})

	// Uncomment and adjust the following test if your API supports POST method for the endpoint
	// test('should call POST method', async () => {
	//   const response = await client.customFetch(`spaces/${process.env.VITE_SPACE_ID}/stories`, {
	//     method: 'POST',
	//     body: JSON.stringify({ key: 'value' }),
	//   })
	//   expect(response).toHaveProperty('data')
	// })

	test('should return an error for invalid method', async () => {
		try {
			await client.customFetch(`spaces/${process.env.VITE_SPACE_ID}/stories`, {
				method: 'INVALID',
			})
		} catch (error) {
			expect(error).toHaveProperty('message')
		}
	})
})
