import { GraphQLError } from 'graphql'

import { Entities } from '../../clients/papr'

import type { EntitySchema } from '../../clients/papr'
import type { MutationResolvers } from '../schema.generated'
import type { DocumentForInsert } from 'papr'

const createEntity: MutationResolvers['createEntity'] = async (_, { name: nameInput, pluralizedName: pluralIn, isPublishable }, { pubsub }) => {
  const name = nameInput.trim()

  const pluralizedName = pluralIn.trim()

  if (name.endsWith('s') && !pluralIn) {
    throw new GraphQLError('If entity name ends with "s", pluralized name must be explicitely provided')
  }

  const entity: DocumentForInsert<typeof EntitySchema[0], typeof EntitySchema[1]> = {
    name,
    pluralizedName,
    isPublishable: isPublishable ?? false,
    fields:
      {
        id: {
          __typename: 'IDField',
          isRequired: true,
          isRequiredInput: false,
          name: 'id',
        },
      },
  }

  const prev = await Entities.insertOne(entity)

  pubsub.publish('reload-schema', {})

  return { ...prev!, fields: Object.values(prev!.fields) }
}

export default createEntity
