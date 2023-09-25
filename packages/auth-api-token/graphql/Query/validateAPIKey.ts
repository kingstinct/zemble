import { isAPIKeyValid } from '../../utils/isAPIKeyValid'

import type { QueryResolvers } from '../schema.generated'

const validateAPIKeyResolver: QueryResolvers['validateAPIKey'] = async (_, { apiKey }) => {
  const isValid = await isAPIKeyValid(apiKey)
  return !!isValid
}

export default validateAPIKeyResolver
