import papr from '../../clients/papr'
import type { EntitySchemaType } from '../../types'
import { readEntities, writeEntities } from '../../utils/fs'
import type { MutationResolvers } from '../schema.generated'

export const createEntity: NonNullable<MutationResolvers['createEntity']> = async (_, { nameSingular: nameInput, namePlural: pluralIn, isPublishable }, { pubsub }) => {
  const namePlural = pluralIn.trim()

  // just try to remove the "s" from the end of the namePlural
  const name = nameInput ? nameInput.trim() : namePlural.replace(/s$/, '')

  const entity: EntitySchemaType = {
    nameSingular: name,
    namePlural,
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

  await papr.initializeCollection(namePlural)

  pubsub.publish('reload-schema', {})

  return entity
}

export default createEntity
