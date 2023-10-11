import { GraphQLNonNull } from 'graphql'
import { ObjectId } from 'mongodb'

import { createTraverser, fieldToInputType } from './utils'
import papr from '../clients/papr'

import type { EntityType } from '../clients/papr'
import type { GraphQLFieldConfig, GraphQLOutputType } from 'graphql'

const createEntryResolver = (entity: EntityType, type: GraphQLOutputType) => {
  const createEntityEntry: GraphQLFieldConfig<unknown, unknown, Record<string, unknown> & { readonly id: string }> = {
    type,
    args: Object.values(entity.fields).reduce((prev, field) => {
      const baseType = fieldToInputType(entity.name, field)

      return ({
        ...prev,
        [field.name]: {
          type: field.isRequiredInput && field.__typename !== 'IDField' ? new GraphQLNonNull(baseType) : baseType,
        },
      })
    }, {}),
    resolve: async (_, { id, ...input }) => {
      const mappedData = createTraverser(entity)(input)

      const _id = id ? new ObjectId(id) : new ObjectId()

      const res = await (await papr.contentCollection(entity.pluralizedName)).findOneAndUpdate({
        _id,
        entityType: entity.name,
      }, {
        $set: {
          entityType: entity.name,
          ...mappedData,
        },
        $setOnInsert: { _id },
      }, {
        upsert: true,
        returnDocument: 'after',
      })

      return res!
    },
  }

  return createEntityEntry
}

export default createEntryResolver
