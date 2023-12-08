/* eslint-disable no-undef */
import { expect, test, describe } from 'vitest'
import { SbHelpers } from '../../'

const helpers = new SbHelpers()

describe('arrayFrom function', () => {
	test('arrayFrom(undefined, (v, i) => i)) should be an empty array', () => {
		expect(helpers.arrayFrom(undefined, (_, i) => i)).toEqual([])
	})

	test('arrayFrom(0, (v, i) => i)) should be an empty array', () => {
		expect(helpers.arrayFrom(0, (_, i) => i)).toEqual([])
	})

	test('arrayFrom(2, () => 1) should be an array with 1 and 1', () => {
		expect(helpers.arrayFrom(2, () => 1)).toEqual([1, 1])
	})

	test('arrayFrom(2, (v, i) => v)) should be an array with undefined values', () => {
		expect(helpers.arrayFrom(2, (v) => v)).toEqual([undefined, undefined])
	})

	test('arrayFrom(2, (v, i) => i) should be an array with 0 and 1', () => {
		expect(helpers.arrayFrom(2, (v, i) => i)).toEqual([0, 1])
	})
})

describe('range function', () => {
	test('range(undefined, undefined) should be an empty array', () => {
		expect(helpers.range(undefined, undefined)).toEqual([])
	})

	test('range(NaN, NaN) should be an empty array', () => {
		expect(helpers.range(NaN, NaN)).toEqual([])
	})

	test('range(0, 0) should be an empty array', () => {
		expect(helpers.range(0, 0)).toEqual([])
	})

	test('range(-2, 0) should be an array with -2 and -1', () => {
		expect(helpers.range(-2, 0)).toEqual([-2, -1])
	})

	test('range(0, 2) should be an array with 0 and 1', () => {
		expect(helpers.range(0, 2)).toEqual([0, 1])
	})

	test('range(2, 0) should be an array with 2 and 1', () => {
		expect(helpers.range(2, 0)).toEqual([2, 1])
	})
})

describe('asyncMap function', () => {
	test('asyncMap(undefined, v => v)) should be an empty array', async () => {
		await expect(helpers.asyncMap(undefined, (v) => v)).rejects.toThrow(
			TypeError
		)
	})

	test('asyncMap([], v => v) should be an empty array', async () => {
		await expect(helpers.asyncMap([], (v) => v)).resolves.toEqual([])
	})

	test('asyncMap([1, 2], v => v) should be an array with 1 and 2', async () => {
		await expect(helpers.asyncMap([1, 2], (v) => v)).resolves.toEqual([1, 2])
	})

	test('asyncMap([delay(100), delay(200)], v => v) should be an array with undefined values', async () => {
		await expect(
			helpers.asyncMap([helpers.delay(100), helpers.delay(200)], (v) => v)
		).rejects
	})
})

describe('flatMap function', () => {
	test('flatMap(undefined, v => v) should be an empty array', () => {
		expect(helpers.flatMap(undefined, (v) => v)).toEqual([])
	})

	test('flatMap([], v => v) should be an empty array', () => {
		expect(helpers.flatMap([], (v) => v)).toEqual([])
	})

	test('flatMap([3, 4], (v, i) => [i]) should be an array with 0, 1', () => {
		expect(helpers.flatMap([3, 4], (v, i) => [i])).toEqual([0, 1])
	})

	test('flatMap([0, 2], (v) => [v, v + 1]) should be an array with 0, 1, 2 and 3', () => {
		expect(helpers.flatMap([0, 2], (v) => [v, v + 1])).toEqual([0, 1, 2, 3])
	})
})

describe('getRegionURL function', () => {
	const EU_API_URL = 'api.storyblok.com'
	const US_API_URL = 'api-us.storyblok.com'
	const CN_API_URL = 'app.storyblokchina.cn'
	const AP_API_URL = 'api-ap.storyblok.com'
	const CA_API_URL = 'api-ca.storyblok.com'

	test('should return the europe url when pass a empty string', () => {
		expect(helpers.getRegionURL('')).toEqual(EU_API_URL)
	})

	test('should return the europe url when pass non supported region code', () => {
		expect(helpers.getRegionURL('nn')).toEqual(EU_API_URL)
	})

	test('should return the europe url when pass eu string', () => {
		expect(helpers.getRegionURL('eu')).toEqual(EU_API_URL)
	})

	test('should return the united states url when pass us string', () => {
		expect(helpers.getRegionURL('us')).toEqual(US_API_URL)
	})

	test('should return the china url when pass cn string', () => {
		expect(helpers.getRegionURL('cn')).toEqual(CN_API_URL)
	})

	test('should return the australia url when pass ap string', () => {
		expect(helpers.getRegionURL('ap')).toEqual(AP_API_URL)
	})

	test('should return the canada url when pass ca string', () => {
		expect(helpers.getRegionURL('ca')).toEqual(CA_API_URL)
	})
})
