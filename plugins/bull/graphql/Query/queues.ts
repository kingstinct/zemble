import { getQueues } from '../../utils/setupQueues'

import type { QueryResolvers } from '../schema.generated'

const queues: QueryResolvers['queues'] = () => {
  const qs = getQueues()

  return qs
}

export default queues
