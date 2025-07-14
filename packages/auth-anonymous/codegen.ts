import type { CodegenConfig } from '@graphql-codegen/cli'
import { createClientConfig, createServerConfig } from '@zemble/graphql/codegen'

const serverConfig = createServerConfig({})
const clientConfig = createClientConfig({})

const serverOutput = serverConfig.generates![
  './graphql/schema.generated.ts'
] as any

const config: CodegenConfig = {
  ...serverConfig,
  ...clientConfig,
  generates: {
    ...serverConfig.generates,
    ...clientConfig.generates,
    './graphql/schema.generated.ts': {
      ...serverOutput,
      config: {
        ...serverOutput?.config,
        mappers: {
          User: '@zemble/core/types#TokenContents',
        },
      },
    },
  },
}

export default config
