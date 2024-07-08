/* eslint-disable no-undef */
import { expect, test, describe } from 'vitest'
import StoryblokClient from '../'

const accessToken = process.env.VITE_ACCESS_TOKEN
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
  test('should RESPONSE function DO EXIST', async () => {
    await Storyblok.getAll('cdn/links')
    expect(Storyblok.client.responseInterceptor).toBeTruthy()
  })
})

describe('Client should be initialized without interceptors', () => {
  const Storyblok = new StoryblokClient({
    accessToken,
    cache,
  })
  test('should RESPONSE function DO NOT EXIST', async () => {
    await Storyblok.getAll('cdn/links')
    expect(Storyblok.client.responseInterceptor).toBeFalsy()
  })
})
