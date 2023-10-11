import {
  GraphQLNonNull, GraphQLID, GraphQLList,
} from 'graphql'
import { ObjectId } from 'mongodb'

import papr, {

} from '../clients/papr'

import type { EntityType } from '../clients/papr'
import type {
  GraphQLFieldConfig, GraphQLObjectType,
} from 'graphql'

const createGetByIdsResolver = (entity: EntityType, outputType: GraphQLObjectType) => {
  const getByIds: GraphQLFieldConfig<unknown, unknown, {readonly ids: readonly string[]}> = { // "book"
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(outputType))),
    args: {
      ids: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID))),
      },
    },
    resolve: async (_, { ids }) => (await papr.contentCollection(entity.pluralizedName)).find({
      entityType: entity.name,
      _id: { $in: ids.map((id) => new ObjectId(id)) },
    }),
  } as const

  return getByIds
}

export default createGetByIdsResolver
