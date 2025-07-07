import type { GraphQLFieldConfig, GraphQLOutputType } from 'graphql'
import { GraphQLNonNull } from 'graphql'
import { ObjectId } from 'mongodb'
import papr from '../clients/papr'

import type { EntitySchemaType } from '../types'
import { createTraverser, fieldToInputType } from './utils'

const createEntryResolver = (
  entity: EntitySchemaType,
  type: GraphQLOutputType,
) => {
  const createEntityEntry: GraphQLFieldConfig<
    unknown,
    unknown,
    Record<string, unknown> & { readonly id: string }
  > = {
    type,
    args: Object.values(entity.fields).reduce((prev, field) => {
      const baseType = fieldToInputType(entity.nameSingular, field)

      return {
        ...prev,
        [field.name]: {
          type:
            field.isRequiredInput && field.__typename !== 'IDField'
              ? new GraphQLNonNull(baseType)
              : baseType,
        },
      }
    }, {}),
    resolve: async (_, { id, ...input }) => {
      const mappedData = createTraverser(entity)(input)

      const _id = id ? new ObjectId(id) : new ObjectId()

      const collection = await papr.contentCollection(entity.namePlural)
      const res = await collection.findOneAndUpdate(
        {
          _id,
        },
        {
          $set: mappedData,
          $setOnInsert: { _id },
        },
        {
          upsert: true,
          returnDocument: 'after',
        },
      )

      return res!
    },
  }

  return createEntityEntry
}

export default createEntryResolver
