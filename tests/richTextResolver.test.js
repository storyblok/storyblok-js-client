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
  TEXT_COLOR_DATA,
  HIGLIGHT_COLOR_DATA,
  BOLD_TEXT,
  TEXT_WITH_EMOJI,
  TEXT_WITH_EMOJI_VIA_FALLBACKIMAGE,
  TEXT_WITH_COLORS_MISSING_PARAMETERS,
  TEXT_MISSING_PARAMETERS,
  TEXT_WITH_BROKEN_LINK,
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
  expect(resolver.render(SPAN_WITH_RED_CLASS)).toBe(
    '<span class="red">red text</span>',
  )
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

const docWithImage = {
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

test('image to generate img tag with optimization', () => {
  expect(resolver.render(docWithImage, { optimizeImages: true })).toBe(
    '<img src="https://a.storyblok.com/f/000000/00a00a00a0/image-name.png/m/" />',
  )
})

test('image to generate img tag with optimization and loading lazy', () => {
  expect(
    resolver.render(docWithImage, { optimizeImages: { loading: 'lazy' } }),
  ).toBe(
    '<img loading="lazy" src="https://a.storyblok.com/f/000000/00a00a00a0/image-name.png/m/" />',
  )
})

test('image to generate img tag with optimization and width', () => {
  expect(
    resolver.render(docWithImage, { optimizeImages: { width: 500 } }),
  ).toBe(
    '<img width="500" src="https://a.storyblok.com/f/000000/00a00a00a0/image-name.png/m/500x0" />',
  )
})

test('image to generate img tag with optimization and height', () => {
  expect(
    resolver.render(docWithImage, { optimizeImages: { height: 350 } }),
  ).toBe(
    '<img height="350" src="https://a.storyblok.com/f/000000/00a00a00a0/image-name.png/m/0x350" />',
  )
})

test('image to generate img tag with optimization and custom class', () => {
  expect(
    resolver.render(docWithImage, { optimizeImages: { class: 'w-full my-8' } }),
  ).toBe(
    '<img class="w-full my-8" src="https://a.storyblok.com/f/000000/00a00a00a0/image-name.png/m/" />',
  )

  expect(resolver.render(docWithImage, { optimizeImages: { class: '' } })).toBe(
    '<img src="https://a.storyblok.com/f/000000/00a00a00a0/image-name.png/m/" />',
  )
})

test('image to generate img tag with optimization and filter blur', () => {
  expect(
    resolver.render(docWithImage, {
      optimizeImages: { filters: { blur: 10 } },
    }),
  ).toBe(
    '<img src="https://a.storyblok.com/f/000000/00a00a00a0/image-name.png/m/0x0/filters:blur(10)" />',
  )
})

test('image to generate img tag with optimization and filter brightness', () => {
  expect(
    resolver.render(docWithImage, {
      optimizeImages: { filters: { brightness: 15 } },
    }),
  ).toBe(
    '<img src="https://a.storyblok.com/f/000000/00a00a00a0/image-name.png/m/0x0/filters:brightness(15)" />',
  )
})

test('image to generate img tag with optimization and filter fill', () => {
  expect(
    resolver.render(docWithImage, {
      optimizeImages: { filters: { fill: 'transparent' } },
    }),
  ).toBe(
    '<img src="https://a.storyblok.com/f/000000/00a00a00a0/image-name.png/m/0x0/filters:fill(transparent)" />',
  )

  expect(
    resolver.render(docWithImage, {
      optimizeImages: { filters: { fill: 'FFCC99' } },
    }),
  ).toBe(
    '<img src="https://a.storyblok.com/f/000000/00a00a00a0/image-name.png/m/0x0/filters:fill(FFCC99)" />',
  )

  expect(
    resolver.render(docWithImage, {
      optimizeImages: { filters: { fill: 'INVALID' } },
    }),
  ).toBe(
    '<img src="https://a.storyblok.com/f/000000/00a00a00a0/image-name.png/m/" />',
  )
})

test('image to generate img tag with optimization and filter format', () => {
  expect(
    resolver.render(docWithImage, {
      optimizeImages: { filters: { format: 'png' } },
    }),
  ).toBe(
    '<img src="https://a.storyblok.com/f/000000/00a00a00a0/image-name.png/m/0x0/filters:format(png)" />',
  )

  expect(
    resolver.render(docWithImage, {
      optimizeImages: { filters: { format: 'webp' } },
    }),
  ).toBe(
    '<img src="https://a.storyblok.com/f/000000/00a00a00a0/image-name.png/m/0x0/filters:format(webp)" />',
  )

  expect(
    resolver.render(docWithImage, {
      optimizeImages: { filters: { format: 'jpeg' } },
    }),
  ).toBe(
    '<img src="https://a.storyblok.com/f/000000/00a00a00a0/image-name.png/m/0x0/filters:format(jpeg)" />',
  )

  expect(
    resolver.render(docWithImage, {
      optimizeImages: { filters: { format: 'invalidFormat' } },
    }),
  ).toBe(
    '<img src="https://a.storyblok.com/f/000000/00a00a00a0/image-name.png/m/" />',
  )
})

test('image to generate img tag with optimization and filter grayscale', () => {
  expect(
    resolver.render(docWithImage, {
      optimizeImages: { filters: { grayscale: true } },
    }),
  ).toBe(
    '<img src="https://a.storyblok.com/f/000000/00a00a00a0/image-name.png/m/0x0/filters:grayscale()" />',
  )
})

test('image to generate img tag with optimization and filter quality', () => {
  expect(
    resolver.render(docWithImage, {
      optimizeImages: { filters: { quality: 90 } },
    }),
  ).toBe(
    '<img src="https://a.storyblok.com/f/000000/00a00a00a0/image-name.png/m/0x0/filters:quality(90)" />',
  )
})

test('image to generate img tag with optimization and filter rotate', () => {
  expect(
    resolver.render(docWithImage, {
      optimizeImages: { filters: { rotate: 90 } },
    }),
  ).toBe(
    '<img src="https://a.storyblok.com/f/000000/00a00a00a0/image-name.png/m/0x0/filters:rotate(90)" />',
  )
  expect(
    resolver.render(docWithImage, {
      optimizeImages: { filters: { rotate: 180 } },
    }),
  ).toBe(
    '<img src="https://a.storyblok.com/f/000000/00a00a00a0/image-name.png/m/0x0/filters:rotate(180)" />',
  )
  expect(
    resolver.render(docWithImage, {
      optimizeImages: { filters: { rotate: 270 } },
    }),
  ).toBe(
    '<img src="https://a.storyblok.com/f/000000/00a00a00a0/image-name.png/m/0x0/filters:rotate(270)" />',
  )
  expect(
    resolver.render(docWithImage, {
      optimizeImages: { filters: { rotate: 9999 } },
    }),
  ).toBe(
    '<img src="https://a.storyblok.com/f/000000/00a00a00a0/image-name.png/m/" />',
  )
})

test('image to generate img tag with optimization and srcset', () => {
  expect(
    resolver.render(docWithImage, {
      optimizeImages: { srcset: [360, 1024, 1500] },
    }),
  ).toBe(
    '<img srcset="//a.storyblok.com/f/000000/00a00a00a0/image-name.png/m/360x0 360w, //a.storyblok.com/f/000000/00a00a00a0/image-name.png/m/1024x0 1024w, //a.storyblok.com/f/000000/00a00a00a0/image-name.png/m/1500x0 1500w" src="https://a.storyblok.com/f/000000/00a00a00a0/image-name.png/m/" />',
  )

  expect(
    resolver.render(docWithImage, {
      optimizeImages: { srcset: [[360, 360], 1024, 1500] },
    }),
  ).toBe(
    '<img srcset="//a.storyblok.com/f/000000/00a00a00a0/image-name.png/m/360x360 360w, //a.storyblok.com/f/000000/00a00a00a0/image-name.png/m/1024x0 1024w, //a.storyblok.com/f/000000/00a00a00a0/image-name.png/m/1500x0 1500w" src="https://a.storyblok.com/f/000000/00a00a00a0/image-name.png/m/" />',
  )
})

test('image to generate img tag with optimization and sizes', () => {
  expect(
    resolver.render(docWithImage, {
      optimizeImages: {
        sizes: [
          '(max-width: 767px) 100vw',
          '(max-width: 1024px) 768px',
          '1500px',
        ],
      },
    }),
  ).toBe(
    '<img sizes="(max-width: 767px) 100vw, (max-width: 1024px) 768px, 1500px" src="https://a.storyblok.com/f/000000/00a00a00a0/image-name.png/m/" />',
  )
})

test('image to generate img tag with optimization and srcset and sizes', () => {
  expect(
    resolver.render(docWithImage, {
      optimizeImages: {
        srcset: [360, 1024, 1500],
        sizes: [
          '(max-width: 767px) 100vw',
          '(max-width: 1024px) 768px',
          '1500px',
        ],
      },
    }),
  ).toBe(
    '<img srcset="//a.storyblok.com/f/000000/00a00a00a0/image-name.png/m/360x0 360w, //a.storyblok.com/f/000000/00a00a00a0/image-name.png/m/1024x0 1024w, //a.storyblok.com/f/000000/00a00a00a0/image-name.png/m/1500x0 1500w" sizes="(max-width: 767px) 100vw, (max-width: 1024px) 768px, 1500px" src="https://a.storyblok.com/f/000000/00a00a00a0/image-name.png/m/" />',
  )
})

test('image to generate img tag with optimization and multiple options', () => {
  const options = {
    optimizeImages: {
      loading: 'lazy',
      class: 'w-full',
      width: 640,
      height: 360,
      filters: {
        blur: 1,
        brightness: 5,
        fill: 'transparent',
        format: 'webp',
        grayscale: true,
        quality: 95,
        rotate: 180,
      },
      srcset: [360, 1024, 1500],
      sizes: [
        '(max-width: 767px) 100vw',
        '(max-width: 1024px) 768px',
        '1500px',
      ],
    },
  }

  expect(resolver.render(docWithImage, options)).toBe(
    '<img srcset="//a.storyblok.com/f/000000/00a00a00a0/image-name.png/m/360x0/filters:blur(1):brightness(5):fill(transparent):format(webp):grayscale():quality(95):rotate(180) 360w, //a.storyblok.com/f/000000/00a00a00a0/image-name.png/m/1024x0/filters:blur(1):brightness(5):fill(transparent):format(webp):grayscale():quality(95):rotate(180) 1024w, //a.storyblok.com/f/000000/00a00a00a0/image-name.png/m/1500x0/filters:blur(1):brightness(5):fill(transparent):format(webp):grayscale():quality(95):rotate(180) 1500w" sizes="(max-width: 767px) 100vw, (max-width: 1024px) 768px, 1500px" width="640" height="360" loading="lazy" class="w-full" src="https://a.storyblok.com/f/000000/00a00a00a0/image-name.png/m/640x360/filters:blur(1):brightness(5):fill(transparent):format(webp):grayscale():quality(95):rotate(180)" />',
  )
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
    '<a href="mailto:email@client.com" target="_blank">an email link</a>'

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
    '<p>Simple phrases to test escapes:</p><ul><li><p>A dummy apostrophe&#39;s test</p></li><li><p>&lt;p&gt;Just a tag&lt;/p&gt;</p></li><li><p>&lt;p&gt;Dummy &amp; test&lt;/p&gt;</p></li></ul>',
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
    '<p><b>Lorem</b> ipsum, <s>dolor</s> sit amet <u>consectetur</u> adipisicing elit. <code>Eos architecto</code> asperiores temporibus <a href="/test/our-service#anchor-text" uuid="931e04b7-f701-4fe4-8ec0-78be0bee8809" target="_blank">suscipit harum </a>ut, fugit, cumque <a href="asdfsdfasf" target="_blank">molestiae </a>ratione non adipisci, <i>facilis</i> inventore optio dolores. Rem, perspiciatis <a href="/home" uuid="fc6a453f-9aa6-4a00-a22d-49c5878f7983" target="_self">deserunt!</a> Esse, maiores!</p>'

  expect(result).toBe(expected)
})

test('test with a custom schema from StoryblokRich', () => {
  const internalClient = new StoryblokClient({
    accessToken: TOKEN,
    richTextSchema: customSchema,
  })

  const result = internalClient.richTextResolver.render(
    LINK_WITH_ANCHOR_FOR_CUSTOM_SCHEMA,
  )
  const expected =
    '<a href="/link%anchor-text" target="_blank" uuid="300aeadc-c82d-4529-9484-f3f8f09cf9f5">link text from custom schema</a>'

  expect(result).toBe(expected)
})

test('should render a custom attribute in a link tag', () => {
  const result = resolver.render(CUSTOM_ATTRIBUTE_DATA)
  const expected =
    '<a href="www.storyblok.com" uuid="300aeadc-c82d-4529-9484-f3f8f09cf9f5" target="_blank" rel="nofollow" title="nice test">A nice link with custom attr</a>'

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
            type: 'subscript',
          },
        ],
      },
    ],
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
            type: 'superscript',
          },
        ],
      },
    ],
  }

  const result = resolver.render(subscriptData)
  const expected = '<sup>A superscript text</sup>'

  expect(result).toBe(expected)
})

