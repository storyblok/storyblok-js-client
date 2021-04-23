jest.setTimeout(60000)

import StoryblokClient from '../source/index'

let Storyblok = new StoryblokClient({
  accessToken: 'trB5kgOeDD22QJQDdPNCjAtt',
  cache: { type: 'memory', clear: 'auto' }
})

describe('test resolvingRelations', () => {
  test('resolveRelations should insert relations of single story', async () => {
    const singleStory = {
      story: {
        content: {
          component: 'news',
          _uid: '567',
          author: 'e101b4fc-3736-4f82-8c8e-788e38d5d286'
        }
      },
      rels: [
        {uuid: 'e101b4fc-3736-4f82-8c8e-788e38d5d286', name: 'Joe Doe'}
      ]
    }
    await Storyblok.resolveStories(singleStory, {version: 'published', resolve_relations: 'news.author'})

    expect(singleStory.story.content.author.name).toBe('Joe Doe')
  })

  test('resolveRelations should insert relations of multiple stories', async () => {
    const singleStory = {
      stories: [{
        content: {
          component: 'news',
          _uid: '567',
          author: 'e101b4fc-3736-4f82-8c8e-788e38d5d286'
        }
      }],
      rels: [
        {uuid: 'e101b4fc-3736-4f82-8c8e-788e38d5d286', name: 'Joe Doe'}
      ]
    }
    await Storyblok.resolveStories(singleStory, {version: 'published', resolve_relations: 'news.author'})

    expect(singleStory.stories[0].content.author.name).toBe('Joe Doe')
  })

  test('resolveRelations should insert relations of multiple stories with extra api call', async () => {
    const singleStory = {
      stories: [{
        content: {
          component: 'news',
          _uid: '567',
          author: 'e101b4fc-3736-4f82-8c8e-788e38d5d286'
        }
      }],
      rel_uuids: [
        'e101b4fc-3736-4f82-8c8e-788e38d5d286'
      ]
    }
    await Storyblok.resolveStories(singleStory, {version: 'published', resolve_relations: 'news.author'})

    expect(singleStory.stories[0].content.author.name).toBe('Testcontent 24')
  })

  test('resolveRelations should insert relations of multiple stories with 2 extra api calls', async () => {
    const uuids = ['e101b4fc-3736-4f82-8c8e-788e38d5d286']
    for (var i = 0; i < 100; i++) {
      uuids.push('e101b4fc-3736-4f82-8c8e-788e38d5d286-' + i)
    }
    const singleStory = {
      stories: [{
        content: {
          component: 'news',
          _uid: '567',
          author: 'e101b4fc-3736-4f82-8c8e-788e38d5d286'
        }
      }],
      rel_uuids: uuids
    }
    await Storyblok.resolveStories(singleStory, {version: 'published', resolve_relations: 'news.author'})

    expect(singleStory.stories[0].content.author.name).toBe('Testcontent 24')
  })
})