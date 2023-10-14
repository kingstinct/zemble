import defaultConfig from '@zemble/graphql/codegen'

import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  ...defaultConfig,
  generates: {
    ...defaultConfig.generates,
    [`./graphql/schema.generated.ts`]: {
      ...defaultConfig.generates[`./graphql/schema.generated.ts`],
      config: {
        ...defaultConfig.generates[`./graphql/schema.generated.ts`].config,
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

export default config
