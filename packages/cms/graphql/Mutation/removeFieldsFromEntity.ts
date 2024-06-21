import { GraphQLError } from 'graphql'

import { readEntities, writeEntities } from '../../utils/fs'

import type { EntitySchemaType } from '../../types'
import type {
  MutationResolvers,
} from '../schema.generated'

export const removeFieldsFromEntity: NonNullable<MutationResolvers['removeFieldsFromEntity']> = async (_, { namePlural, fields }, { pubsub }) => {
  const entities = await readEntities()
  const entity = entities.find((entity) => entity.namePlural === namePlural)

  if (!entity) {
    throw new GraphQLError(`Entity with id ${namePlural} not found`)
  }

  const updatedEntity: EntitySchemaType = {
    ...entity,
    fields: entity.fields.filter((field) => !fields.includes(field.name)),
  }

  await writeEntities(entities.map((entity) => (entity.namePlural === namePlural ? updatedEntity : entity)))

  pubsub.publish('reload-schema', {})

  return updatedEntity
}

export default removeFieldsFromEntity
