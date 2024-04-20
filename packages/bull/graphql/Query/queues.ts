import { getQueues } from '../../utils/setupQueues'

import type { QueryResolvers } from '../schema.generated'

export const queues: NonNullable<QueryResolvers['queues']> = () => {
  const qs = getQueues()

  return qs
}

export default queues
