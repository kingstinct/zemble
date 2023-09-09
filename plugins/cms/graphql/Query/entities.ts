import type { QueryResolvers } from '../schema.generated'

// @ts-expect-error TODO: fix types
const entities: QueryResolvers['entities'] = async (_, __, { kv }) => {
  const result = await kv('cms-entities').values()
  return result
}

export default entities
