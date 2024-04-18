import mergeDeep from '@zemble/core/utils/mergeDeep'
import defaultConfig, { defaultServerOutputPath } from '@zemble/graphql/codegen'

import type { CodegenConfig } from '@graphql-codegen/cli'

const hello: CodegenConfig = {
  schema: `./graphql/**/*.graphql`,
  generates: {
    [defaultServerOutputPath]: {
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
