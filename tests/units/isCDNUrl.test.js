const { isCDNUrl } = require('../../source/helpers')

describe('isCDNUrl function', () => {
  test('isCDNUrl() should be false', () => {
    expect(isCDNUrl()).toBe(false)
  })

  test(`isCDNUrl('/cdn/stories') should be true`, () => {
    expect(isCDNUrl('/cdn/stories')).toBe(true)
  })

  test(`isCDNUrl('/v1/spaces') should be false`, () => {
    expect(isCDNUrl('/v1/spaces')).toBe(false)
  })
})
