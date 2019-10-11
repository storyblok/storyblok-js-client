const { getOptionsPage } = require('../../source/helpers')

describe('getOptionsPage function', () => {
  test('getOptionsPage() should be equal a object with default pagination options', () => {
    expect(getOptionsPage()).toEqual({
      per_page: 25,
      page: 1
    })
  })

  test('getOptionsPage({ version: draft }) should be a object with version and default values', () => {
    const options = {
      version: 'draft'
    }
    expect(getOptionsPage(options)).toEqual({
      version: 'draft',
      per_page: 25,
      page: 1
    })
  })

  test('getOptionsPage({ version: draft }, 5, 3) should be a object with version and setted values', () => {
    const options = {
      version: 'draft'
    }
    expect(getOptionsPage(options, 5, 3)).toEqual({
      version: 'draft',
      per_page: 5,
      page: 3
    })
  })
})
