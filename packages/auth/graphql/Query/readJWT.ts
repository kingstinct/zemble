import { verifyJwt } from '../../utils/verifyJwt'

import type { QueryResolvers } from '../schema.generated'

export const readJWT: NonNullable<QueryResolvers['readJWT']> = async (
  _,
  { token },
) => verifyJwt(token)

export default readJWT
