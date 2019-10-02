const RichTextResolver = require('../source/richTextResolver')

let resolver = new RichTextResolver()

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
              uuid: null
            }
          }
        ]
      }
    ]
  }

  expect(resolver.render(doc)).toBe('<a href="/link">link text</a>')
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
