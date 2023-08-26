import defaultConfig from '@readapt/graphql-yoga/codegen'

import type { CodegenConfig } from '@graphql-codegen/cli'

console.log('bull codegen', process.cwd())

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

console.log('bull codegen config', JSON.stringify(config, null, 2))

export default config
