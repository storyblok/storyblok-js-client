/* eslint-disable no-undef */
import { expect, test } from 'vitest'
import StoryblokClient from '../'
import customSchema from './customSchema'
import {
	IMAGE_DATA,
	SPAN_WITH_RED_CLASS,
	LINK_DATA,
	EMAIL_LINK_DATA,
	LONG_TEXT_FOR_IMMUTABILITY_TEST,
	CUSTOM_ATTRIBUTE_DATA,
	LONG_TEXT_WITH_LINKS_SUB_SUP_SCRIPTS,
	LINK_WITH_ANCHOR_FOR_CUSTOM_SCHEMA,
	PARAGRAPH_WITH_ANCHOR_IN_THE_MIDDLE,
	PARAGRAPH_WITH_ANCHOR,
} from './constants/richTextResolver'

const TOKEN = 'w0yFvs04aKF2rpz6F8OfIQtt'

let client = new StoryblokClient({
	accessToken: TOKEN,
	cache: { type: 'memory', clear: 'auto' },
})

// get the resolver function from StoryblokClient
const resolver = client.richTextResolver

test('call render function without any argument return an empty string', () => {
	expect(resolver.render()).toBe('')
})

test('call render function with a incorrect object return an empty string', () => {
	expect(resolver.render({})).toBe('')
	expect(resolver.render({ test: [] })).toBe('')
})

test('call render function with an object.content equals an empty return an empty string', () => {
	expect(resolver.render({ content: [] })).toBe('')
})

test('styled mark to add span with red class', () => {
	expect(resolver.render(SPAN_WITH_RED_CLASS)).toBe('<span class="red">red text</span>')
})

test('horizontal_rule to generate hr tag', () => {
	const doc = {
		type: 'doc',
		content: [
			{
				type: 'horizontal_rule',
			},
		],
	}

	expect(resolver.render(doc)).toBe('<hr />')
})

test('hard_break to generate br tag', () => {
	const doc = {
		type: 'doc',
		content: [
			{
				type: 'hard_break',
			},
		],
	}

	expect(resolver.render(doc)).toBe('<br />')
})

test('image to generate img tag', () => {
	expect(resolver.render(IMAGE_DATA)).toBe('<img src="https://asset" />')
})

test('image to generate img tag with optimization', () => {
	const doc = {
		type: 'doc',
		content: [
			{
				type: 'image',
				attrs: {
					src: 'https://a.storyblok.com/f/000000/00a00a00a0/image-name.png',
				},
			},
		],
	}

	expect(resolver.render(doc, { optimizeImages: true })).toBe('<img src="https://a.storyblok.com/f/000000/00a00a00a0/image-name.png/m/" />')
})

test('link to generate a tag', () => {
	const result = resolver.render(LINK_DATA)
	const expected =
		'<a href="/link" target="_blank" uuid="300aeadc-c82d-4529-9484-f3f8f09cf9f5">link text</a>'

	expect(result).toBe(expected)
})

test('link to generate a tag with an email', () => {
	const result = resolver.render(EMAIL_LINK_DATA)
	const expected =
		'<a href="mailto:email@client.com" target="_blank" linktype="email">an email link</a>'

	expect(result).toBe(expected)
})

test('code_block to generate a pre and code tag', () => {
	const doc = {
		type: 'doc',
		content: [
			{
				type: 'code_block',
				content: [
					{
						text: 'code',
						type: 'text',
					},
				],
			},
		],
	}

	expect(resolver.render(doc)).toBe('<pre><code>code</code></pre>')
})

test('escape html marks from text', () => {
	const doc = {
		type: 'doc',
		content: [
			{
				type: 'paragraph',
				content: [
					{
						text: 'Simple phrases to test escapes:',
						type: 'text',
					},
				],
			},
			{
				type: 'bullet_list',
				content: [
					{
						type: 'list_item',
						content: [
							{
								type: 'paragraph',
								content: [
									{
										text: "A dummy apostrophe's test",
										type: 'text',
									},
								],
							},
						],
					},
					{
						type: 'list_item',
						content: [
							{
								type: 'paragraph',
								content: [
									{
										text: '<p>Just a tag</p>',
										type: 'text',
									},
								],
							},
						],
					},
					{
						type: 'list_item',
						content: [
							{
								type: 'paragraph',
								content: [
									{
										text: '<p>Dummy & test</p>',
										type: 'text',
									},
								],
							},
						],
					},
				],
			},
		],
	}

	expect(resolver.render(doc)).toBe(
		'<p>Simple phrases to test escapes:</p><ul><li><p>A dummy apostrophe&#39;s test</p></li><li><p>&lt;p&gt;Just a tag&lt;/p&gt;</p></li><li><p>&lt;p&gt;Dummy &amp; test&lt;/p&gt;</p></li></ul>'
	)
})

test('link to generate a tag with achor', () => {
	const doc = {
		type: 'doc',
		content: [
			{
				text: 'link text',
				type: 'text',
				marks: [
					{
						type: 'link',
						attrs: {
							href: '/link',
							target: '_blank',
							uuid: '300aeadc-c82d-4529-9484-f3f8f09cf9f5',
							anchor: 'anchor-text',
						},
					},
				],
			},
		],
	}

	const result = resolver.render(doc)
	const expected =
		'<a href="/link#anchor-text" target="_blank" uuid="300aeadc-c82d-4529-9484-f3f8f09cf9f5">link text</a>'

	expect(result).toBe(expected)
})

