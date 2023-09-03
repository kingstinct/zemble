import { Supplements } from '../../models'

import type { QueryResolvers } from '../schema.generated'

const mySupplementIntakes: QueryResolvers['mySupplementIntakes'] = async () => {
  const results = await Supplements.find({

  })

  return results
}

export default mySupplementIntakes
