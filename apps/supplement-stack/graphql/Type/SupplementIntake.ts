import { Eatables } from '../../models'

import type { SupplementIntakeResolvers } from '../schema.generated'

const SupplementIntake: SupplementIntakeResolvers = {
  food: async ({ foodId }) => {
    const eatable = await Eatables.findOne({ _id: foodId })

    return eatable!
  },
}

export default SupplementIntake
