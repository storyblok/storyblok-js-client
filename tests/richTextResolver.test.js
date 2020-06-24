const RichTextResolver = require('../source/richTextResolver')

let resolver = new RichTextResolver()

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
  const doc = {
    type: 'doc',
    content: [
      {
        text: 'red text',
        type: 'text',
        marks: [
          {
            type: 'styled',
            attrs: {
              class: 'red'
            }
          }
        ]
      }
    ]
  }

  expect(resolver.render(doc)).toBe('<span class="red">red text</span>')
})

test('horizontal_rule to generate hr tag', () => {
  const doc = {
    type: 'doc',
    content: [
      {
        type: 'horizontal_rule'
      }
    ]
  }

  expect(resolver.render(doc)).toBe('<hr />')
})

test('hard_break to generate br tag', () => {
  const doc = {
    type: 'doc',
    content: [
      {
        type: 'hard_break'
      }
    ]
  }

  expect(resolver.render(doc)).toBe('<br />')
})

test('image to generate img tag', () => {
  const doc = {
    type: 'doc',
    content: [
      {
        type: 'image',
        attrs: {
          src: 'https://asset'
        }
      }
    ]
  }

  expect(resolver.render(doc)).toBe('<img src="https://asset" />')
})

test('link to generate a tag', () => {
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
              uuid: '300aeadc-c82d-4529-9484-f3f8f09cf9f5'
            }
          }
        ]
      }
    ]
  }
  const result = resolver.render(doc)
  const expected = '<a href="/link" target="_blank" uuid="300aeadc-c82d-4529-9484-f3f8f09cf9f5">link text</a>'

  expect(result).toBe(expected)
})

test('link to generate a tag with an email', () => {
  const doc = {
    type: 'doc',
    content: [
      {
        text: 'an email link',
        type: 'text',
        marks: [
          {
            type: 'link',
            attrs: {
              href: 'email@client.com',
              target: '_blank',
              uuid: null,
              linktype: 'email'
            }
          }
        ]
      }
    ]
  }

  const result = resolver.render(doc)
  const expected = '<a href="mailto:email@client.com" target="_blank" linktype="email">an email link</a>'

  expect(result).toBe(expected)
})

test('code_block to generate a pre and code tag', () => {
  const doc = {
    type: 'doc',
    content: [
      {
        type: 'code_block',
        content: [{
          text: 'code',
          type: 'text'
        }]
      }
    ]
  }

  expect(resolver.render(doc)).toBe('<pre><code>code</code></pre>')
})

test('escape html marks from text', () => {
  const doc = {
    "type": "doc",
    "content": [
      {
        "type": "paragraph",
        "content": [
          {
            "text": "Simple phrases to test escapes:",
            "type": "text"
          }
        ]
      },
      {
        "type": "bullet_list",
        "content": [
          {
            "type": "list_item",
            "content": [
              {
                "type": "paragraph",
                "content": [
                  {
                    "text": "A dummy apostrophe's test",
                    "type": "text"
                  }
                ]
              }
            ]
          },
          {
            "type": "list_item",
            "content": [
              {
                "type": "paragraph",
                "content": [
                  {
                    "text": "<p>Just a tag</p>",
                    "type": "text"
                  }
                ]
              }
            ]
          },
          {
            "type": "list_item",
            "content": [
              {
                "type": "paragraph",
                "content": [
                  {
                    "text": "<p>Dummy & test</p>",
                    "type": "text"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }

  expect(resolver.render(doc)).toBe('<p>Simple phrases to test escapes:</p><ul><li><p>A dummy apostrophe&#39;s test</p></li><li><p>&lt;p&gt;Just a tag&lt;/p&gt;</p></li><li><p>&lt;p&gt;Dummy &amp; test&lt;/p&gt;</p></li></ul>')
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
              anchor: 'anchor-text'
            }
          }
        ]
      }
    ]
  }

  const result = resolver.render(doc)
  const expected = '<a href="/link#anchor-text" target="_blank" uuid="300aeadc-c82d-4529-9484-f3f8f09cf9f5">link text</a>'

  expect(result).toBe(expected)
})

test('Complex and immutability test', () => {
  const doc = {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          {
            text: "Lorem",
            type: "text",
            marks: [
              {
                type: "bold"
              }
            ]
          },
          {
            text: " ipsum, ",
            type: "text"
          },
          {
            text: "dolor",
            type: "text",
            marks: [
              {
                type: "strike"
              }
            ]
          },
          {
            text: " sit amet ",
            type: "text"
          },
          {
            text: "consectetur",
            type: "text",
            marks: [
              {
                type: "underline"
              }
            ]
          },
          {
            text: " adipisicing elit. ",
            type: "text"
          },
          {
            text: "Eos architecto",
            type: "text",
            marks: [
              {
                "type": "code"
              }
            ]
          },
          {
            text: " asperiores temporibus ",
            type: "text"
          },
          {
            text: "suscipit harum ",
            type: "text",
            marks: [
              {
                type: "link",
                attrs: {
                  href: "/test/our-service",
                  uuid: "931e04b7-f701-4fe4-8ec0-78be0bee8809",
                  anchor: "anchor-text",
                  target: "_blank",
                  linktype: "story"
                }
              }
            ]
          },
          {
            text: "ut, fugit, cumque ",
            type: "text"
          },
          {
            text: "molestiae ",
            type: "text",
            marks: [
              {
                type: "link",
                attrs: {
                  href: "asdfsdfasf",
                  uuid: null,
                  anchor: null,
                  target: "_blank",
                  linktype: "url"
                }
              }
            ]
          },
          {
            text: "ratione non adipisci, ",
            type: "text"
          },
          {
            text: "facilis",
            type: "text",
            marks: [
              {
                "type": "italic"
              }
            ]
          },
          {
            text: " inventore optio dolores. Rem, perspiciatis ",
            type: "text"
          },
          {
            text: "deserunt!",
            type: "text",
            marks: [
              {
                type: "link",
                attrs: {
                  href: "/home",
                  uuid: "fc6a453f-9aa6-4a00-a22d-49c5878f7983",
                  anchor: null,
                  target: "_self",
                  linktype: "story"
                }
              }
            ]
          },
          {
            text: " Esse, maiores!",
            type: "text"
          }
        ]
      }
    ]
  }

  const result = resolver.render(doc)
  const expected = `<p><b>Lorem</b> ipsum, <strike>dolor</strike> sit amet <u>consectetur</u> adipisicing elit. <code>Eos architecto</code> asperiores temporibus <a href="/test/our-service#anchor-text" uuid="931e04b7-f701-4fe4-8ec0-78be0bee8809" target="_blank" linktype="story">suscipit harum </a>ut, fugit, cumque <a href="asdfsdfasf" target="_blank" linktype="url">molestiae </a>ratione non adipisci, <i>facilis</i> inventore optio dolores. Rem, perspiciatis <a href="/home" uuid="fc6a453f-9aa6-4a00-a22d-49c5878f7983" target="_self" linktype="story">deserunt!</a> Esse, maiores!</p>`

  expect(result).toBe(expected)
})