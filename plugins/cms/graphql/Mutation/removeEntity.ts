import { Entities } from '../../clients/papr'

import type { MutationResolvers } from '../schema.generated'

const removeEntity: MutationResolvers['removeEntity'] = async (_, { name }, { pubsub }) => {
  await Entities.findOneAndDelete({ name })

  pubsub.publish('reload-schema', {})

  return true
}

export default removeEntity
