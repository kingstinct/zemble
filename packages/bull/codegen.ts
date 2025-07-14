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
          BullJob: 'bullmq#Job',
          BullQueue: 'bullmq#Queue',
        },
      },
    },
  },
}

export default config
