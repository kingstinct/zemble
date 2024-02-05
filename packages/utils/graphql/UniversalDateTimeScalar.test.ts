import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { GraphQLError } from 'graphql/error'
import { Kind } from 'graphql/language'

import { UniversalDateTime, isValidDayjs } from './UniversalDateTimeScalar'

dayjs.extend(utc)
dayjs.extend(timezone)

const { serialize, parseValue, parseLiteral } = UniversalDateTime

describe('UniversalDateTime', () => {
  beforeEach(() => {
    dayjs.tz.setDefault()
  })

  test('Should serialize dayjs utc with millisecond', () => {
    const str = '2018-11-13T14:54:59Z'
    const expected = '2018-11-13T14:54:59.001Z'
    const date = dayjs(str).utc().millisecond(1)

    const value = serialize(date)

    expect(value).toEqual(expected)
  })

  test('Should serialize dayjs with millisecond', () => {
    const str = '2018-11-13T14:54:59+07:30'
    const expected = '2018-11-13T14:54:59.001+07:30'
    const date = dayjs(str).utcOffset('+07:30').millisecond(1)

    const value = serialize(date)

    expect(value).toEqual(expected)
  })

  test('Should serialize dayjs with offset', () => {
    const str = '2018-11-13T14:54:59+04:00'
    const date = dayjs(str).utcOffset('+04:00')

    const value = serialize(date)

    expect(value).toEqual(str)
  })

  test('Should serialize date string', () => {
    const str = '2018-11-13'

    const value = serialize(str)

    expect(value).toEqual(str)
  })

  test('parseValue should reject garbage dateString', () => {
    expect(() => parseValue('garbage')).toThrow(
      new GraphQLError('Require string on format YYYY-MM-DD or iso8601/dayjs valid string, found: garbage'),
    )
  })

  test('parseLiteral should reject garbage dateString', () => {
    expect(() => parseLiteral({ value: 'garbage', kind: Kind.STRING }, {})).toThrow(
      new GraphQLError('Require string on format YYYY-MM-DD or iso8601/dayjs valid string, found: garbage'),
    )
  })

  test('parseValue should return same as input', () => {
    const expected = '2019-11-01T11:00:00Z'
    const date = parseValue(expected) as dayjs.Dayjs

    expect(date.format()).toStrictEqual(expected)
  })

  test('parseValue should return same as input date', () => {
    const expected = '2019-11-01'
    const date = parseValue('2019-11-01')

    expect(date).toBe(expected)
  })

  test('parseLiteral should return same as input', () => {
    const expected = '2019-11-01'
    const date = parseLiteral({ value: '2019-11-01', kind: Kind.STRING }, {})

    expect(date).toBe(expected)
  })

  test('parseLiteral should return dayjs', () => {
    const expected = '2019-11-01T11:00:00Z'
    const date = parseLiteral({ value: expected, kind: Kind.STRING }, {}) as dayjs.Dayjs

    expect(date.valueOf()).toBe(new Date(expected).valueOf())
    expect(date.isValid()).toBe(true)
  })
})
