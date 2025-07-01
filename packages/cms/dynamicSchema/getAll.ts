import type { GraphQLFieldConfig, GraphQLOutputType } from 'graphql'
import { GraphQLList, GraphQLNonNull } from 'graphql'
import papr from '../clients/papr'
import type { EntitySchemaType } from '../types'

const createGetAll = (entity: EntitySchemaType, type: GraphQLOutputType) => {
  const getAll: GraphQLFieldConfig<unknown, unknown, unknown> = {
    // "books"
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(type))),
    resolve: async () => {
      const collection = await papr.contentCollection(entity.namePlural)
      return collection.find({})
    },
  }

  return getAll
}

export default createGetAll
