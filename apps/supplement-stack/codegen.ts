import mergeDeep from '@zemble/core/utils/mergeDeep'
import defaultConfig from '@zemble/graphql/codegen'

import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  generates: {
    [`./graphql/schema.generated.ts`]: {
      config: {
        mappers: {
          Ingredient: '../models#EatableDbType',
          Food: '../models#EatableDbType',
          Eatable: '../models#EatableDbType',
          SupplementIntake: '../models#SupplementIntakeDbType',
        },
        scalars: {
          DateTime: 'string',
          ObjectId: 'string',
        },
      },
    },
  },
}

export default mergeDeep<CodegenConfig>(defaultConfig, config)
