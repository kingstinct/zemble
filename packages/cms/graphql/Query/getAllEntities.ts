import { readEntities } from '../../utils/fs'

import type { QueryResolvers } from '../schema.generated'

export const getAllEntities: NonNullable<
  QueryResolvers['getAllEntities']
> = async () => {
  const result = await readEntities()

  return result.map((entity) => ({
    ...entity,
    fields: Object.values(entity.fields),
  }))
}

export default getAllEntities