test('should render a text with a emoji', () => {
  const result = resolver.render(TEXT_WITH_EMOJI)
  const expected =
    '<p>Text with a emoji in the end <span data-type="emoji" data-name="smile" emoji="😄">😄</span></p>'

  expect(result).toBe(expected)
})

test('should render a emoji with falbackimage', () => {
  const result = resolver.render(TEXT_WITH_EMOJI_VIA_FALLBACKIMAGE)
  const expected =
    '<p>Text with a emoji in the end <span data-type="emoji" data-name="trollface"><img src="https://github.githubassets.com/images/icons/emoji/trollface.png" draggable="false" loading="lazy" align="absmiddle" /></span></p>'

  expect(result).toBe(expected)
})

test('should render a text with links, subscripts and superscripts', () => {
  const result = resolver.render(LONG_TEXT_WITH_LINKS_SUB_SUP_SCRIPTS)
  const expected =
    '<p><b>Lorem Ipsum</b> is simply dummy text of the <a href="test.com" target="_self" title="test one" rel="test two">printing and typesetting industry</a>. Lorem Ipsum has been the industry&#39;s standard dummy text ever since the <sup>1500s</sup>, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the <sub>1960s</sub> with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like <sup>Aldus PageMaker</sup> including versions of <sub>Lorem Ipsum</sub>.</p>'

  expect(result).toBe(expected)
})

