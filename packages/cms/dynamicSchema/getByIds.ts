import type { GraphQLFieldConfig, GraphQLObjectType } from 'graphql'
import { GraphQLID, GraphQLList, GraphQLNonNull } from 'graphql'
import { ObjectId } from 'mongodb'
import papr, {} from '../clients/papr'
import type { EntitySchemaType } from '../types'

const createGetByIdsResolver = (entity: EntitySchemaType, outputType: GraphQLObjectType) => {
  const getByIds: GraphQLFieldConfig<unknown, unknown, { readonly ids: readonly string[] }> = {
    // "book"
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(outputType))),
    args: {
      ids: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID))),
      },
    },
    resolve: async (_, { ids }) =>
      (await papr.contentCollection(entity.namePlural)).find({
        _id: { $in: ids.map((id) => new ObjectId(id)) },
      }),
  } as const

  return getByIds
}

export default createGetByIdsResolver
