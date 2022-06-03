/* eslint-disable no-undef */
jest.setTimeout(60000)

import StoryblokClient from '../source/index'

let Storyblok = new StoryblokClient({
	accessToken: 'w0yFvs04aKF2rpz6F8OfIQtt',
	cache: { type: 'memory', clear: 'auto' },
})

describe('test cache version', () => {
	test('get(\'cdn/stories\') should set the cache version', async () => {
		const result = await Storyblok.get('cdn/stories')
		const cacheVersion = JSON.parse(JSON.stringify(Storyblok.cacheVersions()))

		expect(cacheVersion['w0yFvs04aKF2rpz6F8OfIQtt']).toBe(result.data.cv)
	})
})
