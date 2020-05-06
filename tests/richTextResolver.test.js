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
