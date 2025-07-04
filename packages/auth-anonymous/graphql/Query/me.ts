import type { TokenContents } from '@zemble/core'
import type { QueryResolvers } from '../schema.generated'

export const me: NonNullable<QueryResolvers['me']> = (
  _,
  __,
  { decodedToken },
) => decodedToken as TokenContents

export default me
