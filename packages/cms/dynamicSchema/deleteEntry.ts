import type { GraphQLFieldConfig } from 'graphql'
import { GraphQLBoolean, GraphQLID, GraphQLNonNull } from 'graphql'
import { ObjectId } from 'mongodb'
import papr from '../clients/papr'
import type { EntitySchemaType } from '../types'

const createDeleteEntryResolver = (entity: EntitySchemaType) => {
  const deleteEntityEntry: GraphQLFieldConfig<unknown, unknown, { readonly id: string }> = {
    type: new GraphQLNonNull(GraphQLBoolean),
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLID),
      },
    },
    resolve: async (_, { id }) => {
      const collection = await papr.contentCollection(entity.namePlural)
      await collection.findOneAndDelete({
        _id: new ObjectId(id),
      })
      return true
    },
  }

  return deleteEntityEntry
}

export default createDeleteEntryResolver
