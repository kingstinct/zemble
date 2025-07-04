import { ObjectId } from 'mongodb'

import { Supplements } from '../../models'

import type { QueryResolvers } from '../schema.generated'

export const mySupplementIntakes: NonNullable<
  QueryResolvers['mySupplementIntakes']
> = async (_, __, { decodedToken }) => {
  const results = await Supplements.find({
    userId: new ObjectId(decodedToken!.sub),
  })

  return results
}

export default mySupplementIntakes
