import { User } from '../../clients/papr'

import type { QueryResolvers } from '../schema.generated'

export const users: NonNullable<QueryResolvers['users']> = async () => {
  const result = await User.find({})

  return result
}

export default users
