jest.setTimeout(60000)

import StoryblokClient from '../source/index'

describe('Client should accept response interceptor as a function', () => {
  const Storyblok = new StoryblokClient({
    accessToken: 'trB5kgOeDD22QJQDdPNCjAtt',
    cache: { type: 'memory', clear: 'auto' },
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
    accessToken: 'trB5kgOeDD22QJQDdPNCjAtt',
    cache: { type: 'memory', clear: 'auto' },
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

describe('Client should throw an error if NO RESPONSE is returned by the responseInterceptor function', () => {
  it('should trhow a TypeError if NOTHING is returned', async () => {
    const Storyblok = new StoryblokClient({
      accessToken: 'trB5kgOeDD22QJQDdPNCjAtt',
      cache: { type: 'memory', clear: 'auto' },
      responseInterceptor: () => {
      },
    })
    let error = ''
    try {
      await Storyblok.getAll('cdn/links')
    } catch(err) {
      error = err
    }
    expect(error).toEqual(new TypeError('Cannot read property \'data\' of undefined'));
  })
  it('should throw a TypeError if NULL is returned', async () => {
    const Storyblok = new StoryblokClient({
      accessToken: 'trB5kgOeDD22QJQDdPNCjAtt',
      cache: { type: 'memory', clear: 'auto' },
      responseInterceptor: () => null,
    })
    let error = ''
    try {
      await Storyblok.getAll('cdn/links')
    } catch(err) {
      error = err
    }
    expect(error).toEqual(new TypeError('Cannot read property \'data\' of null'));
  })
})

describe('Client should throw an error if NO FUNCTION is passed AS the responseInterceptor', () => {
  it('should trhow a TypeError', async () => {
    const Storyblok = new StoryblokClient({
      accessToken: 'trB5kgOeDD22QJQDdPNCjAtt',
      cache: { type: 'memory', clear: 'auto' },
      responseInterceptor: 'something else',
    })
    let error = ''
    try {
      await Storyblok.getAll('cdn/links')
    } catch(err) {
      error = err
    }
    expect(error).toEqual(new TypeError('config.responseInterceptor is not a function'));
  })
  it('should REQUEST to be FALSY if NULL is passed', async () => {
    const Storyblok = new StoryblokClient({
      accessToken: 'trB5kgOeDD22QJQDdPNCjAtt',
      cache: { type: 'memory', clear: 'auto' },
      responseInterceptor: null,
    })
    await Storyblok.getAll('cdn/links')
    expect(Storyblok.client.interceptors.request.handlers.length).toBeFalsy()
  })
})