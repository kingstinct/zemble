import papr from '../../clients/papr'
import { readEntities, writeEntities } from '../../utils/fs'

import type { EntitySchemaType } from '../../clients/papr'
import type { MutationResolvers } from '../schema.generated'

const renameEntity: MutationResolvers['renameEntity'] = async (_, { fromName, toName, pluralizedName: pluralIn }, { pubsub }) => {
  const name = toName.trim()

  const pluralizedName = pluralIn.trim()

  const { db } = papr

  let updated: EntitySchemaType | undefined | null

  const entities = await readEntities()
  const entitiesUpdated = entities.map((entity) => {
    if (entity.pluralizedName === fromName) {
      updated = {
        ...entity,
        name,
        pluralizedName,
      }
      return updated
    }
    return entity
  })

  await writeEntities(entitiesUpdated)

  await db?.renameCollection(fromName, pluralizedName)

  if (!updated) {
    throw new Error(`Entity "${fromName}" not found`)
  }

  await papr.initializeCollection(pluralizedName)

  pubsub.publish('reload-schema', {})

  return { ...updated, fields: Object.values(updated.fields) }
}

export default renameEntity
