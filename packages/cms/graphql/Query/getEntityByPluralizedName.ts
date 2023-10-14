import { readEntities } from '../../utils/fs'

import type { QueryResolvers } from '../schema.generated'

const getEntityByPluralizedName: QueryResolvers['getEntityByPluralizedName'] = async (_, { pluralizedName }) => {
  const entities = await readEntities()
  const result = entities.find((entity) => entity.pluralizedName === pluralizedName)

  if (!result) {
    return null
  }

  return { ...result, fields: Object.values(result.fields) }
}

export default getEntityByPluralizedName
