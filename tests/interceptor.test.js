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
  it('should RESPONSE function DO EXIST', async () => {
    await Storyblok.getAll('cdn/links')
    expect(Storyblok.client.responseInterceptor).toBeTruthy()
  })
})

describe('Client should be initialized without interceptors', () => {
  const Storyblok = new StoryblokClient({
    accessToken,
    cache,
  })
  it.only('should RESPONSE function DO NOT EXIST', async () => {
    await Storyblok.getAll('cdn/links')
    expect(Storyblok.client.responseInterceptor).toBeFalsy()
  })
})

