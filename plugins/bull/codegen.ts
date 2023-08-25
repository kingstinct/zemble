import type { CodegenConfig } from '@graphql-codegen/cli';
import defaultConfig from '@readapt/graphql-yoga/codegen'

const config:CodegenConfig = {
  ...defaultConfig,
  generates: {
    ...defaultConfig.generates,
    './graphql/schema.generated.ts': {
      ...defaultConfig.generates['./graphql/schema.generated.ts'],
      config: {
        ...defaultConfig.generates['./graphql/schema.generated.ts'].config,
        mappers: {
          Job: 'bullmq#Job',
        }
      }
    },
  },
}

export default config