test('Complex and immutability test', () => {
	const result = resolver.render(LONG_TEXT_FOR_IMMUTABILITY_TEST)
	const expected =
		'<p><b>Lorem</b> ipsum, <strike>dolor</strike> sit amet <u>consectetur</u> adipisicing elit. <code>Eos architecto</code> asperiores temporibus <a href="/test/our-service#anchor-text" uuid="931e04b7-f701-4fe4-8ec0-78be0bee8809" target="_blank" linktype="story">suscipit harum </a>ut, fugit, cumque <a href="asdfsdfasf" target="_blank" linktype="url">molestiae </a>ratione non adipisci, <i>facilis</i> inventore optio dolores. Rem, perspiciatis <a href="/home" uuid="fc6a453f-9aa6-4a00-a22d-49c5878f7983" target="_self" linktype="story">deserunt!</a> Esse, maiores!</p>'

	expect(result).toBe(expected)
})

test('test with a custom schema from StoryblokRich', () => {
	const internalClient = new StoryblokClient({
		accessToken: TOKEN,
		richTextSchema: customSchema,
	})

	const result = internalClient.richTextResolver.render(LINK_WITH_ANCHOR_FOR_CUSTOM_SCHEMA)
	const expected =
		'<a href="/link%anchor-text" target="_blank" uuid="300aeadc-c82d-4529-9484-f3f8f09cf9f5">link text from custom schema</a>'

	expect(result).toBe(expected)
})

test('should render a custom attribute in a link tag', () => {
	const result = resolver.render(CUSTOM_ATTRIBUTE_DATA)
	const expected =
		'<a href="www.storyblok.com" uuid="300aeadc-c82d-4529-9484-f3f8f09cf9f5" target="_blank" linktype="url" rel="nofollow" title="nice test">A nice link with custom attr</a>'

	expect(result).toBe(expected)
})

test('should render a subscript', () => {
	const subscriptData = {
		type: 'paragraph',
		content: [
			{
				text: 'A Subscript text',
				type: 'text',
				marks: [
					{
						type: 'subscript'
					}
				]
			}
		]
	}

	const result = resolver.render(subscriptData)
	const expected = '<sub>A Subscript text</sub>'

	expect(result).toBe(expected)
})

test('should render a superscript', () => {
	const subscriptData = {
		type: 'paragraph',
		content: [
			{
				text: 'A superscript text',
				type: 'text',
				marks: [
					{
						type: 'superscript'
					}
				]
			}
		]
	}

	const result = resolver.render(subscriptData)
	const expected = '<sup>A superscript text</sup>'

	expect(result).toBe(expected)
})

test('should render an emoji', () => {
	const emojiData = {
    type: 'doc',
    content: [
			{
				type: 'paragraph',
				content: [
					{
						type: 'emoji',
						attrs: {
							name: 'smiley'
						}
					}
				]
			}
    ]
	}

	const result = resolver.render(emojiData)
	const expected = '<p><span data-type="emoji" data-name="smiley"></span></p>'

	expect(result).toBe(expected)
})

test('should render a text with links, subscripts and superscripts', () => {
	const result = resolver.render(LONG_TEXT_WITH_LINKS_SUB_SUP_SCRIPTS)
	const expected = '<p><b>Lorem Ipsum</b> is simply dummy text of the <a href="test.com" linktype="url" target="_self" title="test one" rel="test two">printing and typesetting industry</a>. Lorem Ipsum has been the industry&#39;s standard dummy text ever since the <sup>1500s</sup>, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the <sub>1960s</sub> with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like <sup>Aldus PageMaker</sup> including versions of <sub>Lorem Ipsum</sub>.</p>'

	expect(result).toBe(expected)
})

test('should render a h1 title with a anchor in the midlle of the text', () => {
	const sentenceWithAnchor = {
		type: 'doc',
		content: [
			{
				type: 'heading',
				attrs: {
					level: '1'
				},
				content: [
					{
						text: 'Title with ',
						type: 'text'
					},
					{
						text: 'Anchor',
						type: 'text',
						marks: [
							{
								type: 'anchor',
								attrs: {
									id: 'test1'
								}
							}
						]
					},
					{
						text: ' in the midle',
						type: 'text'
					}
				]
			}
		]
	}

	const result = resolver.render(sentenceWithAnchor)
	const expected = '<h1>Title with <span id="test1">Anchor</span> in the midle</h1>'

	expect(result).toBe(expected)
})

test('should render a anchor in the text', () => {
	const result = resolver.render(PARAGRAPH_WITH_ANCHOR)
	const expected = '<p><span id="test">Paragraph with anchor in the midle</span></p>'

	expect(result).toBe(expected)
})

test('should render a anchor in the middle of a text', () => {
	const result = resolver.render(PARAGRAPH_WITH_ANCHOR_IN_THE_MIDDLE)
	const expected = '<p>a long text with a super nice <span id="test2">anchor here</span>, and at the end of the text is a normal tag</p>'

	expect(result).toBe(expected)
})
