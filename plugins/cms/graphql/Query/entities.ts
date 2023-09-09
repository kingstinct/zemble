import { Entity } from '../../clients/papr'

import type { QueryResolvers } from '../schema.generated'

const entities: QueryResolvers['entities'] = async () => {
  const result = await Entity.find({})

  return result
}

export default entities
