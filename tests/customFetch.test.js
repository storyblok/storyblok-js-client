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
			`spaces/${process.env.VITE_SPACE_ID}/stories`,
			{
				method: 'POST',
				body: JSON.stringify(postObject),
			}
		)
		expect(response.data.story.id).toBeTruthy()
	})

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
