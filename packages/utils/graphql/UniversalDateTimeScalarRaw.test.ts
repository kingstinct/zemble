import { GraphQLError } from 'graphql/error'
import { Kind } from 'graphql/language'

import { UniversalDateTimeRaw } from './UniversalDateTimeScalarRaw'

const { serialize, parseValue, parseLiteral } = UniversalDateTimeRaw

describe('UniversalDateTimeRaw', () => {
  test('Should serialize dayjs with offset', () => {
    const str = '2018-11-13T14:54:59+04:00'

    const value = serialize(str)

    expect(value).toEqual(str)
  })

  test('Should serialize date string', () => {
    const str = '2018-11-13'

    const value = serialize(str)

    expect(value).toEqual(str)
  })

  test('parseValue should reject garbage dateString', () => {
    expect(() => parseValue('garbage')).toThrow(
      new GraphQLError('Require string on format YYYY-MM-DD or iso8601/dayjs valid string with timezone, found: garbage'),
    )
  })

  test('parseLiteral should reject garbage dateString', () => {
    expect(() => parseLiteral({ value: 'garbage', kind: Kind.STRING }, {})).toThrow(
      new GraphQLError('Require string on format YYYY-MM-DD or iso8601/dayjs valid string with timezone, found: garbage'),
    )
  })

  test('parseValue should return same as input', () => {
    const expected = '2019-11-01T11:00:00Z'
    const date = parseValue(expected)

    expect(date).toStrictEqual(expected)
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

  test('fail with time with no timezone', () => {
    const dateStr = '2019-11-01T11:00:00'

    expect(() => parseLiteral({ value: dateStr, kind: Kind.STRING }, {})).toThrow(
      new GraphQLError(`Require string on format YYYY-MM-DD or iso8601/dayjs valid string with timezone, found: ${dateStr}`),
    )
  })
})
