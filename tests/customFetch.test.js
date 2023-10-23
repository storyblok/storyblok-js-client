import { expect, test, describe } from 'vitest'
import StoryblokClient from '../'

const accessToken = $VITE_ACCESS_TOKEN
const oauthToken = $VITE_OAUTH_TOKEN
const spaceId = $VITE_SPACE_ID

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
		})

		try {
			const res = await client.customFetch('cdn/stories', null, {
				method: 'GET',
			})
			expect(res.data.stories).toHaveLength(res.data.stories.length)
		} catch (err) {
			console.error(err)
		}
	})

	test('call with POST', async () => {
		const client = new StoryblokClient({
			accessToken,
			oauthToken,
		})

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
		try {
			const res = await client.customFetch(
				`spaces/${spaceId}/stories`,
				postObject,
				{
					method: 'POST',
				}
			)
			expect(res.data.story.id).toBeTruthy()
		} catch (err) {
			console.error('err =>', err)
		}
	})
})
