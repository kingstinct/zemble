import { readEntities } from '../../utils/fs'

import type { QueryResolvers } from '../schema.generated'

const entities: QueryResolvers['entities'] = async () => {
  const result = await readEntities()

  return result.map((entity) => ({
    ...entity,
    fields: Object.values(entity.fields),
  }))
}

export default entities
