import type { Resolvers } from '../schema.generated'

const entities: Resolvers['User'] = {
  id: (parent) => parent._id.toHexString(),
}

export default entities
