import { GraphQLScalarType } from 'graphql'
import { GraphQLError } from 'graphql/error'
import { Kind } from 'graphql/language'
import { ObjectId } from 'mongodb'

import type { GraphQLScalarTypeConfig } from 'graphql'

const mongodbObjectIdRegex = /^[0-9a-fA-F]+$/

export function isValidMongoDBObjectID(_id: string): boolean {
  // / https://stackoverflow.com/questions/11985228/mongodb-node-check-if-objectid-is-valid
  const id = `${_id}`
  const len = id.length
  let valid = false

  if (len === 12 || len === 24) {
    valid = mongodbObjectIdRegex.test(id)
  }

  return valid
}

const config: GraphQLScalarTypeConfig<ObjectId, string> = {
  name: 'ObjectId',
  description: 'ObjectId is a mongodb ObjectId. String of 12 or 24 hex chars',

  // from database towards client
  serialize(v: unknown): string {
    const value = v as ObjectId
    const result = value.toString()
    if (!isValidMongoDBObjectID(result)) {
      throw new GraphQLError(`serialize: value: ${value.toString()} is not valid ObjectId`)
    }

    return result
  },

  // json from client towards database
  parseValue(v: unknown): ObjectId {
    const value = v as string
    if (!isValidMongoDBObjectID(value)) {
      throw new GraphQLError(`serialize: not a valid ObjectId, require a string with 12 or 24 hex chars, found: ${value}`)
    }

    return new ObjectId(value)
  },

  // AST from client towards database
  parseLiteral(ast): ObjectId {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError(`parseLiteral: not a valid ObjectId, require a string with 12 or 24 hex chars, found: ${ast.kind}`, [ast])
    }

    const value = ast.value.toString()
    return new ObjectId(value)
  },
}

export const GraphQLObjectIdScalar = new GraphQLScalarType(config)

export default GraphQLObjectIdScalar
