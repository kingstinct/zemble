import type { Resolvers } from '../schema.generated'

const fieldResolver: Resolvers['Field'] = {
  __resolveType: (obj) => obj.__typename!,
}

export default fieldResolver
