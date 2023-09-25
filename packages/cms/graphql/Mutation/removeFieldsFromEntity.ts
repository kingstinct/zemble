import { GraphQLError } from 'graphql'

import { Entities } from '../../clients/papr'

import type {
  MutationResolvers,
} from '../schema.generated'

const removeFieldsFromEntity: MutationResolvers['removeFieldsFromEntity'] = async (_, { entityName, fields }, { pubsub }) => {
  const prev = await Entities.findOneAndUpdate({ name: entityName }, {
    $unset: fields.reduce((acc, field) => ({
      ...acc,
      [`fields.${field}`]: '',
    }), {}),
  }, {
    upsert: true,
    returnDocument: 'after',
  })

  if (!prev) {
    throw new GraphQLError(`Entity with id ${entityName} not found`)
  }

  pubsub.publish('reload-schema', {})

  return { ...prev, fields: Object.values(prev.fields) }
}

export default removeFieldsFromEntity
