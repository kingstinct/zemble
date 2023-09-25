import papr, { } from '../../clients/papr'

import type { QueryResolvers } from '../schema.generated'

const getEntityByPluralizedName: QueryResolvers['getEntityByPluralizedName'] = async (_, { pluralizedName }) => {
  const result = await papr.Entities.findOne({ pluralizedName })

  if (!result) {
    return null
  }

  return { ...result, fields: Object.values(result.fields) }
}

export default getEntityByPluralizedName
