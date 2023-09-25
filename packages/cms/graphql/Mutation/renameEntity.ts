import papr from '../../clients/papr'

import type { EntityType } from '../../clients/papr'
import type { MutationResolvers } from '../schema.generated'

const renameEntity: MutationResolvers['renameEntity'] = async (_, { fromName, toName, pluralizedName: pluralIn }, { pubsub }) => {
  const name = toName.trim()

  const pluralizedName = pluralIn.trim()

  const { client } = papr
  const session = client!.startSession()

  let updated: EntityType | undefined | null

  await session.withTransaction(async () => {
    updated = await papr.Entities.findOneAndUpdate({ name: fromName }, {
      $set: {
        name,
        pluralizedName,
      },
    }, {
      returnDocument: 'after',
      session,
    })

    await papr.Content.updateMany({ entityType: fromName }, {
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
