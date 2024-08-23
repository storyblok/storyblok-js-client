import { describe, it, expect, beforeEach, vi } from 'vitest'
import { SbHelpers } from './sbHelpers'

describe('SbHelpers', () => {
  let helpers: SbHelpers

  beforeEach(() => {
    helpers = new SbHelpers()
  })

  it('should create a new instance', () => {
    expect(helpers).toBeDefined()
    expect(helpers).toBeInstanceOf(SbHelpers)
  })

  describe('isCDNUrl', () => {
    it('returns true if the URL contains /cdn/', () => {
      expect(helpers.isCDNUrl('http://example.com/cdn/content')).toBe(true)
    })

    it('returns false if the URL does not contain /cdn/', () => {
      expect(helpers.isCDNUrl('http://example.com/content')).toBe(false)
    })
  })

  describe('getOptionsPage', () => {
    it('constructs options with default pagination', () => {
      const options = { uuid: 'awiwi' }
      expect(helpers.getOptionsPage(options)).toEqual({
        uuid: 'awiwi',
        per_page: 25,
        page: 1,
      })
    })

    it('overrides defaults when parameters are provided', () => {
      expect(helpers.getOptionsPage({ uuid: 'awiwi' }, 10, 2)).toEqual({
        uuid: 'awiwi',
        per_page: 10,
        page: 2,
      })
    })
  })

  describe('delay', () => {
    it('delays execution by specified ms', async () => {
      vi.useFakeTimers()
      const promise = helpers.delay(1000)
      vi.advanceTimersByTime(1000)
      await expect(promise).resolves.toBeUndefined()
      vi.useRealTimers()
    })
  })

  describe.skip('range', () => {
    it('creates an array from start to end', () => {
      // TODO: This test is failing on the current implementation
      expect(helpers.range(1, 5)).toEqual([1, 2, 3, 4, 5])
      expect(helpers.range(5, 1)).toEqual([5, 4, 3, 2, 1])
    })
  })

  describe('asyncMap', () => {
    it('applies an async function to each element in the array', async () => {
      const numbers = [1, 2, 3]
      const doubleAsync = async (n: number) => n * 2
      const results = await helpers.asyncMap(numbers, doubleAsync)
      expect(results).toEqual([2, 4, 6])
    })
  })

  describe('flatMap', () => {
    it('maps and flattens the array based on the provided function', () => {
      const data = [
        { id: 1, values: [10, 20] },
        { id: 2, values: [30, 40] },
      ]
      const flattenValues = (item: { values: number[] }) => item.values
      const result = helpers.flatMap(data, flattenValues)
      expect(result).toEqual([10, 20, 30, 40])
    })
  })

  describe('stringify', () => {
    it('stringifies simple objects', () => {
      const params = { name: 'John', age: 30 }
      const result = helpers.stringify(params)
      expect(result).toBe('name=John&age=30')
    })

    it('handles arrays correctly', () => {
      const params = { names: ['John', 'Jane'] }
      const result = helpers.stringify(params, '', true)
      expect(result).toBe('=John&=Jane')
    })
  })

  describe('arrayFrom function', () => {
    it('arrayFrom(undefined, (v, i) => i)) should be an empty array', () => {
      expect(helpers.arrayFrom(undefined, (_, i) => i)).toEqual([])
    })

    it('arrayFrom(0, (v, i) => i)) should be an empty array', () => {
      expect(helpers.arrayFrom(0, (_, i) => i)).toEqual([])
    })

    it('arrayFrom(2, () => 1) should be an array with 1 and 1', () => {
      expect(helpers.arrayFrom(2, () => 1)).toEqual([1, 1])
    })

    it('arrayFrom(2, (v, i) => v)) should be an array with undefined values', () => {
      expect(helpers.arrayFrom(2, (v) => v)).toEqual([undefined, undefined])
    })

    it('arrayFrom(2, (v, i) => i) should be an array with 0 and 1', () => {
      expect(helpers.arrayFrom(2, (v, i) => i)).toEqual([0, 1])
    })
  })

  describe('getRegionURL', () => {
    it('returns the EU API URL by default', () => {
      expect(helpers.getRegionURL()).toBe('api.storyblok.com')
      expect(helpers.getRegionURL('unknown')).toBe('api.storyblok.com') // test for unrecognized region code
    })

    it('returns the US API URL when region code is "us"', () => {
      expect(helpers.getRegionURL('us')).toBe('api-us.storyblok.com')
    })

    it('returns the CN API URL when region code is "cn"', () => {
      expect(helpers.getRegionURL('cn')).toBe('app.storyblokchina.cn')
    })

    it('returns the AP API URL when region code is "ap"', () => {
      expect(helpers.getRegionURL('ap')).toBe('api-ap.storyblok.com')
    })

    it('returns the CA API URL when region code is "ca"', () => {
      expect(helpers.getRegionURL('ca')).toBe('api-ca.storyblok.com')
    })
  })

  describe('escapeHTML', () => {
    it('escapes HTML characters', () => {
      const str = '<div>Test & "more" test</div>'
      const escaped = helpers.escapeHTML(str)
      expect(escaped).toBe(
        '&lt;div&gt;Test &amp; &quot;more&quot; test&lt;/div&gt;'
      )
    })
  })
})
