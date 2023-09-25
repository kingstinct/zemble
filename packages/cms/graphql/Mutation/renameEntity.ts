import { Content, Entities, getClient } from '../../clients/papr'

import type { EntityType } from '../../clients/papr'
import type { MutationResolvers } from '../schema.generated'

const renameEntity: MutationResolvers['renameEntity'] = async (_, { fromName, toName, pluralizedName: pluralIn }, { pubsub }) => {
  const name = toName.trim()

  const pluralizedName = pluralIn.trim()

  const client = await getClient()
  const session = client.startSession()

  let updated: EntityType | undefined | null

  await session.withTransaction(async () => {
    updated = await Entities.findOneAndUpdate({ name: fromName }, {
      $set: {
        name,
        pluralizedName,
      },
    }, {
      returnDocument: 'after',
      session,
    })

    await Content.updateMany({ entityType: fromName }, {
      $set: { entityType: name },
    }, {
      session,
    })
  })

  if (!updated) {
    throw new Error(`Entity "${fromName}" not found`)
  }

  pubsub.publish('reload-schema', {})

  return { ...updated, fields: Object.values(updated.fields) }
}

export default renameEntity
