import { readEntities, writeEntities } from '../../utils/fs'

import type { MutationResolvers } from '../schema.generated'

const removeEntity: MutationResolvers['removeEntity'] = async (_, { name }, { pubsub }) => {
  const entities = await readEntities()
  const entity = entities.filter((entity) => entity.name !== name)
  await writeEntities(entity)

  pubsub.publish('reload-schema', {})

  return true
}

export default removeEntity
