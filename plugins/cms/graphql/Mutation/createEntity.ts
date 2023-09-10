import { GraphQLError } from 'graphql'

import { Entity } from '../../clients/papr'

import type { EntitySchema } from '../../clients/papr'
import type { MutationResolvers } from '../schema.generated'
import type { DocumentForInsert } from 'papr'

const createEntity: MutationResolvers['createEntity'] = async (_, { name: nameInput }, { pubsub }) => {
  const name = nameInput.trim().toLowerCase()

  if (name.endsWith('s')) {
    throw new GraphQLError('Entity name cannot end with "s" for sake of pluralization')
  }

  const entity: DocumentForInsert<typeof EntitySchema[0], typeof EntitySchema[1]> = {
    name,
    fields:
      {
        _id: {
          __typename: 'IDField',
          isRequired: true,
          name: '_id',
        },
      },
  }

  const prev = await Entity.findOneAndUpdate({ name: entity.name }, {
    $set: {
      fields: entity.fields,
      name: entity.name,
    },
  }, {
    upsert: true,
  })

  pubsub.publish('reload-schema', {})

  return { ...prev!, fields: Object.values(prev!.fields) }
}

export default createEntity
