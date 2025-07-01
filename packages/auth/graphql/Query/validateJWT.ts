import { verifyJwt } from '../../utils/verifyJwt'

import type { QueryResolvers } from '../schema.generated'

export const validateJWT: NonNullable<QueryResolvers['validateJWT']> = async (_: unknown, { token }: { readonly token: string }) => {
  try {
    await verifyJwt(token)
    return true
  } catch (_e) {
    return false
  }
}

export default validateJWT
