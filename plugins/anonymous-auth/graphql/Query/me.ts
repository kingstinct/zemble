import type { QueryResolvers } from '../schema.generated'

const me: QueryResolvers['me'] = (_, __, { decodedToken }) => decodedToken!

export default me
