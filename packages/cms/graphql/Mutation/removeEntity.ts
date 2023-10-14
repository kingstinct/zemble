import { readEntities, writeEntities } from '../../utils/fs'

import type { MutationResolvers } from '../schema.generated'

const removeEntity: MutationResolvers['removeEntity'] = async (_, { namePlural }, { pubsub }) => {
  const entities = await readEntities()
  const entity = entities.filter((entity) => entity.namePlural !== namePlural)
  await writeEntities(entity)

  pubsub.publish('reload-schema', {})

  return true
}

export default removeEntity
