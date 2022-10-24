/* eslint-disable no-undef */
import { SbHelpers } from '../../dist/sbHelpers'

const isCDNUrl = new SbHelpers()

describe('isCDNUrl function', () => {
	test('isCDNUrl() should be false', () => {
		expect(isCDNUrl.isCDNUrl()).toBe(false)
	})

	test("isCDNUrl('/cdn/stories') should be true", () => {
		expect(isCDNUrl.isCDNUrl('/cdn/stories')).toBe(true)
	})

	test("isCDNUrl('/v1/spaces') should be false", () => {
		expect(isCDNUrl.isCDNUrl('/v1/spaces')).toBe(false)
	})
})
