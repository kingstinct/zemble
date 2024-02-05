import { GraphQLScalarType } from 'graphql'
import { GraphQLError } from 'graphql/error'
import { Kind } from 'graphql/language'

import { isValidDateString } from '../date/isValidDateString'
import { isValidDateWithTimeString } from '../date/isValidDateWithTimeString'

export const REGEX_TIMEZONE_OFFSET_FORMAT = /^.*([+-]\d{2}:?\d{2}|[+-]\d{2}|Z)$/

const ERROR_MESSAGE = 'Require string on format YYYY-MM-DD or iso8601/dayjs valid string with timezone'

export const UniversalDateTimeRaw = new GraphQLScalarType({
  name: 'UniversalDateTime',
  description: 'UniversalDateTime accepts a YYYY-MM-DD or iso8601 string timestamp, only validation, returns same format as input',

  // @ts-expect-error hard to get this 100% internally
  // from database towards client
  serialize(value: string) {
    if (typeof value === 'string') {
      if (isValidDateString(value) || isValidDateWithTimeString(value)) {
        return value
      }
      throw new GraphQLError(`${ERROR_MESSAGE}, found: ${value}`)
    }

    throw new GraphQLError(`expect string, found: ${typeof value}`)
  },

  // @ts-expect-error hard to get this 100% internally
  // Read client input where the value is JSON.
  parseValue(value: string) {
    if (typeof value === 'string' && isValidDateString(value)) {
      return value
    } if (isValidDateWithTimeString(value)) {
      return value
    }
    throw new GraphQLError(`${ERROR_MESSAGE}, found: ${value}`)
  },

  // AST from client towards database
  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError(`${ERROR_MESSAGE}, found: ${ast.kind}`)
    }

    if (typeof ast.value === 'string' && isValidDateString(ast.value)) {
      return ast.value
    } if (isValidDateWithTimeString(ast.value)) {
      return ast.value
    }
    throw new GraphQLError(`${ERROR_MESSAGE}, found: ${ast.value}`)
  },
})

export default UniversalDateTimeRaw
