import type { GraphQLFieldConfig, GraphQLOutputType } from 'graphql'
import { GraphQLID, GraphQLNonNull } from 'graphql'
import { ObjectId } from 'mongodb'
import papr, {} from '../clients/papr'
import type { EntitySchemaType } from '../types'

const createGetByIdResolver = (
  entity: EntitySchemaType,
  outputType: GraphQLOutputType,
) => {
  const getById: GraphQLFieldConfig<unknown, unknown, { readonly id: string }> =
    {
      // "book"
      type: new GraphQLNonNull(outputType),
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve: async (_, { id }) =>
        (await papr.contentCollection(entity.namePlural)).findOne({
          _id: new ObjectId(id),
        }),
    } as const

  return getById
}

export default createGetByIdResolver
