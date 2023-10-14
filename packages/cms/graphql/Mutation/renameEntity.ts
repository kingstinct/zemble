import papr from '../../clients/papr'
import { readEntities, writeEntities } from '../../utils/fs'

import type { EntitySchemaType } from '../../types'
import type { MutationResolvers } from '../schema.generated'

const renameEntity: MutationResolvers['renameEntity'] = async (_, { fromNamePlural, toNameSingular, toNamePlural: pluralIn }, { pubsub }) => {
  const namePlural = pluralIn.trim()

  const nameSingular = toNameSingular?.trim() ?? namePlural.replace(/s$/, '')

  const { db } = papr

  let updated: EntitySchemaType | undefined | null

  const entities = await readEntities()
  const entitiesUpdated = entities.map((entity) => {
    if (entity.namePlural === fromNamePlural) {
      updated = {
        ...entity,
        nameSingular,
        namePlural,
      }
      return updated
    }
    return entity
  })

  await writeEntities(entitiesUpdated)

  await db?.renameCollection(fromNamePlural, namePlural)

  if (!updated) {
    throw new Error(`Entity "${fromNamePlural}" not found`)
  }

  await papr.initializeCollection(namePlural)

  pubsub.publish('reload-schema', {})

  return { ...updated, fields: Object.values(updated.fields) }
}

export default renameEntity
