import {
  GraphQLList,
  GraphQLNonNull,
} from 'graphql'

import papr from '../clients/papr'

import type { EntitySchemaType } from '../types'
import type {
  GraphQLFieldConfig,
  GraphQLOutputType,
} from 'graphql'

const createGetAll = (entity: EntitySchemaType, type: GraphQLOutputType) => {
  const getAll: GraphQLFieldConfig<unknown, unknown, unknown> = { // "books"
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(type))),
    resolve: async () => {
      const collection = await papr.contentCollection(entity.pluralizedName)
      return collection.find({ })
    },
  }

  return getAll
}

export default createGetAll