test('should render a h1 title with a anchor in the middle of the text', () => {
  const sentenceWithAnchor = {
    type: 'doc',
    content: [
      {
        type: 'heading',
        attrs: {
          level: '1',
        },
        content: [
          {
            text: 'Title with ',
            type: 'text',
          },
          {
            text: 'Anchor',
            type: 'text',
            marks: [
              {
                type: 'anchor',
                attrs: {
                  id: 'test1',
                },
              },
            ],
          },
          {
            text: ' in the midle',
            type: 'text',
          },
        ],
      },
    ],
  }

  const result = resolver.render(sentenceWithAnchor)
  const expected =
    '<h1>Title with <span id="test1">Anchor</span> in the midle</h1>'
  expect(result).toBe(expected)
})

test('should render a text with text color', () => {
  const result = resolver.render(TEXT_COLOR_DATA)
  const expected = '<span style="color:#E72929">Colored text</span>'

  expect(result).toBe(expected)
})

test('should render a anchor in the text', () => {
  const result = resolver.render(PARAGRAPH_WITH_ANCHOR)
  const expected =
    '<p><span id="test">Paragraph with anchor in the midle</span></p>'

  expect(result).toBe(expected)
})

test('should render a text with highlight color', () => {
  const result = resolver.render(HIGLIGHT_COLOR_DATA)
  const expected =
    '<span style="background-color:#E72929;">Highlighted text</span>'

  expect(result).toBe(expected)
})

