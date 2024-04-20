import mergeDeep from '@zemble/core/utils/mergeDeep'
import defaultConfig, { DEFAULT_SERVER_OUTPUT_SCHEMA_PATH, createServerOutputConfig } from '@zemble/graphql/codegen'

import type { CodegenConfig } from '@graphql-codegen/cli'

const hello: CodegenConfig = {
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
}

const config = mergeDeep<CodegenConfig>(defaultConfig, hello)

export default config
