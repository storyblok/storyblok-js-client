jest.setTimeout(60000)

const StoryblokClient = require('../source/index')

let Storyblok = new StoryblokClient({
  accessToken: 'trB5kgOeDD22QJQDdPNCjAtt'
})

if (process.env.OAUTH_TOKEN) {
  let StoryblokManagement = new StoryblokClient({
    oauthToken: process.env.OAUTH_TOKEN
  })
}

describe('getAll function', () => {
  test('getAll(\'cdn/stories\') should return all stories', async () => {
    const result = await Storyblok.getAll('cdn/stories')
    expect(result.length).toBe(26)
  })

  test('getAll(\'cdn/stories\') should return all stories with filtered results', async () => {
    const result = await Storyblok.getAll('cdn/stories', {starts_with: 'testcontent-0'})
    expect(result.length).toBe(1)
  })

  test('getAll(\'cdn/links\') should return all links', async () => {
    const result = await Storyblok.getAll('cdn/links')
    expect(result.length).toBe(26)
  })

  if (process.env.OAUTH_TOKEN) {
    test('getAll(\'spaces/67647/stories\') should return all spaces', async () => {
      const result = await StoryblokManagement.getAll('spaces/67647/stories')
      expect(result.length).toBe(26)
    })
  }
})