import { ObjectId } from 'mongodb'

import { Supplements } from '../../models'

import type { QueryResolvers } from '../schema.generated'

const mySupplementIntakes: QueryResolvers['mySupplementIntakes'] = async (_, __, { decodedToken }) => {
  const results = await Supplements.find({
    userId: new ObjectId(decodedToken.userId),
  })

  return results
}

export default mySupplementIntakes
