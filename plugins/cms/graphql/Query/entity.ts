import { Entity } from '../../clients/papr'

import type { QueryResolvers } from '../schema.generated'

const entity: QueryResolvers['entity'] = async (_, { name }) => {
  const result = await Entity.findOne({ name })

  return result
}

export default entity