test('should render a anchor in the middle of a text', () => {
  const result = resolver.render(PARAGRAPH_WITH_ANCHOR_IN_THE_MIDDLE)
  const expected =
    '<p>a long text with a super nice <span id="test2">anchor here</span>, and at the end of the text is a normal tag</p>'

  expect(result).toBe(expected)
})

test('should render a text with bold', () => {
  const result = resolver.render(BOLD_TEXT)
  const expected = '<b>Lorem Ipsum</b>'

  expect(result).toBe(expected)
})

test('should not render atributes when they are null or empty string', () => {
  const result = resolver.render(TEXT_WITH_COLORS_MISSING_PARAMETERS)

  const expected =
    '<p>Text with highlight colors. And another text with text color.</p>'

  expect(result).toBe(expected)
})

test('should not render atributes when they are undefined or broken', () => {
  const result = resolver.render(TEXT_MISSING_PARAMETERS)

  const expected =
    '<p>Text with highlight colors. And another text with text color.</p><p>Text with highlight colors. And another text with text color.</p>'

  expect(result).toBe(expected)
})

test('should escape ampersand in link attribute values', () => {
  const data = {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            text: 'test',
            type: 'text',
            marks: [
              {
                type: 'link',
                attrs: {
                  href: 'https://www.storyblok.com/?foo=bar&bar=foo',
                  uuid: null,
                  anchor: null,
                  target: '_self',
                  linktype: 'url',
                },
              },
            ],
          },
        ],
      },
    ],
  }

  const result = resolver.render(data)

  const expected =
    '<p><a href="https://www.storyblok.com/?foo=bar&amp;bar=foo" target="_self">test</a></p>'

  expect(result).toBe(expected)
})

test('should not render empty links', () => {
  const result = resolver.render(TEXT_WITH_BROKEN_LINK)

  const expected =
    '<p><span style="color:rgb(23, 43, 77)">...</span><br /><a href="...">...</a><br />...</p>'
  expect(result).toBe(expected)
})
