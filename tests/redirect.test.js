jest.setTimeout(60000)

const StoryblokClient = require('../source/index')

let Storyblok = new StoryblokClient({
  region: 'testing',
  accessToken: 'trB5kgOeDD22QJQDdPNCjAtt',
  cache: { type: 'memory', clear: 'auto' }
})

describe('test cache version', () => {
  test('get(\'cdn/stories\') should set the cache version', async () => {
    const result = await Storyblok.get('cdn/stories')
    const cacheVersion = JSON.parse(JSON.stringify(Storyblok.cacheVersions()))

    expect(cacheVersion['trB5kgOeDD22QJQDdPNCjAtt']).toBe(result.data.cv)
  })
})