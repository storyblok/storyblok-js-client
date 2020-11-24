jest.setTimeout(60000)

import StoryblokClient from '../source/index'

describe('Axios should accept response interceptor as a function', () => {
  const Storyblok = new StoryblokClient({
    accessToken: 'trB5kgOeDD22QJQDdPNCjAtt',
    cache: { type: 'memory', clear: 'auto' },
    responseInterceptor: (res) => {
      return res
    },
  })
  it('should interceptors RESPONSE to be TRUTHY', async () => {
    await Storyblok.getAll('cdn/links')
    expect(Storyblok.client.interceptors.response.handlers.length).toBeTruthy()
  })
  it('should interceptors REQUEST to be FALSY', async () => {
    await Storyblok.getAll('cdn/links')
    expect(Storyblok.client.interceptors.request.handlers.length).toBeFalsy()
  })
})
describe('Axios should be initialized without interceptors', () => {
  const Storyblok = new StoryblokClient({
    accessToken: 'trB5kgOeDD22QJQDdPNCjAtt',
    cache: { type: 'memory', clear: 'auto' },
  })
  it('should interceptors RESPONSE to be FALSY', async () => {
    await Storyblok.getAll('cdn/links')
    expect(Storyblok.client.interceptors.response.handlers.length).toBeFalsy()
  })
  it('should interceptors REQUEST to be FALSY', async () => {
    await Storyblok.getAll('cdn/links')
    expect(Storyblok.client.interceptors.request.handlers.length).toBeFalsy()
  })
})