import defaultConfig from '@readapt/graphql-yoga/codegen'

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
          Job: 'bullmq#Job',
          Queue: 'bullmq#Queue',
        },
      },
    },
  },
}

export default config