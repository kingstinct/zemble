import { isAPIKeyValid } from '../../utils/isAPIKeyValid'

import type { QueryResolvers } from '../schema.generated'

export const validateAPIKey: NonNullable<QueryResolvers['validateAPIKey']> = async (_, { apiKey }) => {
  const isValid = await isAPIKeyValid(apiKey)
  return !!isValid
}

export default validateAPIKey
