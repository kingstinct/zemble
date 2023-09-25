import { User } from '../../clients/papr'

import type { QueryResolvers } from '../schema.generated'

const entities: QueryResolvers['users'] = async () => {
  const result = await User.find({})

  return result
}

export default entities
