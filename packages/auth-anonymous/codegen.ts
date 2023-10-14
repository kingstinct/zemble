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
          User: '@zemble/core/types#TokenContents',
        },
      },
    },
  },
}

export default config
