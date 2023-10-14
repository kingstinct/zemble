import { readEntities } from '../../utils/fs'

import type { QueryResolvers } from '../schema.generated'

const getEntityByName: QueryResolvers['getEntityByName'] = async (_, { name }) => {
  const entities = await readEntities()
  const result = entities.find((entity) => entity.name === name)

  if (!result) {
    return null
  }

  return { ...result, fields: Object.values(result.fields) }
}

export default getEntityByName
