import StoryblokClient from '../source/index'

const accessToken = 'w0yFvs04aKF2rpz6F8OfIQtt'
const cache = {
  type: 'memory',
  clear: 'auto',
}

describe('Client should accept response interceptor as a function', () => {
  const Storyblok = new StoryblokClient({
    accessToken,
    cache,
    responseInterceptor: (res) => {
      return res
    },
  })
  it('should RESPONSE to be TRUTHY', async () => {
    await Storyblok.getAll('cdn/links')
    expect(Storyblok.client.interceptors.response.handlers.length).toBeTruthy()
  })
  it('should REQUEST to be FALSY', async () => {
    await Storyblok.getAll('cdn/links')
    expect(Storyblok.client.interceptors.request.handlers.length).toBeFalsy()
  })
})

describe('Client should be initialized without interceptors', () => {
  const Storyblok = new StoryblokClient({
    accessToken,
    cache,
  })
  it('should RESPONSE to be FALSY', async () => {
    await Storyblok.getAll('cdn/links')
    expect(Storyblok.client.interceptors.response.handlers.length).toBeFalsy()
  })
  it('should REQUEST to be FALSY', async () => {
    await Storyblok.getAll('cdn/links')
    expect(Storyblok.client.interceptors.request.handlers.length).toBeFalsy()
  })
})

