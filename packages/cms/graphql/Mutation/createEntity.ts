import { GraphQLError } from 'graphql'

import papr from '../../clients/papr'
import { readEntities, writeEntities } from '../../utils/fs'

import type { EntitySchemaType } from '../../types'
import type { MutationResolvers } from '../schema.generated'

const createEntity: MutationResolvers['createEntity'] = async (_, { name: nameInput, pluralizedName: pluralIn, isPublishable }, { pubsub }) => {
  const name = nameInput.trim()

  const pluralizedName = pluralIn.trim()

  if (name.endsWith('s') && !pluralIn) {
    throw new GraphQLError('If entity name ends with "s", pluralized name must be explicitely provided')
  }

  const entity: EntitySchemaType = {
    name,
    pluralizedName,
    isPublishable: isPublishable ?? false,
    fields: [
      {
        __typename: 'IDField',
        isRequired: true,
        isRequiredInput: false,
        name: 'id',
      },
    ],
  }

  const entities = await readEntities()

  await writeEntities([...entities, entity])

  await papr.initializeCollection(pluralizedName)

  pubsub.publish('reload-schema', {})

  return entity
}

export default createEntity
