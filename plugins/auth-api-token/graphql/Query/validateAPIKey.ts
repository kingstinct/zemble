import { isAPIKeyValid } from '../../utils/isAPIKeyValid'

import type { QueryResolvers } from '../schema.generated'

const validateAPIKeyResolver: QueryResolvers['validateAPIKey'] = (_, { apiKey }) => isAPIKeyValid(apiKey)

export default validateAPIKeyResolver
