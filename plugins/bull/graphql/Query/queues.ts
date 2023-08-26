import { getQueues } from '../../utils/setupQueues'

import type { QueryResolvers } from '../schema.generated'

const queues: QueryResolvers['queues'] = () => {
  const queues = getQueues()

  return queues
}

export default queues
