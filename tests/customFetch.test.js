import { expect, test, describe } from 'vitest'
import StoryblokClient from '../'

const accessToken = import.meta.env.VITE_ACCESS_TOKEN
const oauthToken = import.meta.env.VITE_OAUTH_TOKEN
const spaceId = import.meta.env.VITE_SPACE_ID

const generateJibberishWord = (length) => {
	const characters = 'abcdefghijklmnopqrstuvwxyz'
	let jibberishWord = ''

	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length)
		jibberishWord += characters.charAt(randomIndex)
	}

	return jibberishWord
}

describe('test custom fetch calls', () => {
	test('call with GET', async () => {
		const client = new StoryblokClient({
			accessToken,
			fetch: {
				method: 'GET',
			},
		})

		try {
			const res = await client.customFetch('cdn/stories')
			expect(res.data.stories).toHaveLength(res.data.stories.length)
		} catch (err) {
			console.error(err)
		}
	})

	test('call with POST', async () => {
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
		const client = new StoryblokClient({
			accessToken,
			oauthToken,
			fetch: {
				method: 'POST',
				body: JSON.stringify(postObject),
			},
		})

		try {
			const res = await client.customFetch(`spaces/${spaceId}/stories`)
			expect(res.data.story.id).toBeTruthy()
		} catch (err) {
			console.error('err =>', err)
		}
	})
})
