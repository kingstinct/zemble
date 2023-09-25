import type { QueryResolvers } from '../schema.generated'

const me: QueryResolvers['me'] = (_, __, { decodedToken, token }) => {
  console.log({ decodedToken, token })
  return decodedToken!
}

export default me
