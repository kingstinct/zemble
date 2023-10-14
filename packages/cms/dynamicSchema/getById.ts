import {
  GraphQLNonNull, GraphQLID,
} from 'graphql'
import { ObjectId } from 'mongodb'

import papr, {

} from '../clients/papr'

import type { EntitySchemaType } from '../types'
import type {
  GraphQLFieldConfig,
  GraphQLOutputType,
} from 'graphql'

const createGetByIdResolver = (entity: EntitySchemaType, outputType: GraphQLOutputType) => {
  const getById: GraphQLFieldConfig<unknown, unknown, {readonly id: string}> = { // "book"
    type: new GraphQLNonNull(outputType),
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLID),
      },
    },
    resolve: async (_, { id }) => (await papr.contentCollection(entity.pluralizedName)).findOne({ _id: new ObjectId(id) }),
  } as const

  return getById
}

export default createGetByIdResolver
