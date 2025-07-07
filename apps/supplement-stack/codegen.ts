import type { CodegenConfig } from '@graphql-codegen/cli'
import defaultConfig, {
  createServerOutputConfig,
  DEFAULT_SERVER_OUTPUT_SCHEMA_PATH,
} from '@zemble/graphql/codegen'
import mergeDeep from '@zemble/utils/mergeDeep'

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
