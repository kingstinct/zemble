import { readEntities } from '../../utils/fs'

import type { QueryResolvers } from '../schema.generated'

export const getEntityByNamePlural: NonNullable<
  QueryResolvers['getEntityByNamePlural']
> = async (_, { namePlural }) => {
  const entities = await readEntities()
  const result = entities.find((entity) => entity.namePlural === namePlural)

  if (!result) {
    return null
  }

  return result
}

export default getEntityByNamePlural
