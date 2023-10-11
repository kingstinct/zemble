import type { Resolvers } from '../schema.generated'

const fieldResolver: Resolvers['StringField'] = {
  isSearchable: (obj) => obj.isSearchable ?? false,
}

export default fieldResolver
