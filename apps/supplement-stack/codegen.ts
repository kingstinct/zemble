import mergeDeep from '@zemble/core/utils/mergeDeep'
import defaultConfig, { DEFAULT_SERVER_OUTPUT_SCHEMA_PATH, createServerOutputConfig } from '@zemble/graphql/codegen'

import type { CodegenConfig } from '@graphql-codegen/cli'

const config = {
  generates: {
    [DEFAULT_SERVER_OUTPUT_SCHEMA_PATH]: {
      ...createServerOutputConfig(),
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
} satisfies CodegenConfig

export default mergeDeep(defaultConfig, config)
