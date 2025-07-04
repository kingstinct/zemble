import type { CodegenConfig } from '@graphql-codegen/cli'
import defaultConfig, {
  createServerOutputConfig,
  DEFAULT_SERVER_OUTPUT_SCHEMA_PATH,
} from '@zemble/graphql/codegen'
import mergeDeep from '@zemble/utils/mergeDeep'

const hello = {
  schema: `./graphql/**/*.graphql`,
  generates: {
    [DEFAULT_SERVER_OUTPUT_SCHEMA_PATH]: {
      ...createServerOutputConfig(),
      config: {
        mappers: {
          User: '../clients/papr#UserType',
          Permission: '../clients/papr#Permission',
          PermissionInput: '../clients/papr#Permission',
        },
        scalars: {
          DateTime: 'string',
          ObjectId: 'string',
        },
      },
    },
  },
} satisfies CodegenConfig

const config = mergeDeep(defaultConfig, hello)

export default config
