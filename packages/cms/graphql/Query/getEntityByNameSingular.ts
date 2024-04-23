import { readEntities } from '../../utils/fs'

import type { QueryResolvers } from '../schema.generated'

export const getEntityByNameSingular: NonNullable<QueryResolvers['getEntityByNameSingular']> = async (_, { name }) => {
  const entities = await readEntities()
  const result = entities.find((entity) => entity.nameSingular === name)

  if (!result) {
    return null
  }

  return { ...result, fields: Object.values(result.fields) }
}

export default getEntityByNameSingular
