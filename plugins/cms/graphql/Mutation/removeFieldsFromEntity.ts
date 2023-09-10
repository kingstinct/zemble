import { GraphQLError } from 'graphql'

import { Entity } from '../../clients/papr'

import type {
  MutationResolvers,
} from '../schema.generated'

const removeFieldsFromEntity: MutationResolvers['removeFieldsFromEntity'] = async (_, { entityName, fields }, { pubsub }) => {
  const prev = await Entity.findOneAndUpdate({ name: entityName }, {
    $pull: {
      fields: {
        name: { $in: fields },
      },
    },
  }, {
    upsert: true,
    returnDocument: 'after',
  })

  if (!prev) {
    throw new GraphQLError(`Entity with id ${entityName} not found`)
  }

  pubsub.publish('reload-schema', {})

  return prev
}

export default removeFieldsFromEntity
