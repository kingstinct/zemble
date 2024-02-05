import dayjs from 'dayjs'
import tz from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { GraphQLScalarType } from 'graphql'
import { GraphQLError } from 'graphql/error'
import { Kind } from 'graphql/language'

import { dayjsToString } from '../date/dayjsToString'
import { isValidDateString } from '../date/isValidDateString'
import { stringToDayjs } from '../date/stringToDayjs'

dayjs.extend(tz)
dayjs.extend(utc)

export function isValidDayjs(date: string) {
  return dayjs(date).isValid()
}

export const UniversalDateTime = new GraphQLScalarType({
  name: 'UniversalDateTime',
  description: 'UniversalDateTime accepts a YYYY-MM-DD or iso8601 string timestamp, only validation, returns same format as input',

  // @ts-expect-error hard to get this 100% internally
  // from database towards client
  serialize(value: dayjs.Dayjs | string) {
    if (typeof value === 'string') {
      if (!isValidDateString(value)) {
        throw new GraphQLError('serialize: invalid string format, require YYYY-MM-DD')
      }
      return value
    }

    if (!value.isValid || !value.isValid()) {
      throw new GraphQLError('serialize: require db object to be of type Dayjs')
    }

    return dayjsToString(value)
  },

  // @ts-expect-error hard to get this 100% internally
  // Read client input where the value is JSON.
  parseValue(value: string) {
    if (typeof value === 'string' && isValidDateString(value)) {
      return value
    } if (isValidDayjs(value)) {
      // const iso8601String: string = value as string;
      // date = dayjs(iso8601String).toDate();
      return stringToDayjs(value)
    }
    throw new GraphQLError(`Require string on format YYYY-MM-DD or iso8601/dayjs valid string, found: ${value}`)
  },

  // AST from client towards database
  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError(`Require string on format YYYY-MM-DD or iso8601/dayjs valid string, found: ${ast.kind}`)
    }

    if (typeof ast.value === 'string' && isValidDateString(ast.value)) {
      return ast.value
    } if (isValidDayjs(ast.value)) {
      return stringToDayjs(ast.value)
    }
    throw new GraphQLError(`Require string on format YYYY-MM-DD or iso8601/dayjs valid string, found: ${ast.value}`)
  },
})

export default UniversalDateTime
