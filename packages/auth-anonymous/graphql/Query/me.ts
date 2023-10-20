import type { QueryResolvers } from '../schema.generated'
import type { TokenContents } from '@zemble/core'

const me: QueryResolvers['me'] = (_, __, { decodedToken }) => decodedToken as TokenContents

export default me
