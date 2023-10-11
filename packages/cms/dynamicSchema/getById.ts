import {
  GraphQLNonNull, GraphQLID,
} from 'graphql'
import { ObjectId } from 'mongodb'

import papr, {

} from '../clients/papr'

import type { EntityType } from '../clients/papr'
import type {
  GraphQLFieldConfig,
  GraphQLOutputType,
} from 'graphql'

const createGetByIdResolver = (entity: EntityType, outputType: GraphQLOutputType) => {
  const getById: GraphQLFieldConfig<unknown, unknown, {readonly id: string}> = { // "book"
    type: new GraphQLNonNull(outputType),
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLID),
      },
    },
    resolve: async (_, { id }) => (await papr.contentCollection(entity.pluralizedName)).findOne({ entityType: entity.name, _id: new ObjectId(id) }),
  } as const

  return getById
}

export default createGetByIdResolver
