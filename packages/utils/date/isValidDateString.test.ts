import { isValidDateString } from './isValidDateString'

describe('isValidDateString', () => {
  test('Should return true for valid date string', () => {
    expect(isValidDateString('2019-11-01')).toBe(true)
    expect(isValidDateString('2019-12-01')).toBe(true)
    expect(isValidDateString('2019-12-30')).toBe(true)
    expect(isValidDateString('2019')).toBe(true)
  })

  test('Should return false for invalid date string', () => {
    expect(isValidDateString('19')).toBe(false)
    expect(isValidDateString('2019-11-32')).toBe(false)
    expect(isValidDateString('2019-13-30')).toBe(false)
  })
})
