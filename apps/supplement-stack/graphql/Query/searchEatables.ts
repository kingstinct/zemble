import { Eatables } from '../../models'

import type { QueryResolvers } from '../schema.generated'

const searchEatables: QueryResolvers['searchEatables'] = async (_, { query }) => {
  const results = await Eatables.find({
    $text: {
      $search: query,
      $caseSensitive: false,
      $diacriticSensitive: false,
    },
  })

  return results
}

export default searchEatables
