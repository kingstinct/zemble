import type { Resolvers } from '../schema.generated'

const fieldResolver: Resolvers['Entity'] = {
  fields: (parent) => Object.values(parent.fields),
}

export default fieldResolver
