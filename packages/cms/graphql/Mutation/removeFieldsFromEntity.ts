import { GraphQLError } from 'graphql'

import { readEntities, writeEntities } from '../../utils/fs'

import type { EntitySchemaType } from '../../types'
import type {
  MutationResolvers,
} from '../schema.generated'

const removeFieldsFromEntity: MutationResolvers['removeFieldsFromEntity'] = async (_, { entityName, fields }, { pubsub }) => {
  const entities = await readEntities()
  const entity = entities.find((entity) => entity.name === entityName)

  if (!entity) {
    throw new GraphQLError(`Entity with id ${entityName} not found`)
  }

  const updatedEntity: EntitySchemaType = {
    ...entity,
    fields: entity.fields.filter((field) => !fields.includes(field.name)),
  }

  await writeEntities(entities.map((entity) => (entity.name === entityName ? updatedEntity : entity)))

  pubsub.publish('reload-schema', {})

  return updatedEntity
}

export default removeFieldsFromEntity
