/* eslint-disable no-undef */
import { expect, test, describe } from 'vitest'
import StoryblokClient from '../'

let Storyblok = new StoryblokClient({
	accessToken: 'w0yFvs04aKF2rpz6F8OfIQtt',
	cache: { type: 'memory', clear: 'auto' },
})

describe('test resolvingLinks', () => {
	test('resolvingLinks should insert links of single story', async () => {
		const singleStory = {
			story: {
				content: {
					component: 'news',
					_uid: '567',
					author: {
						fieldtype: 'multilink',
						linktype: 'story',
						id: 'e101b4fc-3736-4f82-8c8e-788e38d5d286',
					},
				},
			},
			links: [
				{ uuid: 'e101b4fc-3736-4f82-8c8e-788e38d5d286', name: 'Joe Doe' },
			],
		}
		await Storyblok.resolveStories(singleStory, {
			version: 'published',
			resolve_links: 'story',
		})

		expect(singleStory.story.content.author.story.name).toBe('Joe Doe')
	})

	test('resolvingLinks should insert links of multiple stories with 2 extra api calls', async () => {
		const uuids = ['e101b4fc-3736-4f82-8c8e-788e38d5d286']
		for (var i = 0; i < 100; i++) {
			uuids.push('e101b4fc-3736-4f82-8c8e-788e38d5d286-' + i)
		}
		const singleStory = {
			stories: [
				{
					content: {
						component: 'news',
						_uid: '567',
						author: {
							fieldtype: 'multilink',
							linktype: 'story',
							id: 'e101b4fc-3736-4f82-8c8e-788e38d5d286',
						},
					},
				},
			],
			link_uuids: uuids,
		}
		await Storyblok.resolveStories(singleStory, {
			version: 'published',
			resolve_links: 'story',
		})

		expect(singleStory.stories[0].content.author.story.name).toBe(
			'Testcontent 24'
		)
	})
})
