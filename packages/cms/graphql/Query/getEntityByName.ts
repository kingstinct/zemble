import papr, { } from '../../clients/papr'

import type { QueryResolvers } from '../schema.generated'

const getEntityByName: QueryResolvers['getEntityByName'] = async (_, { name }) => {
  const result = await papr.Entities.findOne({ name })

  if (!result) {
    return null
  }

  return { ...result, fields: Object.values(result.fields) }
}

export default getEntityByName
