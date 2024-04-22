import { ObjectId } from 'mongodb'

import { Supplements } from '../../models'

import type { SupplementIntakeDbType } from '../../models'
import type {
  MutationResolvers,
} from '../schema.generated'
import type { DocumentForInsert } from 'papr'

export const addSupplement: NonNullable<MutationResolvers['addSupplement']> = async (parent, {
  amountInGrams, foodId, intakeTime, supplementId,
}, { decodedToken }) => {
  const supplement: DocumentForInsert<typeof SupplementIntakeDbType[0], typeof SupplementIntakeDbType[1]> = {
    amountInGrams,
    foodId: new ObjectId(foodId),
    userId: new ObjectId(decodedToken!.userId),
    intakeTime,
  }

  const _id = supplementId ? new ObjectId(supplementId) : new ObjectId()

  const s = await Supplements.findOneAndUpdate({ _id }, {
    $set: supplement,
    $setOnInsert: {
      _id,
    },
  }, { upsert: true, returnDocument: 'after' })

  if (!s) {
    throw new Error('Could not add supplement')
  }

  return { ...s, ...supplement }
}

export default addSupplement
