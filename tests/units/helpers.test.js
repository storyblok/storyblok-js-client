import { delay, arrayFrom, range, asyncMap, flatMap } from '../../source/helpers'

describe('arrayFrom function', () => {
  test('arrayFrom(undefined, (v, i) => i)) should be an empty array', () => {
    expect(arrayFrom(undefined, (_, i) => i)).toEqual([])
  })

  test('arrayFrom(0, (v, i) => i)) should be an empty array', () => {
    expect(arrayFrom(0, (_, i) => i)).toEqual([])
  })

  test('arrayFrom(2, () => 1) should be an array with 1 and 1', () => {
    expect(arrayFrom(2, () => 1)).toEqual([1, 1])
  })

  test('arrayFrom(2, (v, i) => v)) should be an array with undefined values', () => {
    expect(arrayFrom(2, (v, _) => v)).toEqual([undefined, undefined])
  })

  test('arrayFrom(2, (v, i) => i) should be an array with 0 and 1', () => {
    expect(arrayFrom(2, (v, i) => i)).toEqual([0, 1])
  })
})

describe('range function', () => {
  test('range(undefined, undefined) should be an empty array', () => {
    expect(range(undefined, undefined)).toEqual([])
  })

  test('range(NaN, NaN) should be an empty array', () => {
    expect(range(NaN, NaN)).toEqual([])
  })

  test('range(0, 0) should be an empty array', () => {
    expect(range(0, 0)).toEqual([])
  })

  test('range(-2, 0) should be an array with -2 and -1', () => {
    expect(range(-2, 0)).toEqual([-2, -1])
  })

  test('range(0, 2) should be an array with 0 and 1', () => {
    expect(range(0, 2)).toEqual([0, 1])
  })

  test('range(2, 0) should be an array with 2 and 1', () => {
    expect(range(2, 0)).toEqual([2, 1])
  })
})

describe('asyncMap function', () => {
  test('asyncMap(undefined, v => v)) should be an empty array', async () => {
    await expect(asyncMap(undefined, v => v)).resolves.toEqual([])
  })

  test('asyncMap([], v => v) should be an empty array', async () => {
    await expect(asyncMap([], v => v)).resolves.toEqual([])
  })

  test('asyncMap([1, 2], v => v) should be an array with 1 and 2', async () => {
    await expect(asyncMap([1, 2], v => v)).resolves.toEqual([1, 2])
  })

  test('asyncMap([delay(100), delay(200)], v => v) should be an array with undefined values', async () => {
    await expect(asyncMap([delay(100), delay(200)], v => v)).resolves.toEqual([undefined, undefined])
  })
})

describe('flatMap function', () => {
  test('flatMap(undefined, v => v) should be an empty array', () => {
    expect(flatMap(undefined, v => v)).toEqual([])
  })

  test('flatMap([], v => v) should be an empty array', () => {
    expect(flatMap([], v => v)).toEqual([])
  })

  test('flatMap([3, 4], (v, i) => [i]) should be an array with 0, 1', () => {
    expect(flatMap([3, 4], (v, i) => [i])).toEqual([0, 1])
  })

  test('flatMap([0, 2], (v) => [v, v + 1]) should be an array with 0, 1, 2 and 3', () => {
    expect(flatMap([0, 2], v => [v, v + 1])).toEqual([0, 1, 2, 3])
  })
})
