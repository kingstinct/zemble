import { ObjectId } from 'mongodb'

import { Supplements } from '../../models'

import type { SupplementIntakeDbType } from '../../models'
import type {
  MutationResolvers,
} from '../schema.generated'
import type { DocumentForInsert } from 'papr'

const addSupplement: MutationResolvers['addSupplement'] = async (parent, {
  amountInGrams, foodId, intakeTime, supplementId,
}, { decodedToken }) => {
  const supplement: DocumentForInsert<typeof SupplementIntakeDbType[0], typeof SupplementIntakeDbType[1]> = {
    _id: supplementId ? new ObjectId(supplementId) : new ObjectId(),
    amountInGrams,
    foodId: new ObjectId(foodId),
    // userId: new ObjectId('5f9b3b3b9b3b9f9b3b9b3b9b'),
    intakeTime,
  }

  const s = await Supplements.findOneAndUpdate({ _id: supplement._id }, {
    $set: supplement,
  }, { upsert: true, returnDocument: 'after' })

  if (!s) {
    throw new Error('Could not add supplement')
  }

  return { ...s, ...supplement }
}

export default addSupplement
